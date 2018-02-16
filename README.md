### Introduction

JSON API for coinmarketcap.com hosted on OpenShift. The documentation for this service is available in [index.html](http://htmlpreview.github.io/?https://github.com/Nexuist/CoinMarketCapAPI/blob/master/index.html).

The service itself is hosted by me at https://coinmarketcap-nexuist.rhcloud.com/. You can use that site or, if you want, host it yourself.

To run, 

```
npm install
npm start
```

### Version 2.0.9 (altsheets)
* CMC had changed separator from " " to "\n" - fixed
* several previous updates, see [commit history](https://github.com/altsheets/CoinMarketCapAPI/commits/master)

### New in 2.0

* No more files! All data storage is done on memory.

* Updating data and serving data are now done together.

* New metrics endpoint (/metrics). Let me know if there's something else you want tracked.

* Better logging.

* No more cronjobs - the 5 minute refresh is implemented through `setInterval()`.

* Completely rewritten to use ES6 classes for better modularization and the other benefits that come from OO.

### License

```
MIT License

Copyright (c) 2016 Andi Andreas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
