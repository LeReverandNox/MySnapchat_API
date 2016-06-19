/*jslint browser: true node: true */
/*global Promise */

var db = require("../models/");

module.exports = {
    newSnap: function (req, res) {
        "use strict";
        var errors = [];

        if (req.fields.email !== req.decoded.email) {
            return res.status(200).send({
                error: ["This is not your email !"],
                data: null
            });
        }

        var receiversIds = req.fields.u2.trim().replace(/;+$/, "").replace(/^;+/, "").split(";");
        if (receiversIds.indexOf(req.decoded.id) !== -1) {
            return res.status(200).send({
                error: ["You can't send a snap to yourself !"],
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
    },
    mySnaps: function (req, res) {
        "use strict";

        if (req.fields.email !== req.decoded.email) {
            return res.status(200).send({
                error: ["This is not your email !"],
                data: null
            });
        }

        db.Snap.findAll({
            include: [{
                model: db.User,
                as: "receivers",
                through: {
                    where: {
                        viewed: false
                    }
                },
                where: {
                    id: req.decoded.id
                }
            }, {
                model: db.User,
                as: "sender"
            }]
        }).then(function (snaps) {
            var snapsToReturn = [];
            Object.keys(snaps).forEach(function (key) {
                var oneSnap = {
                    id: snaps[key].id,
                    url: "http://" + req.headers.host + "/uploads/" + snaps[key].imagename,
                    duration: snaps[key].duration,
                    sender: {
                        username: snaps[key].sender.username,
                        email: snaps[key].sender.email
                    }
                };
                snapsToReturn.push(oneSnap);
            });

            res.status(200).send({
                error: false,
                data: snapsToReturn
            });
        });
    },
    markAsViewed: function (req, res) {
        "use strict";

        if (req.fields.email !== req.decoded.email) {
            return res.status(200).send({
                error: ["This is not your email !"],
                data: null
            });
        }

        db.Snap.find({
            include: [{
                model: db.User,
                as: "receivers",
                through: {
                    where: {
                        viewed: false
                    }
                },
                where: {
                    id: req.decoded.id
                }
            }],
            where: {
                id: req.params.snap_id
            }
        }).then(function (snap) {
            if (!snap) {
                return res.status(200).send({
                    error: ["This snap doesn't exist !"],
                    data: null
                });
            }

            snap.receivers[0].SnapsReceivers.updateAttributes({
                viewed: 1
            }).then(function () {
                return res.status(200).send({
                    error: false,
                    data: null
                });
            });
        });
    }
};