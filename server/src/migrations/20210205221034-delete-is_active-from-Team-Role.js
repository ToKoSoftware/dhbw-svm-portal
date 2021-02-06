'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Teams', 'is_active');
        await queryInterface.removeColumn('Roles', 'is_active');
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Teams', 'is_active', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        });
        await queryInterface.addColumn('Roles', 'is_active', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        });

    }
}