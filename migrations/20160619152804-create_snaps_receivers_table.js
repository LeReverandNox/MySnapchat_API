/*jslint browser: true node: true*/

module.exports = {
    up: function (queryInterface, Sequelize) {
        "use strict";
        return queryInterface.createTable(
            "snaps_receivers",
            {
                "id": {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                "created_at": {
                    type: Sequelize.DATE
                },
                "updated_at": {
                    type: Sequelize.DATE
                },
                "snap_id": {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                "user_id": {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                "viewed": {
                    type: Sequelize.BOOLEAN,
                    allowNull: false
                }
            }
        );
    },

    down: function (queryInterface, ignore) {
        "use strict";
        return queryInterface.dropTable("snaps_receivers");
    }
};
