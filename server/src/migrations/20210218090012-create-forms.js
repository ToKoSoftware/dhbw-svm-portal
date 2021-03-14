'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Forms', {
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
            description: {
                allowNull: false,
                type: Sequelize.STRING(5000),
            },
            config: {
                type: Sequelize.STRING(20000),
                allowNull: false
            },
            is_internal: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            allowed_team_id: {
                type: Sequelize.STRING,
                allowNull: true
            },
            author_id: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            org_id: {
                type: Sequelize.STRING,
                allowNull: false
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
                type: Sequelize.DATE
            }

        });
        await queryInterface.createTable('FormInstances', {
            id: {
                primaryKey: true,
                allowNull: false,
                type: Sequelize.STRING,
                defaultValue: Sequelize.UUIDV4
            },
            value: {
                type: Sequelize.STRING(20000),
                allowNull: false
            },
            user_id: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            form_id: {
                type: Sequelize.STRING,
                allowNull: false
            },
            org_id: {
                type: Sequelize.STRING,
                allowNull: false
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
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Forms');
        await queryInterface.dropTable('FormInstances');
    }
};
