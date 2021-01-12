'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Teams', {
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
            maintain_role_id: {
                type: Sequelize.STRING,
                allowNull: false
            },
            org_id: {
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
        await queryInterface.dropTable('Teams');
    }
};