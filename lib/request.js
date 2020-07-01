//Modules
let http = require("http");
let url = require("url");
let qs = require('querystring');

//Router
let router = require("./router");

/**
 * Gets all of the route parameters from a given request
 * @returns routeParameters{{}}
 *      Object containing route parameters
 *      Route parameters come from wildcards
 */
http.IncomingMessage.prototype.routeParams = function() {
    let parsedURL = url.parse(this.url, true);
    let pathName = parsedURL.pathname;
    let directories = pathName.replace(/^\/+|\/+$/g, "").split("/");
    let routeParameters = {};
    let routeParameterKeys = Object.keys(router.wildcards).filter(value => directories.includes(value));
    for (let i = 0; i < routeParameterKeys.length; i++) {
        routeParameters[router.wildcards[routeParameterKeys[i]]] =
            directories[directories.indexOf(routeParameterKeys[i]) + 1];
    }
    return routeParameters;
}

/**
 * Gets the params from the given request
 * @returns {string}
 *      Object that contains all of the parameters
 */
http.IncomingMessage.prototype.params = function() {
    let parsedURL = url.parse(this.url, true);
    return parsedURL.query;
}

/**
 * Get cookies from request
 * @returns {{}}
 *      Object containing all of the cookies from request
 */
http.IncomingMessage.prototype.cookies = function() {
    let cookies = {}
    if (!this.headers.cookie) {
        return cookies;
    }
    this.headers && this.headers.cookie.split(';').forEach(function(cookie) {
        let parts = cookie.match(/(.*?)=(.*)$/);
        cookies[ parts[1].trim() ] = (parts[2] || '').trim();
    });
    return cookies;
}

/**
 * Get POST data from post request
 * @param callback
 *      Callback function for when post data is received
 */
http.IncomingMessage.prototype.post = function(callback) {
    if (this.method === 'POST') {
        let body = "";
        this.on('data', function (data) {
            body += data;
            if (body.length > 1e6) //Too much POST data, kill the connection! (1MB)
                this.connection.destroy();
        });
        this.on('end', function () {
            let post = qs.parse(body);
            callback(post);
        });
    } else {
        return {};
    }
}