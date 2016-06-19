/*jslint browser: true node: true this*/
/*global Promise */

var bcrypt = require("bcrypt-nodejs");

module.exports = function (sequelize, DataTypes) {
    "use strict";

    var User;
    User = sequelize.define("User", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [6, 30],
                    msg: "Your username must be between 6 and 30 characters in length."
                },
                isAlphanumeric: {
                    msg: "Your username contains wrong characters (only alphanumeric is allowed)"
                },
                isUnique: function (value, next) {
                    var self = this;
                    User.find({where: {username: value}})
                        .then(function (user) {
                            if (user && self.id !== user.id) {
                                return next("This username is already in use.");
                            }
                            return next();
                        })
                        .catch(function (err) {
                            return next(err);
                        });
                }
            },
            get: function () {
                return this.getDataValue("username");
            },
            set: function (username) {
                this.setDataValue("username", username.toString().toLowerCase().trim());
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: {
                    msg: "Your email is not valid."
                },
                notEmpty: {
                    msg: "Your email is too short."
                },
                isUnique: function (value, next) {
                    var self = this;
                    User.find({where: {email: value}})
                        .then(function (user) {
                            if (user && self.id !== user.id) {
                                return next("This email is already in use.");
                            }
                            return next();
                        })
                        .catch(function (err) {
                            return next(err);
                        });
                }
            },
            get: function () {
                return this.getDataValue("email");
            },
            set: function (email) {
                this.setDataValue("email", email.toString().toLowerCase().trim());
            }
        },
        password_check: {
            type: DataTypes.VIRTUAL,
            notEmpty: true,
            notNull: true,
            validate: {
                len: {
                    args: 6,
                    msg: "Your password must be at least 6 characters long."
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            get: function () {
                return this.getDataValue("password");
            },
            set: function (password) {
                var hashedPassword = bcrypt.hashSync(password.trim());
                this.setDataValue("password_check", password);
                this.setDataValue("password", hashedPassword);
            }
        }
    }, {
        timestamps: true,
        underscored: true,
        tableName: "users",
        classMethods: {
            associate: function (models) {
                User.hasMany(models.Snap, {
                    as: "sentSnaps",
                    foreignKey: "user_id"
                });
                User.belongsToMany(models.Snap, {
                    as: "receivedSnaps",
                    through: {
                        model: models.SnapsReceivers,
                        attributes: ["viewed"]
                    },
                    foreignKey: "user_id",
                    otherKey: "snap_id"
                });
                User.belongsToMany(models.User, {
                    as: {
                        singular: "friendWith",
                        plural: "friendsWith"
                    },
                    through: {
                        model: models.Friends,
                        attributes: ["validated"]
                    },
                    foreignKey: "user_id",
                    otherKey: "friend_id"
                });
                User.belongsToMany(models.User, {
                    as: "withFriends",
                    through: {
                        model: models.Friends,
                        attributes: ["validated"]
                    },
                    foreignKey: "friend_id",
                    otherKey: "user_id"
                });
            },
            isFriendWith: function (user, maybeFriend) {
                var promises = [];

                var p1 = new Promise(function (resolve, ignore) {
                    User.findOne({
                        include: [{
                            model: User,
                            as: "withFriends",
                            where: {
                                id: maybeFriend.id
                            },
                            through: {
                                attributes: ["validated"]
                            }
                        }],
                        where: {
                            id: user.id
                        },
                        attributes: []
                    }).then(function (friend) {
                        if (friend) {
                            resolve(friend.withFriends[0]);
                        } else {
                            resolve(friend);
                        }
                    });
                });
                promises.push(p1);

                var p2 = new Promise(function (resolve, ignore) {
                    User.findOne({
                        include: [{
                            model: User,
                            as: "friendsWith",
                            where: {
                                id: maybeFriend.id
                            },
                            through: {
                                attributes: ["validated"]
                            }
                        }],
                        where: {
                            id: user.id
                        },
                        attributes: []
                    }).then(function (friend) {
                        if (friend) {
                            resolve(friend.friendsWith[0]);
                        } else {
                            resolve(friend);
                        }
                    });
                });
                promises.push(p2);

                return Promise.all(promises);
            }
        },
        instanceMethods: {
            getFriends: function () {
                var arr = [];
                var promises = [];
                var self = this;


                promises.push(
                    new Promise(function (resolve, ignore) {
                        User.findOne({
                            include: [{
                                model: User,
                                as: "withFriends",
                                through: {
                                    where: {
                                        validated: true
                                    },
                                    attributes: []
                                },
                                attributes: ["id", "username", "email"]
                            }],
                            where: {
                                id: self.id
                            },
                            attributes: []
                        }).then(function (friends) {
                            friends.withFriends.forEach(function (friend) {
                                arr.push(friend);
                            });
                            resolve();
                        });
                    })
                );

                promises.push(
                    new Promise(function (resolve, ignore) {
                        User.findOne({
                            include: [{
                                model: User,
                                as: "friendsWith",
                                through: {
                                    where: {
                                        validated: true
                                    },
                                    attributes: []
                                },
                                attributes: ["id", "username", "email"]
                            }],
                            where: {
                                id: self.id
                            },
                            attributes: []
                        }).then(function (friends) {
                            friends.friendsWith.forEach(function (friend) {
                                arr.push(friend);
                            });
                            resolve();
                        });
                    })
                );

                return Promise.all(promises).then(function () {
                    return arr;
                });
            }
        }
    });
    return User;
};