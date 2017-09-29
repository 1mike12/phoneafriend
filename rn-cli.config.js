const metroBundler = require('metro-bundler');

module.exports = {
    getBlacklistRE: () => metroBundler.createBlacklist([
        /server\/.*/,
    ])
};