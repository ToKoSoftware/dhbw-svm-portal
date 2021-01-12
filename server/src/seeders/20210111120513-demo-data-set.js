'use strict';
const v4 = require('uuid').v4;
const bcrypt =  require('bcryptjs');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const date = new Date();
        const org_id_svm = v4();
        const user_id_svm_admin = v4();
        const team_id_svm_outdoor = v4();
        const role_id_svm_admin = v4();
        queryInterface.bulkInsert('Organizations', [{
            id: org_id_svm,
            access_code: 'svm2020',
            config: '{}',
            title: 'SVM',
            is_active: true,
            admin_role_id: role_id_svm_admin,
            createdAt: date,
            updatedAt: date
        }]);
        queryInterface.bulkInsert('Roles', [{
            id: role_id_svm_admin,
            title: 'SVM Admin',
            user_deletable: false,
            is_active: true,
            org_id: org_id_svm
        }]);
        queryInterface.bulkInsert('Teams', [{
            id: team_id_svm_outdoor,
            title: 'SVM Outdoor',
            is_active: true,
            org_id: org_id_svm,
            maintain_role_id: role_id_svm_admin
        }]);
        queryInterface.bulkInsert('RoleAssignments', [{
            id: v4(),
            role_id: role_id_svm_admin,
            user_id: user_id_svm_admin
        }]);
        queryInterface.bulkInsert('Memberships'), [{
            id: v4(),
            user_id: user_id_svm_admin,
            team_id: team_id_svm_outdoor
        }];
        const SALT_FACTOR = 10;
        const hashedPassword = await bcrypt.hash('admin123', SALT_FACTOR);
        queryInterface.bulkInsert('Users', [{
            id: user_id_svm_admin,
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
            org_id: org_id_svm,
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
