'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('PollAnswers', 'is_active');
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('PollAnswers', 'is_active', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        });
    }
};