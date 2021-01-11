'use strict';
const v4 = require('uuid').v4;
const bcrypt =  require('bcryptjs');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        queryInterface.bulkDelete('Users', null, {});
        const date = new Date();
        const SALT_FACTOR = 10;
        const hashedPassword = await bcrypt.hash('admin123', SALT_FACTOR);
        return queryInterface.bulkInsert('Users', [{
            id: v4(),
            email: 'admin@admin.com',
            username: 'admin',
            password:  hashedPassword,
            first_name: 'Katharina',
            last_name: 'Blessing-Kehren',
            gender: 'W',
            street: 'Oberdorfstr.',
            street_number: '9',
            post_code: '89522',
            city: 'Heidenheim',
            is_active: true,
            is_admin: true,
            createdAt: date,
            updatedAt: date
        }]);
    },

    down: async (queryInterface, Sequelize) => {
        queryInterface.bulkDelete('Users', null, {});
        const date = new Date();
        const SALT_FACTOR = 10;
        const hashedPassword = await bcrypt.hash('admin123', SALT_FACTOR);
        return queryInterface.bulkInsert('Users', [{
            id: v4(),
            email: 'admin@admin.com',
            password:  hashedPassword,
            firstName: 'Katharina',
            lastName: 'Blessing-Kehren',
            street: 'Oberdorfstr.',
            streetNumber: '9',
            postcode: '89522',
            city: 'Heidenheim',
            is_active: true,
            is_admin: true,
            createdAt: date,
            updatedAt: date
        }]);
    }
};
