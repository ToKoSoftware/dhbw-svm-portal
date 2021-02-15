'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addConstraint('Organizations', {
            fields: ['access_code'],
            type: 'UNIQUE',
            name: 'unique_access_code',
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeConstraint('Organizations', 'unique_access_code');
    }
};
