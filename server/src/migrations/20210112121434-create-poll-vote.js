'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('PollVots', {
            id: {
                primaryKey: true,
                allowNull: false,
                type: Sequelize.STRING,
                defaultValue: Sequelize.UUIDV4
            },
            user_id: {
                type: Sequelize.STRING,
                allowNull: false
            },
            poll_answer_id: {
                type: Sequelize.UUID,
                allowNull: false
            },
            title: {
                type: Sequelize.STRING,
                allowNull: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('PollVots');
    }
};