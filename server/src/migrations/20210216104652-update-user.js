'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Users', 'last_login', {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Users', 'last_login');
    }
};