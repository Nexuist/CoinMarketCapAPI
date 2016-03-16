CoinMarketCapAPI v2.0
=====================

JSON API for coinmarketcap.com hosted on OpenShift.

To run, `npm install && npm start`.

New in 2.0
===========

* No more files! All data storage is done on memory.
* Updating data and serving data are now done together.
* New metrics endpoint (/metrics). Let me know if there's something else you want tracked.
* Better logging.
* No more cronjobs - the 5 minute refresh is implemented through `setInterval()`.
* Completely rewritten to use ES6 classes for better modularization and the other benefits that come from OO.
