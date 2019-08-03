**Panel Groups Randomizer** is a simple app that allows printing cards for discussion groups.

The app aims to be as simple as possible both in terms of installation and development. To do so I tried to avoid external dependencies.

Installation
------------

To install just copy the `app` folder to any web server (Apache HTTPD, Tomcat, anything really). You don't need any specific setup of the server. It just need to be able to... well to serve files (as web servers do).

The application is purely HTML5 based, but is using ES6 modules which does require serving files through the web server (`http(s):` rather then `file:` protocol).

Requirements
------------

The app uses some modern JavaScript (from 2015) and some modern CSS too. So old browsers like Internet Explorer will definitely *not* work.

The app was best tested on Firefox 68, but you can probably use Chrome or maybe even Safari.

Printing
--------

Generated cards can be printed to handout to people. There are 2 cards per page prepared.

Please note that although browsers allow scaling (in print preview), it is not advised to use that. Scaling might make page breaks awkward. So **make sure scale is set to 100%** (or 50%).

If you have many discussion per day you can use horizontal view. Vertical view should be able to hold 7 discussions. Horizontal view should be able to hold 10 discussions.