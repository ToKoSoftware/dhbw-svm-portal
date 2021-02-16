'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Organizations', 'public_team_id', {
            type: Sequelize.STRING,
            allowNull: true
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Organizations', 'public_team_id');
    }
};