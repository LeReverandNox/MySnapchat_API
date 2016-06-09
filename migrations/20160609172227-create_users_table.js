'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return [
            queryInterface.createTable(
                'users',
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
                    'username': {
                        type: Sequelize.STRING(30),
                        allowNull: false
                    },
                    'email': {
                        type: Sequelize.STRING,
                        allowNull: false
                    },
                    'password': {
                        type: Sequelize.STRING,
                        allowNull: false
                    },
                }
            ),
            queryInterface.addIndex(
                'users',
                ['username'],
                {
                    indexName: 'username',
                    indicesType: 'UNIQUE'
                }
            ),
            queryInterface.addIndex(
                'users',
                ['email'],
                {
                    indexName: 'email',
                    indicesType: 'UNIQUE'
                }
            )
        ];
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('users');
    }
};
