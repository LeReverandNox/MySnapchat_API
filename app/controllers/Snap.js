var db = require('../models/');

module.exports = {
    newSnap: function (req, res) {
        'use strict';
        var errors = [];

        if (req.fields.email !== req.decoded.email) {
            return res.status(200).send({
                error: "This is not your email !",
                data: null
            });
        }

        var receiversIds = req.fields.u2.trim().replace(/;+$/, "").replace(/^;+/, "").split(';');
        if (receiversIds.indexOf(req.decoded.id) !== -1) {
            return res.status(200).send({
                error: "You can't send a snap to yourself !",
                data: null
            });
        }

        var receivers = [];
        var promises = [];
        receiversIds.forEach(function (id) {
            var p = db.User.findOne({
                where: {
                    id: id
                }
            }).then(function (user) {
                if (!user) {
                    errors.push("The user " + id + " doesn't exist.");
                } else {
                    receivers.push(user);
                }
            });

            promises.push(p);
        });
        Promise.all(promises).then(function () {
            if (errors.length > 0) {
                res.status(200).send({
                    error: errors,
                    data: null
                });
            } else {
                db.User.findOne({
                    where: {
                        id: req.decoded.id
                    }
                }).then(function (user) {
                    db.Snap.create({
                        imagename: req.file.filename,
                        duration: req.fields.temps
                    }).then(function (snap) {
                        snap.setSender(user).then(function () {
                            snap.setReceivers(receivers, {
                                viewed: 0
                            }).then(function () {
                                res.status(200).send({
                                    error: false,
                                    data: null
                                });
                            });
                        });
                    }).catch(function (err) {
                        err.errors.forEach(function (error) {
                            errors.push(error.message);
                        });
                        res.status(200).send({
                            error: errors,
                            data: null
                        });
                    });
                });
            }
        });
    }
};