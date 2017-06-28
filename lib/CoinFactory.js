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
        Object.keys(self.exchangeRates).forEach(function(currency) {
            dict[currency] = usd / self.exchangeRates[currency]
        })
        dict["btc"] = btc
        return dict
    }
    produce(tr) {
        var self = this
        var tds = tr.find("td") // Array of tds in this tr
        var td = function(index) {
            return tds.eq(index).text().trim()
        }
        var coin = {
            "symbol": tds.eq(2).text().trim().toLowerCase(),
            "position": td(0),
            "name": tds.eq(1).find("img").attr("alt"),
            "market_cap": self.currencyDictionary(tds.eq(3)),
            "price": self.currencyDictionary(tds.eq(4).find("a").eq(0)),
            "supply": td(5).replace(/\D/g, "").trim(), // Remove all non-numeric characters
            "volume": self.currencyDictionary(tds.eq(6).find("a").eq(0)),
            "change": td(7).replace("%", "").trim(),
            "timestamp": (Date.now() / 1000).toString(),
            "link": tds.eq(1).find("a").attr("href"),
        }
        return coin
    }
}
