/*jslint node: true */

module.exports = function (req, res, next) {
    'use strict';
    var errors = [];
    var checkEmpty = function (obj) {
        Object.keys(obj).forEach(function (field) {
            if (obj[field].trim().length === 0) {
                errors.push('The ' + field + ' field is empty.');
            }
        });
    };

    checkEmpty(req.query);
    checkEmpty(req.body);

    if (errors.length > 0) {
        res.status(200).send({
            error: errors,
            data: null
        });
    } else {
        next();
    }
};