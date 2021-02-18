'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Events', 'is_active');
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Events', 'is_active', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
            
        });
    }
};