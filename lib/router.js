/**
 * Object containing all of the possible http methods
 * INVALID is not an http method, its the default method for a failed request
 */
exports.routes = routes = {
    GET : {},
    POST : {},
    PUT : {},
    HEAD : {},
    DELETE : {},
    CONNECT : {},
    PATCH : {},
    OPTIONS : {},
    TRACE : {},
    INVALID : function (req, res) {
        res.write("Invalid request");
        res.end();
    }
};

/**
 * Object containing all of potential wildcards
 * Wildcards are request directories/folders that are adjustable by request
 */
exports.wildcards = wildcards = {};

/**
 * Adds path to routes object based on request method
 * Each "route" is a key value pair (path : handler)
 * all adds a handler to every method
 * @param path
 *      The path of an incoming request
 * @param handler
 *      The function that handles the response for the requested path
 */
module.exports.all = function(path, handler) {
    path = wildcardCheck(path);
    exports.routes["GET"][path] = handler;
    exports.routes["POST"][path] = handler;
    exports.routes["PUT"][path] = handler;
    exports.routes["HEAD"][path] = handler;
    exports.routes["DELETE"][path] = handler;
    exports.routes["CONNECT"][path] = handler;
    exports.routes["PATCH"][path] = handler;
    exports.routes["OPTIONS"][path] = handler;
    exports.routes["TRACE"][path] = handler;
}
module.exports.get = function(path, handler) {
    path = wildcardCheck(path);
    exports.routes["GET"][path] = handler;
}
module.exports.post = function(path, handler) {
    path = wildcardCheck(path);
    exports.routes["POST"][path] = handler;
}
module.exports.put = function(path, handler) {
    path = wildcardCheck(path);
    exports.routes["PUT"][path] = handler;
}
module.exports.head = function(path, handler) {
    path = wildcardCheck(path);
    exports.routes["HEAD"][path] = handler;
}
module.exports.delete = function(path, handler) {
    path = wildcardCheck(path);
    exports.routes["DELETE"][path] = handler;
}
module.exports.connect = function(path, handler) {
    path = wildcardCheck(path);
    exports.routes["CONNECT"][path] = handler;
}
module.exports.patch = function(path, handler) {
    path = wildcardCheck(path);
    exports.routes["PATCH"][path] = handler;
}
module.exports.options = function(path, handler) {
    path = wildcardCheck(path);
    exports.routes["OPTIONS"][path] = handler;
}
module.exports.trace = function(path, handler) {
    path = wildcardCheck(path);
    exports.routes["TRACE"][path] = handler;
}

/**
 * Method to create invalid handler
 * Invalid is used when request does not exist on routes
 * @param handler
 *      Method for invalid response
 */
module.exports.invalid = function invalid(handler) {
    routes["INVALID"] = handler;
}

/**
 * Checks if the given path has a wildcard
 * Wildcard is a directory that is adjustable by request
 * If a wildcard is found, its added to the wildcard object
 * @param path
 *      The path that is being checked for wildcards
 * @returns {string}
 *      Returns a path with any wildcard removed
 */
function wildcardCheck(path) {
    if (path.includes(":")) {
        let directories = path.replace(/^\/+|\/+$/g, "").split("/");
        for (let i = 0; i < directories.length; i++) {
            if (directories[i].includes(":")) {
                wildcards[directories[i - 1]] = directories[i]
                    .replace(":", "");
            }
        }
        directories = directories.filter(function (test) {
            return !test.includes(":");
        });
        directories = directories.map(i => "/" + i);
        path = directories.join("");
        return path.replace(":", "");
    }
    return path;
}