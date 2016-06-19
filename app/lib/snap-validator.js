/*jslint node: true */

var fs = require("fs");

module.exports = function (req, res, next) {
    "use strict";
    var errors = [];

    if (req.files[0] !== undefined) {
        var file = req.files[0];
        if (file.fieldname === "file") {
            if (file.mimetype === "image/jpeg") {
                var ext = ".jpeg";
                fs.renameSync(file.path, file.path + ext);
                file.filename += ext;
                req.file = file;
            } else {
                errors.push("Wrong image format (expected : jpeg).");
            }
        } else {
            errors.push("Wrong fileKey (expected : file).");
        }
    } else {
        errors.push("Please add a JPEG image to your snap.");
    }

    if (errors.length > 0) {
        res.status(200).send({
            error: errors,
            data: null
        });
    } else {
        next();
    }
};