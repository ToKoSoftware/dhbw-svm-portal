'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('EventRegistrations', 'body');
        await queryInterface.addColumn('EventRegistrations', 'body', {
            type: Sequelize.STRING(5000),
            allowNull: false
        });
        await queryInterface.removeColumn('Events', 'description');
        await queryInterface.addColumn('Events', 'description', {
            allowNull: false,
            type: Sequelize.STRING(5000),
        });
        await queryInterface.removeColumn('News', 'body');
        await queryInterface.addColumn('News', 'body', {
            type: Sequelize.STRING(5000),
            allowNull: false
        });
        await queryInterface.removeColumn('Polls', 'body');
        await queryInterface.addColumn('Polls', 'body', {
            type: Sequelize.STRING(5000),
            allowNull: false
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('EventRegistrations', 'body');
        await queryInterface.addColumn('EventRegistrations', 'body', {
            type: Sequelize.STRING,
            allowNull: false
        });
        await queryInterface.removeColumn('Events', 'description');
        await queryInterface.addColumn('Events', 'description', {
            allowNull: false,
            type: Sequelize.STRING,
        });
        await queryInterface.removeColumn('News', 'body');
        await queryInterface.addColumn('News', 'body', {
            type: Sequelize.STRING,
            allowNull: false
        });
        await queryInterface.removeColumn('Polls', 'body');
        await queryInterface.addColumn('Polls', 'body', {
            type: Sequelize.STRING,
            allowNull: false
        });
    }
};