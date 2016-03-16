"use strict";

var Server = require("./server.js")

//var instance = new Server("127.0.0.1", 8080)
var instance = new Server(process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1", process.env.OPENSHIFT_NODEJS_PORT || 8080)
instance.start()
