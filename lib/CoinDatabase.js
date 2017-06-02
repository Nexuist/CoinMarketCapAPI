const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
var db;

// nodeapp / X4zHmey72JK996g

module.exports = {

    initDb: function(success, error) {
        // Use connect method to connect to the Server
        MongoClient.connect(process.env.MONGO_DB_URL, {
            ssl: true,
            sslValidate: false
        }, function(err, database) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
                error.call();
            } else {
                console.log('Connection established to', process.env.MONGO_DB_URL);
                db = database
                success.call();
            }
        });
    },

    checkIfCoinExist: function(coin, cb) {

        db.collection("coin").count({ symbol: coin.symbol }, function(err, docs) {
            if (err) {
                cb(err, null)
            } else {
                cb(null, docs)
            }

        });
    },

    storeCoin: function(coin, cb) {
        db.collection('coin').insert(coin, function(err, result) {
            if (err) {
                cb(err, null)
            } else {
                cb(null, result)
            }
        });
    },

    updateCoin: function(coin, cb) {
        db.collection('coin').update({ symbol: coin.symbol }, {
            $set: {
                position: coin.service,
                name: coin.name,
                market_cap: coin.market_cap,
                price: coin.price,
                supply: coin.supply,
                volume: coin.volume,
                change: coin.change,
                timestamp: coin.timestamp,
                link: coin.link
            }
        }, function(err, result) {
            if (err) {
                cb(err, null)
            } else {
                cb(null, result)
            }
        });
    },

    getCoin: function(symbol, cb) {

        //console.log("get user profile", userId)

        db.collection('coin').findOne({ symbol: symbol }, function(err, coin) {
            if (err) {
                cb(err, null)
            } else {
                //console.log("user", user)
                cb(null, coin)
            }
        });
    }
};
