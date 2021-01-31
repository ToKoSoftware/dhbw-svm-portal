'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Events', null, {});
        await queryInterface.removeColumn('Events', 'price');
        await queryInterface.addColumn('Events', 'price', {
            allowNull: true,
            type: Sequelize.INTEGER,
            defaultValue: null
        });
        await queryInterface.removeColumn('Events', 'max_participants');
        await queryInterface.addColumn('Events', 'max_participants', {
            allowNull: true,
            type: Sequelize.INTEGER,
            defaultValue: null
        });
        await queryInterface.removeColumn('Events', 'date');
        await queryInterface.addColumn('Events', 'start_date', {
            allowNull: false,
            type: Sequelize.DATE
        });
        await queryInterface.addColumn('Events', 'end_date', {
            allowNull: false,
            type: Sequelize.DATE
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Events', null, {});
        await queryInterface.removeColumn('Events', 'price');
        await queryInterface.addColumn('Events', 'price', {
            allowNull: true,
            type: Sequelize.INTEGER,
        });
        await queryInterface.removeColumn('Events', 'max_participants');
        await queryInterface.addColumn('Events', 'max_participants', {
            allowNull: true,
            type: Sequelize.INTEGER
        });
        await queryInterface.removeColumn('Events', 'start_date');
        await queryInterface.removeColumn('Events', 'end_date');
        await queryInterface.addColumn('Events', 'date', {
            allowNull: false,
            type: Sequelize.DATE
        });
    }
};
