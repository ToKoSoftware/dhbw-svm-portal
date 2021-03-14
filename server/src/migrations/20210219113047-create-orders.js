'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Orders', {
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
            item_id: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            amount: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            value: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            payment_done: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            delivered: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deletedAt: {
                allowNull: true,
                type: Sequelize.DATE,
                defaultValue: null
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Orders');
    }
};