/*jslint browser: true node: true*/

var fs = require("fs");
var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var CROS = require("../lib/CROS");
var config = require("../../config");

module.exports = function (app) {
    "use strict";
    app.use(CROS);
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(morgan("dev"));

    // Route static pour accéder aux images des snaps
    app.use("/uploads", express.static(config.upload_folder));

    fs.readdirSync(__dirname).forEach(function (file) {
        if (file !== "index.js") {
            var name = file.substr(0, file.indexOf("."));
            require("./" + name)(app);
        }
    });
};