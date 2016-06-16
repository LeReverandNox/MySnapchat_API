var db = require('../models/');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../lib/jwt');

module.exports = {
    all: function (ignore, res) {
        'use strict';
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
        'use strict';
        db.User.find({
            where: {
                id: req.params.user_id
            }
        }).then(function (user) {
            if (!user) {
                return res.status(200).send({
                    error: "This user doesn't exist !",
                    data: null
                });
            }

            return res.status(200).send({
                error: false,
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        });
    },
    login: function (req, res) {
        'use strict';
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
                            email: user.get('email')
                        },
                        token: token
                    });
                }
            }
        });
    },
    register: function (req, res) {
        'use strict';
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
                    email: user.get('email')
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
        'use strict';
        db.User.findById(req.decoded.id)
            .then(function (user) {
                user.getFriends().then(function (friends) {
                    res.status(200).send({
                        error: false,
                        data: friends
                    });
                });
            });
    },
    addFriend: function (req, res) {
        'use strict';
        db.User.find({
            where: {
                email: req.fields.email
            }
        }).then(function (futureFriend) {
            if (!futureFriend) {
                return res.status(200).send({
                    error: "This user doesn't exist.",
                    data: null
                });
            }
            if (futureFriend.id === req.decoded.id) {
                return res.status(200).send({
                    error: "You can't add yourself as a friend.",
                    data: null
                });
            }


            db.User.findById(req.decoded.id).then(function (user) {
                db.User.isFriendWith(user, futureFriend).
                    then(function (friend) {
                        friend = friend[0] !== null
                            ? friend[0]
                            : friend[1];
                        if (!friend) {
                            user.addFriendWith(futureFriend, {
                                validated: false
                            }).then(function () {
                                return res.status(200).send({
                                    error: false,
                                    data: null
                                });
                            });
                        } else {
                            if (friend.Friends.validated) {
                                return res.status(200).send({
                                    error: "This user is already your friend.",
                                    data: null
                                });
                            } else {
                                return res.status(200).send({
                                    error: "You already have a friend request pending with this user.",
                                    data: null
                                });
                            }
                        }
                    });
            });
        });
    },
    friendRequests: function (req, res) {
        'use strict';
        db.User.findAll({
            include: [{
                model: db.User,
                as: 'withFriends',
                through: {
                    where: {
                        'validated': false
                    },
                    attributes: []
                },
                attributes: ['id', 'email']
            }],
            where: {
                id: req.decoded.id
            },
            attributes: []
        })
        .then(function (requests) {
            res.status(200).send({
                error: false,
                data: requests[0].withFriends
            });
        });
    },
    deleteFriend: function (req, res) {
        'use strict';
        db.User.findById(req.params.friend_id)
            .then(function (maybeFriend) {
                if (!maybeFriend) {
                    return res.status(200).send({
                        error: "This user doesn't exist.",
                        data: null
                    });
                }

                db.User.findById(req.decoded.id)
                    .then(function (user) {
                        db.User.isFriendWith(user, maybeFriend)
                            .then(function (friend) {
                                if (!friend[0] && !friend[1]) {
                                    return res.status(200).send({
                                        error: "You are not friend with this user.",
                                        data: null
                                    });
                                }

                                var ok = function () {
                                    return res.status(200).send({
                                        error: false,
                                        data: null
                                    });
                                };
                                if (friend[0]) {
                                    user.removeWithFriend(friend[0]).then(ok);
                                }
                                if (friend[1]) {
                                    user.removeFriendWith(friend[1]).then(ok);
                                }
                            });
                    });
            });
    },
    changePassword: function (req, res) {
        'use strict';
        if (req.decoded.id.toString() !== req.params.user_id.toString()) {
            return res.status(200).send({
                error: "You can't change another's user password ! You scummbag",
                data: null
            });
        }

        db.User.findById(req.params.user_id)
            .then(function (user) {
                user.update({
                    password: req.fields.password
                }).then(function () {
                    return res.status(200).send({
                        error: false,
                        data: null
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
            });
    },
    validRequest: function (req, res) {
        'use strict';
        db.User.findAll({
            include: [{
                model: db.User,
                as: 'withFriends',
                through: {
                    where: {
                        'validated': false,
                        'user_id': req.params.user_id
                    }
                }
            }],
            where: {
                id: req.decoded.id
            }
        })
        .then(function (requests) {
            if (!requests[0].withFriends[0]) {
                return res.status(200).send({
                    error: "You ain't got any friend request pending with this user.",
                    data: null
                });
            }
            requests[0].withFriends[0].Friends.updateAttributes({
                validated: 1
            }).then(function () {
                return res.status(200).send({
                    error: false,
                    data: null
                });
            });
        });
    },
    }
};