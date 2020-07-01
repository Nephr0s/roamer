//Modules
let http = require("http");
const path = require("path");
const fs =  require("fs");

/**
 * Default response for serving static files
 * @param file
 *          Location of file being sent in response
 *          Note: has to be absolute file location
 */
http.ServerResponse.prototype.sendFile = function (file) {
    let res = this;
    let contentType = getContentType(file);
    let data = fs.readFileSync(file);
    res.writeHead(200, {"Content-Type": contentType});
    res.write(data);
}

/**
 * Send a json back to client
 * @param object
 *      A js object that will be converted into a json
 * @param domain
 *      Allowed domain for cors json response
 *      Request from another domain is made, allow response to "domain"
 *      Example: http://www.github.com
 */
http.ServerResponse.prototype.sendJson = function (object, domain) {
    if (domain !== undefined) {
        this.setHeader("Access-Control-Allow-Origin", domain);
        this.setHeader("Access-Control-Allow-Credentials", "true");
    }
    let json = JSON.stringify(object, null, 4);
    this.setHeader("Content-Type", "application/json");
    this.write(json);
}

/**
 * Returns cookies in response
 * @param cookies
 *      Object containing cookies format should look like
 *      let cookies = {
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
 * @param domain
 *      Domain for cors
 *      This is required to be able to send cookies
 */
http.ServerResponse.prototype.sendCookies = function (cookies, domain) {
    this.setHeader("Access-Control-Allow-Origin", domain);
    this.setHeader("Access-Control-Allow-Credentials", "true");
    let cookieArray = [];
    for (let i = 0; i < Object.keys(cookies); i++) {
        let name = Object.keys(cookies[i]);
        let data = cookies[name]["data"];
        let httpOnly = cookies[name]["httpOnly"];
        let path = cookies[name]["path"];
        let domain = cookies[name]["domain"];
        let expires = cookies[name]["expires"];
        if (httpOnly === true) {
            httpOnly = "HttpOnly;"
        } else {
            httpOnly = "";
        }
        cookieArray.push(name + '=' + data + ";" +
            ' ' + httpOnly + ' path=' + path +'; domain=' + domain + '; expires=' + expires)
    }
    this.setHeader("Set-Cookie", cookieArray);
}


/**
 * Determines the request type
 * @param req
 *          http/https request
 * @returns {string}
 *          Returns the request type as a String
 */
function getContentType(req) {
    let contentType = "text/html";
    switch (path.extname(req)) {
        case ".js":
            contentType = "text/javascript";
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg' || '.jpeg':
            contentType = 'image/jpeg';
            break;
        case ".ico":
            contentType = "image/x-icon";
            break;
    }
    return contentType;
}