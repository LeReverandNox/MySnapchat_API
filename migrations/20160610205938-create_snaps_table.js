/*jslint browser: true node: true*/

module.exports = {
    up: function (queryInterface, Sequelize) {
        "use strict";
        return queryInterface.createTable(
            "snaps",
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
                "user_id": {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                "imagename": {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                "duration": {
                    type: Sequelize.INTEGER,
                    allowNull: false
                }
            }
        );
    },

    down: function (queryInterface, ignore) {
        "use strict";
        return queryInterface.dropTable("snaps");
    }
};
