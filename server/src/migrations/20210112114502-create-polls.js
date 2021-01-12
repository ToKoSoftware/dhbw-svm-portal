'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Polls', {
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
            body: {
                type: Sequelize.STRING,
                allowNull: false
            },
            org_id: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            author_id: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            answer_team_id: {
                allowNull: false,
                type: Sequelize.STRING
            },
            closes_at: {
                type: Sequelize.DATE,
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
        await queryInterface.dropTable('Polls');
    }
};