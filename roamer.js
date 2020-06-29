//Modules
let http = require("http");
const url = require("url");
let Router = require('./lib/router');

//Get router class
exports.Router = Router;

//Private vars
let server  = null;
let host = null;
let port = null;

/**
 * Starts a http server
 * @param options
 *      Object that contains http server settings
 *      options = {
 *          host : "ip address for http server"
 *          port : "port for http server
 *      }
 * @param requestListener
 *      Callback function used to access req/res
 *      Used for things such as logging requests or debugging
 *      Allows user to access core http server
 */
exports.createServer = function createServer(options, requestListener) {

    //Set default server options
    const defaults = {
        host : "127.0.0.1",
        port : "80"
    }

    //Get options
    options = options || {};
    host = options["host"] || defaults["host"];
    port = options["port"] || defaults["port"];

    //Initialize http server and listen for requests
    server = http.createServer(function (req, res) {

        //Callback function
        requestListener(req, res);

        //Parse request
        let method = req.method;
        let parsedURL = url.parse(req.url, true);
        let pathName = parsedURL.pathname;
        let directories = pathName.replace(/^\/+|\/+$/g, "").split("/");

        //Get potential route parameters / update pathname
        let routeParameters = {};
        if (directories.some(r=> Object.keys(Router.wildcards).includes(r))) {
            let routeParameterKeys = Object.keys(Router.wildcards).filter(value => directories.includes(value));
            let routeParameterValues = [];
            if (routeParameterKeys.length > 0) {
                for (let i = 0; i < routeParameterKeys.length; i++) {
                    routeParameterValues.push(directories[directories.indexOf(routeParameterKeys[i]) + 1]);
                    routeParameters[Router.wildcards[routeParameterKeys[i]]] =
                        directories[directories.indexOf(routeParameterKeys[i]) + 1];
                }
                directories = directories.filter(n => !routeParameterValues.includes(n));
                pathName = directories.map(i => "/" + i);
                pathName = pathName.join("");
            }
        }

        //Find handler for request or direct to invalid response
        let handler =
            typeof Router.routes[method][pathName] !== "undefined" ?
                Router.routes[method][pathName] : Router.routes["INVALID"];
        handler(req, res, routeParameters);

    });
}

/**
 * Server listener
 * @param callback
 *      Callback function that can be used to add code after listener
 */
exports.listener = function listener(callback) {
    server.listen(port, host, function (error) {
        callback(error);
    });
}