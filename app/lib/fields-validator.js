/*jslint node: true */

module.exports = function (fields, clean) {
    'use strict';
    return function (req, res, next) {
        var errors = [];

        var checkEmpty = function (obj, field) {
            if (obj[field].length === 0) {
                errors.push('The ' + field + ' field is empty.');
            }
        };
        var checkRequired = function (obj) {
            fields.forEach(function (field) {
                if (!obj.hasOwnProperty(field)) {
                    errors.push('The ' + field + ' field is required.');
                } else {
                    checkEmpty(obj, field);
                }
            });
        };
        var cleanFields = function (obj) {
            if (obj) {
                Object.keys(obj).forEach(function (field) {
                    obj[field] = obj[field].trim();
                });
            }
            return obj;
        };

        var params = (clean)
            ? Object.assign({}, cleanFields(req.query), cleanFields(req.body))
            : Object.assign({}, req.query, req.body);

        checkRequired(params);

        if (errors.length > 0) {
            res.status(200).send({
                error: errors,
                data: null
            });
        } else {
            req.fields = params;
            next();
        }
    };
};