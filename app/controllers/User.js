var db = require('../models/');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../lib/jwt');

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
        db.User.findOne({
            where: {
                email: req.fields.email
            }
        }).then(function (user) {
            if (user === null) {
                res.status(200).send({
                    error: "Wrong email ! Try again.",
                    data: null
                });
            } else {
                if (!bcrypt.compareSync(req.fields.password, user.get('password'))) {
                    res.status(200).send({
                        error: "Wrong password ! Try again.",
                        data: null
                    });
                } else {
                    var token = jwt.newToken(user);
                    res.status(200).send({
                        error: false,
                        data: {
                            id: user.get('id'),
                            username: user.get('username'),
                            email: user.get('email'),
                        },
                        token: token
                    });
                }
            }
        });
    },
    register: function (req, res) {
        db.User.create({
            email: req.fields.email,
            password: req.fields.password,
            username: req.fields.username
        }).then(function (user) {
            res.status(200).send({
                error: false,
                data: {
                    id: user.get('id'),
                    username: user.get('username'),
                    email: user.get('email'),
                }
            });
        }).catch(function (err) {
            var errors = [];
            err.errors.forEach(function (error) {
                errors.push(error.message);
            });
            res.status(200).send({
                error: errors,
                data: null
            });
        });
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