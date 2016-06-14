module.exports = function (sequelize, DataTypes) {
    "use strict";

    var Snap;
    Snap = sequelize.define("Snap", {
        imagename: {
            type: DataTypes.STRING(255),
            allowNull: false,
            get: function () {
                return this.getDataValue('imagename');
            },
            set: function (imagename) {
                this.setDataValue('imagename', imagename.toString());
            }
        },
        duration: {
            type: DataTypes.INTEGER(2),
            allowNull: false,
            validate: {
                isInt: {
                    msg: "The provided duration is not a number !."
                },
                min: {
                    args: 1,
                    msg: "The provided duration is too short (min. 1s)."
                },
                max: {
                    args: 10,
                    msg: "The prodived durations is too long (max. 10s)."
                }
            },
            get: function () {
                return this.getDataValue('duration');
            },
            set: function (duration) {
                this.setDataValue('duration', duration.toString());
            }
        }
    }, {
        timestamps: true,
        underscored: true,
        tableName: 'snaps',
        classMethods: {
            associate: function (models) {
                Snap.belongsTo(models.User, {
                    as: 'sender',
                    foreignKey: 'user_id'
                });
                Snap.belongsToMany(models.User, {
                    as: 'receivers',
                    through: {
                        "model": models.SnapsReceivers,
                        "attributs" : ['viewed'],
                    },
                    foreignKey: "snap_id",
                    otherKey: "user_id"
                });
            }
        }
    });
    return Snap;
};