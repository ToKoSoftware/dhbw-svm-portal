'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('News', 'is_active');
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('News', 'is_active', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        });
    }
};