"use strict";
var CoinCrawler = require("./CoinCrawler")

module.exports = class CoinAPI {
  constructor() {
    this.coins = {}
    this.initialized = false
  }
  refresh(callback) {
    var self = this
    var crawler = new CoinCrawler(function(coin) {
        self.coins[coin.symbol] = coin
      },
      function(error, statusCode) {
        console.log(error, statusCode)
      },
      callback)
  }
  getCoin(coin) {
    if (this.coins[coin]) {
      return this.coins[coin]
    }
    else {
      return null
    }
  }
}
