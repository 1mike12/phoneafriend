//bootstrap routes
process.env.NODE_ENV = require("./env");

require("./router/server");
require("./websocket/_websocket");

if (!('toJSON' in Error.prototype))
    Object.defineProperty(Error.prototype, 'toJSON', {
        value: function(){
            const alt = {};

            Object.getOwnPropertyNames(this).forEach(function(key){
                alt[key] = this[key];
            }, this);

            return alt;
        },
        configurable: true,
        writable: true
    });
