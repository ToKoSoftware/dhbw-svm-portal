'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Organizations', 'privacy_policy_text', {
            type: Sequelize.STRING(5000),
            allowNull: true
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Organizations', 'orprivacy_policy_textg_id');
    }
};