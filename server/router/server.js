const path = require("path");
const BodyParser = require("body-parser");
const express = require("express");
let app = express();
const config = require("../config");
const os = require("os");
const http = require("http");

let publicPath = process.env.NODE_ENV === "production" ? '/public_dist' : '/public';
const fullPath = path.join(process.cwd(), publicPath);
app.use(express.static(fullPath));

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
app.use("/api/public/", require("./public/api_public"));

let server = http.Server(app);

const PORT = process.env.NODE_ENV === "test" ? config.testPort : config.port;
server.listen(PORT, function(){
    const port = server.address().port;

    console.log(`Started on ${getIpAddress()}:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});

function getIpAddress(){
    let ifaces = os.networkInterfaces();
    let address = "";
    Object.keys(ifaces).forEach((ifname) =>{
        ifaces[ifname].forEach((iface) =>{
            if ('IPv4' !== iface.family || iface.internal !== false){
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }

            address = iface.address;
        });
    });
    return address;
}

module.exports = server;

