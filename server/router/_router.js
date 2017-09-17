const path = require("path");
const BodyParser = require("body-parser");
const express = require("express");
let app = express();
const config = require("../config");

if (process.env.NODE_ENV === "production") {
    app.use(express.static(__dirname + '/public_dist'));
} else {
    app.use(express.static(__dirname + '/public'));
}

app.use(["/api/*"], BodyParser.json());
app.use(["/api/*"], BodyParser.urlencoded({extended: true}));
app.use(["/api/*"], require("./middleware/authenticated"));

app.use("/api/test/", require("./test_api"));
app.use("/api/session/", require("./session_api"));
app.use("/api/skill/", require("./skill_api"));
app.use("/api/user/", require("./user_api"));
/*
PUBLIC APIS
 */
app.use("/api/public/login", require("./public/api_login"));

//Exception handler has to be last
const port = process.env.NODE_ENV === "testing" ? config.testPort : config.port;

let server = app.listen(port, function () {
    let host = server.address().address;
    const port = server.address().port;
    console.log(`Started on ${host}:${port}`)
});

