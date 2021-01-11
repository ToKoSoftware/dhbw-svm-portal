'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('EventRegistrations', {
            id: {
                primaryKey: true,
                allowNull: false,
                type: Sequelize.STRING,
                defaultValue: Sequelize.UUIDV4
            },
            body: {
                type: Sequelize.STRING,
                allowNull: false
            },
            payment_done: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
            },
            user_id: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            event_id: {
                allowNull: false,
                type: Sequelize.STRING
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
        await queryInterface.dropTable('EventRegistrations');
    }
};