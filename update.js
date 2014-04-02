#!/bin/env node
var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");

var data = {};

request('http://coinmarketcap.com', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    $ = cheerio.load(body);
    // Go through every currency
    $("tr").each(function (i) {
    	var symbol = $(this).attr("id");
    	// When index is 0 it gets passed a nonexistent tr for some reason
    	// wtf!?
    	if (i > 0) {
    		var td = $(this).find("td");
			var position = td.eq(0).text().trim();
			var name = td.eq(1).text().trim();
			var marketCap = {"usd": extractCurrency(td.eq(2), "usd"),
				"eur": extractCurrency(td.eq(2), "eur"),
				"cny": extractCurrency(td.eq(2), "cny"),
				"cad": extractCurrency(td.eq(2), "cad"),
				"rub": extractCurrency(td.eq(2), "rub"),
				"btc": extractCurrency(td.eq(2), "btc")};	
			var price = {"usd": extractCurrency(td.eq(3).find("a").eq(0), "usd"),
				"eur": extractCurrency(td.eq(3).find("a").eq(0), "eur"),
				"cny": extractCurrency(td.eq(3).find("a").eq(0), "cny"),
				"cad": extractCurrency(td.eq(3).find("a").eq(0), "cad"),
				"rub": extractCurrency(td.eq(3).find("a").eq(0), "rub"),
				"btc": extractCurrency(td.eq(3).find("a").eq(0), "btc")};	
			var supply = td.eq(4).text().replace(/\D/g, "").trim(); // Replace all non digit characters with null
			var volume = {"usd": extractCurrency(td.eq(5).find("a").eq(0), "usd"),
				"eur": extractCurrency(td.eq(5).find("a").eq(0), "eur"),
				"cny": extractCurrency(td.eq(5).find("a").eq(0), "cny"),
				"cad": extractCurrency(td.eq(5).find("a").eq(0), "cad"),
				"rub": extractCurrency(td.eq(5).find("a").eq(0), "rub"),
				"btc": extractCurrency(td.eq(5).find("a").eq(0), "btc")};	
			var change = td.eq(6).text().replace("%", "").trim();
			var timestamp = (new Date).getTime(); // Seconds since unix epoch
			data[name] = {"symbol": symbol,
				"position": position,
				"marketCap": marketCap,
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

function extractCurrency(item, currency) {
	return item.data(currency).toString().replace(/,/g,""); // Regular expression to remove all commas
}


function writeData() {
	dataDir = process.env.OPENSHIFT_DATA_DIR + "/cache/";
	callback = function(error) { 
		if (error) {
			console.log(error);
		}
	};
	for (currency in data) {
		info = data[currency];
		fileName = dataDir + info["symbol"] + ".json";
		fs.writeFile(fileName, JSON.stringify(info), callback);
	}
	fs.writeFile(dataDir + "all.json", JSON.stringify(data), callback);
}