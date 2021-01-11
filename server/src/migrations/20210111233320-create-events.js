'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Events', {
            id: {
                primaryKey: true,
                allowNull: false,
                type: DataType.STRING,
                defaultValue: DataType.UUIDV4
            },
            title: {
                type: DataType.STRING,
                allowNull: false
            },
            description: {
                allowNull: false,
                type: DataType.STRING,
            },
            price: {
                allowNull: true,
                type: DataType.INTEGER,
            },
            date: {
                allowNull: false,
                type: DataType.DATE
            },
            max_participants: {
                allowNull: true,
                type: DataType.INTEGER
            },
            is_active: {
                type: DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            createdAt: {
                allowNull: false,
                type: DataType.DATE
            },
            updatedAt: {
                allowNull: false,
                type: DataType.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Events');
    }