/*jslint browser: true node: true this*/

module.exports = function (sequelize, DataTypes) {
    "use strict";
    var Friends;
    Friends = sequelize.define("Friends", {
        validated: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            get: function () {
                return this.getDataValue("validated");
            },
            set: function (validated) {
                this.setDataValue("validated", validated.toString());
            }
        }
    }, {
        timestamps: true,
        underscored: true,
        tableName: "friends"
    });
    return Friends;
};