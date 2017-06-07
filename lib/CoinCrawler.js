"use strict";
var fs = require('fs')
var request = require("request")
var cheerio = require("cheerio")
var CoinFactory = require("./CoinFactory")
var CoinDatabase = require("./CoinDatabase")

module.exports = class CoinCrawler {
    constructor(onCoin, onError, onFinish) {
        var self = this;

        this.onCoin = onCoin
        this.onError = onError
        this.onFinish = onFinish
        CoinDatabase.initDb(function() {
            console.log("connected to the db...");
            self.crawl();
        }, function() {
            console.log("error connecting to the db...");
        })
    }

    email(coin) {
        var nodemailer = require('nodemailer');
        var mg = require('nodemailer-mailgun-transport');

        var auth = {
            auth: {
                api_key: process.env.MAILGUN_API_KEY,
                domain: process.env.MAILGUN_DOMAIN
            }
        }

        // create reusable transporter object using the default SMTP transport
        var transporter = nodemailer.createTransport(mg(auth));

        fs.readFile('emails/alert.html', 'utf8', function(err, data) {
            if (err) throw err;
            var html = data;
            html = html.replace("{{ name }}", coin.name);
            html = html.replace("{{ symbol }}", coin.symbol);
            html = html.replace("{{ symbol }}", coin.symbol);
            html = html.replace("{{ price_usd }}", coin.price.usd);
            html = html.replace("{{ price_btc }}", coin.price.btc);
            html = html.replace("{{ volume_usd }}", coin.price.usd);
            html = html.replace("{{ volume_btc }}", coin.price.volume);
            html = html.replace("{{ link }}", coin.price.volume);


            // setup email data with unicode symbols
            var mailOptions = {
                from: process.env.FROM,
                to: process.env.TO,
                subject: '[ICO WATCHDOG] ' + coin.name + ' (' + coin.symbol.toUpperCase() + ') is now trading'
                html: html
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent:', info);
            });
        })
    }

    crawl() {
        var self = this
        request('http://coinmarketcap.com/all/views/all/', function(error, response, body) {
            if (!error && response.statusCode == 200) {


                var $ = cheerio.load(body)
                var factory = new CoinFactory($("#currency-exchange-rates").data())
                    // Iterate through every entry on the table
                var rows = $("#currencies-all").find("tbody").find("tr")
                if (rows.length < 100) {
                    self.onError("Warning: Number of rows should be greater than 100. Current rows: " + rows, -1)
                }
                if (rows.length == 0) {
                    this.onFinish(0)
                    return
                }
                var numCoinsUpdated = 0
                rows.each(function(i) {
                    var newCoin = factory.produce($(rows[i]))

                    CoinDatabase.checkIfCoinExist(newCoin, function(err, response) {
                        if (err) rollbar.handleError(err);
                        //console.log("user count" ,response)
                        if (response == 0) {
                            CoinDatabase.storeCoin(newCoin, function(err, response) {
                                if (err) console.log(err);
                                //console.log("stored user profile")
                            })
                            self.email(newCoin);
                        } else {
                            CoinDatabase.updateCoin(newCoin, function(err, response) {
                                if (err) console.log(err);
                                //console.log("updated user profile")
                            })
                        }
                    });

                    self.onCoin(newCoin)
                    numCoinsUpdated++
                    if (numCoinsUpdated == rows.length) {
                        self.onFinish(numCoinsUpdated)
                    }
                })
            } else if (response) {
                self.onError("Status code mismatch.", response.statusCode)
            } else if (error) {
                self.onError(error, -1)
            }
        })
    }
}
