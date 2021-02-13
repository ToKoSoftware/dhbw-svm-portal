'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Organizations', 'creditor_id', {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null
        });
        await queryInterface.addColumn('Organizations', 'direct_debit_mandate_contract_text', {
            type: Sequelize.STRING(5000),
            allowNull: true,
            defaultValue: null
        });
        await queryInterface.createTable('DirectDebitMandates', {
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
            org_id: {
                type: Sequelize.STRING,
                allowNull: false
            },
            bank_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            IBAN: {
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
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Organizations', 'creditor_id');
        await queryInterface.removeColumn('Organizations', 'direct_debit_mandate_contract_text');
        await queryInterface.dropTable('DirectDebitMandates');
    }
};