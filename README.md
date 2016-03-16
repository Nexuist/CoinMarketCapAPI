CoinMarketCapAPI
================

JSON API for coinmarketcap.com hosted on OpenShift.

<<<<<<< HEAD
For documentation and demos visit http://coinmarketcap-nexuist.rhcloud.com

TODO
====

* Implement legacy API
* Implement APIv2
* Change shouldSendMail to TRUE
  * Make environment variable
* Redo update.js
  * Dynamic currency loading
  * Modularize
* Change data dir to __dirname + /data
* Document files in here
* index.html
  * Add GitHub buttons (https://ghbtns.com)
  * Request counters
  * Better BTC/DOGE buttons
* Unit tests
  * # files = 100
  * All file properties = numeric
  * Correct currencies
  * API request handlers return correct responses
  * periodic.js - run unit tests & email if error
* Email if error (crash.js)

Environment Variables
======================

In case you're interested in running this on your own OpenShift instance, here are the environment variables used:
* `OPENSHIFT_NODEJS_IP` - IP address for HTTP server to listen on
* `OPENSHIFT_NODEJS_PORT` - Port for HTTP server to listen on
* `MAILGUN_API_KEY` - API key for [Mailgun](https://mailgun.com) service, used to send email notifications
* `TO_EMAIL` - Email address to send notification emails to
* `FROM_EMAIL` - Email address to send notification emails from

You can also edit and run the provided `globals.sh` bash script to set up custom values for those variables if you want to test locally.

Logging
=======

This project uses two methods of logging:
* `console.log` - OpenShift will put these into a log file automatically.
* `mailer.js` - A barebones logger that wraps Mailgun's API wrapper (yo dawg) to provide automated email no