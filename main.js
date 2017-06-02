"use strict";

var Server = require("./server.js")

var instance = new Server(process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1", process.env.PORT || 8080, process.env.TRACKING_ID || null)
instance.start()
