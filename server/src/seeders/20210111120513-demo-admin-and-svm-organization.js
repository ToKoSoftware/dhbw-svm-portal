'use strict';
const v4 = require('uuid').v4;
const bcrypt =  require('bcryptjs');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const date = new Date();
        const org_id = v4();
        queryInterface.bulkInsert('Organizations', [{
            id: org_id,
            access_code: 'svm2020',
            config: {},
            title: 'SVM',
            is_active: true,
            createdAt: date,
            updatedAt: date
        }]);
        const SALT_FACTOR = 10;
        const hashedPassword = await bcrypt.hash('admin123', SALT_FACTOR);
        queryInterface.bulkInsert('Users', [{
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
            org_id: org_id,
            is_active: true,
            is_admin: true,
            createdAt: date,
            updatedAt: date
        }]);
    },

    down: async (queryInterface, Sequelize) => {
        queryInterface.bulkDelete('Users', null, {});
        queryInterface.bulkDelete('Organizations', null, {});
    }
};
