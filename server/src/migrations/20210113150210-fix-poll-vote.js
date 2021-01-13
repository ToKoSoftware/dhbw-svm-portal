'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('PollVotes', 'poll_answer_id')
        await queryInterface.addColumn('PollVotes', 'poll_answer_id', {
            type: Sequelize.STRING,
            allowNull: false
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('PollVotes', 'poll_answer_id')
        await queryInterface.addColumn('PollVotes', 'poll_answer_id', {
            type: Sequelize.UUID,
            allowNull: false
        });
    }
};
