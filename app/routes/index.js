var fs = require('fs');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var emptyValidator = require('../lib/empty-validator');

module.exports = function (app) {
    "use strict";

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(morgan('dev'));
    app.use(emptyValidator);

    fs.readdirSync(__dirname).forEach(function (file) {
        if (file !== "index.js") {
            var name = file.substr(0, file.indexOf('.'));
            require('./' + name)(app);
        }
    });
};