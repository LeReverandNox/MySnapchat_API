var db = require('../models/');
var bcrypt = require('bcrypt-nodejs');

module.exports = {
    all: function (req, res) {
        db.User.findAll({
            attributes: {
                exclude: ['password', 'created_at', 'updated_at']
            }
        }).then(function (users) {
                res.status(200).send({
                    error: "false",
                    data: users
                });
            });
    },
    oneUser: function (req, res) {
        res.send("On essaie de recup les infos d'un user : " + req.params.user_id);
    },
    login: function (req, res) {
        var errors = [];
        if (req.body.email.trim() === "") {
            errors.push('The email field is empty.');
        }
        if (req.body.password.trim() === "") {
            errors.push('The password field is empty.');
        }
        if (errors.length > 0) {
            res.status(200).send({
                error: errors,
                data: null
            });
        } else {
            db.User.findOne({
                where: {
                    email: req.body.email.trim()
                }
            }).then(function (user) {
                if (user === null) {
                    res.status(403).send({
                        error: "Wrong email ! Try again.",
                        data: null
                    });
                } else {
                    if (!bcrypt.compareSync(req.body.password.trim(), user.get('password'))) {
                        res.status(403).send({
                            error: "Wrong password ! Try again.",
                            data: null
                        });
                    } else {
                        res.status(200).send({
                            error: false,
                            data: {
                                id: user.get('id'),
                                username: user.get('username'),
                                email: user.get('email'),
                            }
                        });
                    }
                }
            });
        }
    },
    register: function (req, res) {
        res.send("On essaie de register");
    },
    myFriends: function (req, res) {
        res.send("On essaie de recup ses amis");
    },
    addFriend: function (req, res) {
        res.send("On essaie d'add un ami");
    },
    friendRequests: function (req, res) {
        res.send("On essaie de recup ses demandes d'amis");
    },
    deleteFriend: function (req, res) {
        res.send("On essaie de delete un ami : " + req.params.friend_id);
    },
    changePassword: function (req, res) {
        res.send("On essaie de changer son password");
    }
};