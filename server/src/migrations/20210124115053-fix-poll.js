'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Polls', 'answer_team_id')
        await queryInterface.addColumn('Polls', 'answer_team_id', {
            type: Sequelize.STRING,
            allowNull: true
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Polls', 'answer_team_id')
        await queryInterface.addColumn('Polls', 'answer_team_id', {
            type: Sequelize.STRING,
            allowNull: false
        });
    }
};