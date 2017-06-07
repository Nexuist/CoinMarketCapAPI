"use strict";

var restify = require("restify")
var request = require("request")

var Rollbar = require('rollbar');
var rollbar = new Rollbar({
    accessToken: process.env.ROLLBAR_KEY,
    handleUncaughtExceptions: true,
    handleUnhandledRejections: true,
    payload: {
        environment: process.env.ENVIRONMENT
    }
});

var CoinAPI = require("./lib/CoinAPI")
var self = null

module.exports = class Server {
    constructor(address, port, trackingID) {
        self = this
        self.address = address
        self.port = port
        self.trackingID = trackingID
        this.api = new CoinAPI()
        self.metrics = {
            "startTime": 0,
            "lastSuccessfulRefresh": 0,
            "coins": 0
        }
        self.app = restify.createServer({
                "name": "CoinmarketCap API Server"
            })
            /* Register quit events so the server quits when it's supposed to */
        var events = ["SIGHUP", "SIGINT", "SIGQUIT", "SIGILL", "SIGTRAP", "SIGABRT",
            "SIGBUS", "SIGFPE", "SIGUSR1", "SIGSEGV", "SIGUSR2", "SIGTERM"
        ]
        events.forEach(function(event) {
                process.on(event, function() {
                    self.stop(event)
                })
            })
            /* Rate limiting */
        self.app.use(restify.throttle({
            burst: 100,
            rate: 50, // requests/second
            ip: true
        }))

        self.app.use(rollbar.errorHandler());

        /* Serve index file */
        self.app.get("/", function(req, res, next) {
                    next()
                },
                restify.serveStatic({
                    directory: __dirname,
                    file: "index.html"
                }))
            /* Serve API */
        this.app.get(/\/api\/*/, self.handleAPIRequest)
            /* Metrics */
        self.app.get("/metrics", self.handleMetricsRequest)
            /* Schedule API refresh */
        self.APIRefreshHandler = setInterval(self.handleAPIRefresh, 300000)
            /* Initial refresh */
        self.handleAPIRefresh()
    }
    start() {
        self.app.listen(self.port, function() {
            // Server started
            self.metrics.startTime = Date(Date.now())
            self.log("Server started.")
        })
    }
    trackEvent(category, action, value) {
        if (!self.trackingID) return
            // https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
        request.post("https://www.google-analytics.com/collect").form({
            v: 1,
            t: "event",
            tid: self.trackingID,
            uid: "server",
            ec: category,
            ea: action,
            ev: value
        })
    }
    log(msg, isSevere) {
        console.log("%s: %s", Date(Date.now()), msg)
    }
    handleAPIRequest(req, res, next) {
        var coin = null
        var property = null
        var result = null
        var query = req.path().substring(5).toLowerCase()
        self.trackEvent("Request", query)
        if (query == "") {
            res.send({ "error": "This isn't an endpoint!" })
            return
        }
        if (query == "all") {
            res.send(self.api.coins)
            return
        }
        var slashLocation = query.indexOf("/")
        var queryContainsProperty = (slashLocation > -1) // i.e. /api/btc/market_cap
        if (queryContainsProperty) {
            property = query.substring(slashLocation + 1)
            coin = query.substring(0, slashLocation)
        } else {
            coin = query
        }
        coin = self.api.getCoin(coin)
        if (coin) {
            if (property) {
                if (coin[property]) {
                    result = coin[property]
                } else {
                    result = { "error": "Invalid property requested" }
                }
            } else {
                result = coin
            }
        } else {
            result = { "error": "Requested coin does not exist or has not been updated yet." }
        }
        res.setHeader("Content-Type", "application/json")
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Headers", "X-Requested-With")
        res.send(result)
    }
    handleAPIRefresh() {
        self.api.refresh(function(numCoinsUpdated) {
            var success = (numCoinsUpdated == 100)
            var isSevere = !success
            self.log("Updated " + numCoinsUpdated + " coins. Success: " + success, isSevere)
            self.trackEvent("Update", success ? "Success" : "Failure", numCoinsUpdated)
            if (success) {
                self.metrics.lastSuccessfulRefresh = Date(Date.now())
                self.metrics.coins = numCoinsUpdated
            }
        }, function(error, statusCode) {
            console.log("Error while refreshing API", error, "with status code", statusCode)
            self.trackEvent("Update", "Error", statusCode)
        })
    }
    handleMetricsRequest(req, res, next) {
        res.setHeader("Content-Type", "application/json")
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Headers", "X-Requested-With")
        res.send(self.metrics)
        next()
    }
    stop(event) {
        // Server stopped
        clearInterval(self.APIRefreshHandler)
        self.log("Server stopped with event: " + event + ". Last metrics: " + JSON.stringify(this.metrics))
        process.exit(1)
    }
}
