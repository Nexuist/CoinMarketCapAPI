#!/bin/env node
var express = require("express");
var fs = require("fs");

var APIServer = function() {
	var self = this;
    self.initialize = function() {
    	//  Set the environment variables we need
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;
        if (typeof self.ipaddress === "undefined") {
        	// Running locally
            console.warn("No OPENSHIFT_NODEJS_IP var, using localhost instead");
            self.ipaddress = "127.0.0.1";
        };
        self.app = express();
        // Set up routing
        self.app.get("/", self.index);
        self.app.get("/api/*", self.APIRequest);

        // Set up error and termination handling handling
        ["SIGHUP", "SIGINT", "SIGQUIT", "SIGILL", "SIGTRAP", "SIGABRT",
         "SIGBUS", "SIGFPE", "SIGUSR1", "SIGSEGV", "SIGUSR2", "SIGTERM"
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.stop(element); });
        });
        process.on("exit", function() { self.stop(); });
    };
    
    self.start = function() {
        //  Start the app on the specific interface (and port)
        self.app.listen(self.port, self.ipaddress, function() {
            console.log("%s: Node server started on %s:%d",
                        Date(Date.now()), self.ipaddress, self.port);
        });
    };
    
    self.stop = function(sig) {
        if (typeof sig === "string") {
           console.log("%s: Received %s - terminating app.",
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log("%s: Node server stopped.", Date(Date.now()) );
    };

	// Request handling
	self.index = function(req, res) {
		res.setHeader("Content-Type", "text/html");
		res.sendfile(__dirname + "/index.html");
	}

	self.APIRequest = function (req, res) {
		dataDir = process.env.OPENSHIFT_DATA_DIR + "/cache/";
		currency = req.path.substring(5).toLowerCase();
		res.setHeader("Content-Type", "application/json");
		fs.readFile(dataDir + currency + ".json", function (error, data) {
			if (error) {
				res.send({"error": "Currency not found"});
				return;
			} 
			res.send(data);
		});
		
	}
}; 


var server = new APIServer();
server.initialize();
server.start();

