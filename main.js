"use strict";

var Server = require("./server.js")

var instance = new Server("127.0.0.1", 8080)
instance.start()
