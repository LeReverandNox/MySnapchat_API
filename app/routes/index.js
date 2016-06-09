var fs = require('fs');

module.exports = function (app) {
    "use strict";
    fs.readdirSync(__dirname).forEach(function (file) {
        if (file !== "index.js") {
            var name = file.substr(0, file.indexOf('.'));
            require('./' + name)(app);
        }
    });
};