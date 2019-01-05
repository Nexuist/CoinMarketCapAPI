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
