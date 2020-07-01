# **Roamer**

Lightweight [NodeJs](https://nodejs.org/en/) http framework and router

## Philosophy
Roamer was designed after the NodeJs module [Express](https://expressjs.com/). Express is a wonderful framework but often removes customization, personalization, and speed for standardization and ease of use. This isn't a bad thing but results in slower request handling. It also prevents creativity because their are trauches of code the package was built upon making the module hard to redesign. Roamer was designed to be built with the same framework as express, allowing the same style of routing but without all the extras. This allows the user to eassily customize and personzlize roamer to there liking. Roamer also has a very minimalistic design allowing the user to easily add new things and edit the source code.

## **Instalation**
Before installing, make sure you have NodeJs installed. The project must have a `package.json` file. Roamer can be installed through [npm](https://www.npmjs.com/org).

To install roamer use the command...
```bash
$ npm install roamer
```

## Documentation
To import roamer use
```js
const roamer = require('roamer');
```
To create an http server and router use
```js
roamer.createServer();
let router = roamer.Router;
```
To customize the settings of the http server pass in the options parameter. You can also pass in a request listener to allow easy logging.
```js
roamer.createServer({
  host : "127.0.0.1",
  port : 80
}, function(req, res) {
  console.log("Request: " + req.url);
});
```
To customize the http listener the listener method is used. Inside the listener is a callback function that is run when the listener is initialized. The callback contains an error for finding server startup issues. **Note a listener is not required for the server to work**
```js
roamer.listener(function(error) {
  if (error) {
    console.log("Http server failed to start, " + error);
  } else {
  console.log("Http server running");
  }
});
```
You can then easily add routing with the router method for the desired http method. The first parameter represents the route path for the request made. The second parameter is the handler containing the http request and response parameters. There is also an all() method which adds a handler for any http method. **Make sure you call res.end(); to end the response**
```js
router.get("/", function(req, res) {
  res.write("Hello World!");
  res.end();
});

router.post("/test", function(req, res) {
  res.write("Hello World!");
  res.end();
});
```
The router invalid method is used to set the default invalid response. The invalid response is returned if an invalid request is made. If the user does not set an invalid response the default will be used.
```js
router.invalid(function(req, res) {
  res.write("Invalid route!");
  res.end();
});
```
Similary to express roamer has a wildcard system for route paths. This allows the user to add directories with "wildcards". Wildcards are paths that can easily be changed by the incoming request. You can access the route paramters from the resulting wildcards by adding the parameter. A wildcard is declared by the ":". Note it must have a directory preceding it, because the directory signifies a specific wildcard.
```js
router.get("/profile/:id", function(req, res) {
  console.log(req.routeParamters);
  res.write("Invalid route!");
  res.end();
});
```
The route parameters are returned as an object where the wilcard name is "id" and the value is the input request value. 

##Custom res methods
###res.sendFile(file);
Sends file based on file locatin parameter. Note: has to be full file location
###res.sendJson(domain);
Sends a json based on object. If sending to another domain add (this is required because cors)
###res.sendCookies(cookies, domain);
Sends cookie(s) in object. Use the following object format to customize cookie.
```js
let cookies = {
  cookieName1 : {
    data : "cookie stuff goes here",
    httpOnly : true,
    path : "/",
    domain : ".github.com",
    expires : new Date(Date.now() + 60 * 24 * 60 * 60000)
  },
  cookieName2 : {
    data : "cookie stuff goes here",
    httpOnly : true,
    path : "/",
    domain : ".github.com",
    expires : new Date(Date.now() + 60 * 24 * 60 * 60000)
   }
}
```
