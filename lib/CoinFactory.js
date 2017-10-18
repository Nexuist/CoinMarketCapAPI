"use strict";

module.exports = class CoinFactory {
  constructor(exchangeRates) {
    this.exchangeRates = exchangeRates
  }
  currencyDictionary(metric) {
    var dict = {}
    var self = this
    var usd = metric.data("usd")
    var btc = metric.data("btc")
    Object.keys(self.exchangeRates).forEach(function (currency) {
      dict[currency] = usd / self.exchangeRates[currency]
    })
    dict["btc"] = btc / 1.0
    return dict
  }
  
  produce(tr) {
    var self = this
    var tds = tr.find("td") // Array of tds in this tr
    var td = function (index) {
      return tds.eq(index).text().trim()
    }

    var col2 = tds.eq(1).text().trim().split(" ");
    // console.log(col2);
    // console.log(col2[0].trim());
    // console.log(col2[col2.length-1].trim());
    // a[42]
   
    var coin = {
      "symbol": col2[0].trim().toLowerCase(), // tds.eq(5).text().match(/\s([a-z]|[0-9]|@)+\s/i)[0].trim().toLowerCase(),
      "position": td(0),
      "name": col2[col2.length-1].trim(), // tds.eq(1).find("img").attr("alt"),
      "market_cap": self.currencyDictionary(tds.eq(2)),
      "price": self.currencyDictionary(tds.eq(3).find("a").eq(0)),
      "supply": td(4).replace(/\D/g, "").trim(), // Remove all non-numeric characters
      "volume": self.currencyDictionary(tds.eq(4).find("a").eq(0)), // self.currencyDictionary(tds.eq(5).find("a").eq(0)),
      "change": td(6).replace("%", "").trim(),
      "timestamp": (Date.now() / 1000).toString()
    }
    return coin
  }
}
