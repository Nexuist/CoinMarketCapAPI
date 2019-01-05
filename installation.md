# install on cloudserver
incl autostart via pm2

dependencies:
```
sudo apt-get update
sudo apt-get upgrade
apt install git wget lynx

curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version

git clone https://github.com/Nexuist/CoinMarketCapAPI Nexuist_CoinMarketCapAPI
cd Nexuist_CoinMarketCapAPI/
sed -i 's/127.0.0.1/0.0.0.0/g' main.js
npm install
npm start
```

Try whether it is answering:
```
lynx http://localhost:8080
lynx http://try.your.server.ip:8080
```

autostart:
```
npm install pm2 -g

cd Nexuist_CoinMarketCapAPI/
pm2 start main.js
pm2 list
pm2 logs
pm2 startup
pm2 save

sudo reboot
```



## optional hack to get page 2

I have [found a simple hack](https://github.com/Nexuist/CoinMarketCapAPI/issues/7#issuecomment-451639060) to also get the coins from page 2

```
cp -r Nexuist_CoinMarketCapAPI  Nexuist_CoinMarketCapAPI_2
cd Nexuist_CoinMarketCapAPI_2/

nano lib/CoinCrawler.js 
```
change 'http://coinmarketcap.com/' to 'http://coinmarketcap.com/2'

then increment the port number so that page 1 & page 2 do not collide:
```
nano main.js 
```
change 8080 to 8081

now install and run:
```
rm node_modules -rf
npm install
npm start
```

then you get page 2 on http://try.your.ip.address:8081

To not miss any coins (which move from page 1 to page 2 or vice versa), it is important that both services 8080 and 8081 are started at the same time.  Do the same as above with pm2, and reboot.
