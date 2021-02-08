'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Users', 'is_admin');
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Users', 'is_admin', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        });
    }
};