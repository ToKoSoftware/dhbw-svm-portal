'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Users', 'org_id');
        await queryInterface.addColumn('Users', 'org_id', {
            type: Sequelize.STRING,
            allowNull: true
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Users', 'org_id');
        await queryInterface.addColumn('Users', 'org_id', {
            type: Sequelize.STRING,
            allowNull: false
        });
    }
};