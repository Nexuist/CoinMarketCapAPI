"use strict";
var request = require("request")
var cheerio = require("cheerio")
var CoinFactory = require("./CoinFactory")

module.exports = class CoinCrawler {
  constructor(onCoin, onError, onFinish) {
    this.onCoin = onCoin
    this.onError = onError
    this.onFinish = onFinish
    this.crawl()
  }
  crawl() {
    var self = this
    request('http://coinmarketcap.com/', function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(body)
        var factory = new CoinFactory($("#currency-exchange-rates").data())
          // Iterate through every entry on the table
        var rows = $("#currencies").find("tbody").find("tr")
        if (rows.length != 100) {
          self.onError("Warning: Number of rows should be 100. Current rows: " + rows, -1)
        }
        if (rows.length == 0) {
          this.onFinish(0)
          return
        }
        var numCoinsUpdated = 0
        rows.each(function(i) {
          var newCoin = factory.produce($(rows[i]))
          self.onCoin(newCoin)
          numCoinsUpdated++
          if (numCoinsUpdated == rows.length) {
            self.onFinish(numCoinsUpdated)
          }
        })
      }
      else if (response) {
        self.onError("Status code mismatch.", response.statusCode)
      }
      else if (error) {
        self.onError(error, -1)
      }
    })
  }
}
