//Modules
let roamer = require("../roamer");

//Create http server
roamer.createServer({
    host : "192.168.1.3",
    port : "51000"
}, function (req, res) {
    console.log(
        req.headers['x-real-ip'] + "   |   " +
        new Date() + "   |   " +
        req.method + "   |   " +
        req.url
    );
});

//Customize server listener
roamer.listener(function (error) {
    if (error) {
        console.log("Http server failed to start, " + error);
    } else {
        console.log("Http server running");
    }
})

//Create Router
let router = roamer.Router;

//Default path
router.get("/", function (req, res) {
    console.log("Hello world!");
    res.end();
});


router.get("/profile/:id", function (req, res, routeParameters) {
    console.log(routeParameters);
    res.end();
})

//Invalid path
router.invalid(function (req, res) {
    res.write("Invalid route");
    res.end();
})