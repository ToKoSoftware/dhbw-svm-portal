'use strict';
const v4 = require('uuid').v4;
const bcrypt =  require('bcryptjs');
const timeFunc = require ('../functions/random-time.func');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const date = timeFunc.randomTime(timeFunc.startTime, timeFunc.endTime);
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
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
