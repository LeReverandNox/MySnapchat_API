var bcrypt = require('bcrypt-nodejs');

module.exports = function (sequelize, DataTypes) {
    "use strict";

    var User;
    User = sequelize.define("User", {
        username: {
            type: DataTypes.STRING(30),
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
                                return next('This username is already in use.');
                            }
                            return next();
                        })
                        .catch(function (err) {
                            return next(err);
                        });
                }
            },
            get: function () {
                return this.getDataValue('username');
            },
            set: function (username) {
                this.setDataValue('username', username.toString().toLowerCase().trim());
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
                                return next('This email is already in use.');
                            }
                            return next();
                        })
                        .catch(function (err) {
                            return next(err);
                        });
                }
            },
            get: function () {
                return this.getDataValue('email');
            },
            set: function (email) {
                this.setDataValue('email', email.toString().toLowerCase().trim());
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
                return this.getDataValue('password');
            },
            set: function (password) {
                var hashedPassword = bcrypt.hashSync(password.trim());
                this.setDataValue('password_check', password);
                this.setDataValue('password', hashedPassword);
            }
        }
    }, {
        timestamps: true,
        underscored: true,
        tableName: 'users',
        classMethods: {
            associate: function (models) {
                User.hasMany(models.Snap, {
                    as: 'sentSnaps',
                    foreignKey: 'user_id'
                });
                User.belongsToMany(models.Snap, {
                    as: 'receivedSnaps',
                    through: {
                        "model": models.SnapsReceivers,
                        "attributs" : ['viewed'],
                    },
                    foreignKey: 'user_id',
                    otherKey: 'snap_id'
                });
            }
        }
    });
    return User;
};