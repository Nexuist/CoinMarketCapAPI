#!/bin/env node
var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");

var currencies = ["usd", "eur", "cny", "cad", "rub", "btc"];
var currencyExchangeRates = Array();
var data = {};

request('http://coinmarketcap.com', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    $ = cheerio.load(body);
    currencyExchangeRates = $("#currency-exchange-rates").data();
    // Go through every currency
    $("tr").each(function (i) {
    	// When index is 0 it gets passed a nonexistent tr for some reason
    	// wtf!?
    	if (i > 0) {
        var symbol = $(this).attr("id").substring(3); // ex. id-btc gets turned into btc
    		var td = $(this).find("td");
  			var position = td.eq(0).text().trim();
  			var name = td.eq(1).text().trim();
        var re = /\s([a-z]|[0-9])+\s/i;
        var supplyText = td.eq(4).text();
        var symbol = supplyText.match(re)[0].trim().toLowerCase(); // Use regex to get the symbol at the end of the supply td
  			var marketCap = currencyDictionary(td.eq(2));
        var price = currencyDictionary(td.eq(3).find("a").eq(0));
  			var supply = td.eq(4).text().replace(/\D/g, "").trim(); // Replace all non digit characters with nothing
  			var volume = currencyDictionary(td.eq(5).find("a").eq(0));
  			var change = td.eq(6).text().replace("%", "").trim();
  			var timestamp = Date.now() / 1000; // Seconds since unix epoch
  			data[name] = {
          "symbol": symbol,
  				"position": position,
  				"market_cap": marketCap,
  				"price": price,
  				"supply": supply,
  				"volume": volume,
  				"change": change,
  				"timestamp": timestamp};
		  }
    });
    writeData();
  }
});

function currencyDictionary(item) {
  // Iterate through currencies and fill the values in with the given item
  var resultArray = {};
  currencies.forEach(function(currency) {
    if (currency == "btc") {
      var result = item.data("btc");
    }
    else {
      // Grab the value in USD and divide by the currency exchange rate for the specific currency to get the value in that currency
      var result = item.data("usd") / currencyExchangeRates[currency];
    }
    resultArray[currency] = result.toString().replace(/,/g,"");
  });
  return resultArray;
}

function writeData() {
	dataDir = process.env.OPENSHIFT_DATA_DIR + "cache/";
  if (typeof process.env.OPENSHIFT_DATA_DIR === "undefined")
    dataDir = "cache/"; // Running locally
	callback = function(error) {
		if (error) {
			console.log(error);
		}
	};
	for (currency in data) {
    // Currency is a string, so use it to get the array filled with info
		info = data[currency];
		fileName = dataDir + info["symbol"] + ".json";
		fs.writeFile(fileName, JSON.stringify(info), callback);
	}
	fs.writeFile(dataDir + "all.json", JSON.stringify(data), callback);
}
