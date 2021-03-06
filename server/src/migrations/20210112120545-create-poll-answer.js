'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('PollAnswers', {
            id: {
                primaryKey: true,
                allowNull: false,
                type: Sequelize.STRING,
                defaultValue: Sequelize.UUIDV4
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            poll_id: {
                type: Sequelize.STRING,
                allowNull: false
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
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
        await queryInterface.dropTable('PollAnswers');
    }
};


