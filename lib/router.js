/**
 * Object containing all of the possible http methods
 */
exports.routes = routes = {
    GET : {},
    POST : {},
    PUT : {},
    HEAD : {},
    DELETE : {},
    PATCH : {},
    OPTIONS : {},
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
 * @param path
 *      The path of an incoming request
 * @param handler
 *      The function that handles the response for the requested path
 */
exports.get = function get(path, handler) {
    path = wildcardCheck(path);
    routes["GET"][path] = handler;
}
exports.post = function post(path, handler) {
    path = wildcardCheck(path);
    routes["POST"][path] = handler;
}

/**
 * Method to create invalid handler
 * Invalid is used when request does not exist on routes
 * @param handler
 *      Method for invalid response
 */
exports.invalid = function invalid(handler) {
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
}