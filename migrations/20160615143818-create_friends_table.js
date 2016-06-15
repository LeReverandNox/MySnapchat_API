'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            'friends',
            {
                'id': {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                'created_at': {
                    type: Sequelize.DATE
                },
                'updated_at': {
                    type: Sequelize.DATE
                },
                'user_id': {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                'friend_id': {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                'validated': {
                    type: Sequelize.BOOLEAN,
                    allowNull: false
                }
            }
        );
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.dropTable('friends');
  }
};
