//Modules
let roamer = require("../roamer");

//Create http server
roamer.createServer({
    host : "192.168.1.3",
    port : "80"
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
    res.sendFile("test/test.html");
    res.end();
});

//Route parameter example
router.get("/profile/:id", function (req, res) {
    let routeParams = req.routeParams();
    res.write(routeParams["id"]);
    res.end();
});

router.get("/json", function (req, res) {
    let obj = {
        "foo" : "bar",
    }
    res.sendJson(obj);
    res.end();
});

//Invalid path
router.invalid(function (req, res) {
    res.write("Invalid route");
    res.end();
});