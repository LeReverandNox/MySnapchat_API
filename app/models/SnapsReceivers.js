/*jslint browser: true node: true this*/

module.exports = function (sequelize, DataTypes) {
    "use strict";

    var SnapsReceivers;
    SnapsReceivers = sequelize.define("SnapsReceivers", {
        viewed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            get: function () {
                return this.getDataValue("viewed");
            },
            set: function (viewed) {
                this.setDataValue("viewed", viewed.toString());
            }
        }
    }, {
        timestamps: true,
        underscored: true,
        tableName: "snaps_receivers"
    });
    return SnapsReceivers;
};