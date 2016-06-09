var fs = require('fs');
var bodyParser  = require('body-parser');

module.exports = function (app) {
    "use strict";

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    fs.readdirSync(__dirname).forEach(function (file) {
        if (file !== "index.js") {
            var name = file.substr(0, file.indexOf('.'));
            require('./' + name)(app);
        }
    });
};