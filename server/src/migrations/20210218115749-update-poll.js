'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Polls', 'is_active');
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Polls', 'is_active', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        });
    }
};