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
        const organizations = [{
            id: org_id_svm,
            access_code: 'svm2021',
            config: '{}',
            title: 'SV Mergelstetten 1879 e.V.',
            is_active: true,
            admin_role_id: role_id_svm_admin,
            createdAt: date,
            updatedAt: date
        }];
        queryInterface.bulkInsert('Organizations', organizations, {});
        
        const roles = [{
            id: role_id_svm_admin,
            title: 'Alle Administratoren',
            user_deletable: false,
            is_active: true,
            org_id: org_id_svm,
            createdAt: date,
            updatedAt: date
        }];
        queryInterface.bulkInsert('Roles', roles, {});

        const teams = [{
            id: team_id_svm_outdoor,
            title: 'SVM Outdoor',
            is_active: true,
            org_id: org_id_svm,
            maintain_role_id: role_id_svm_admin,
            createdAt: date,
            updatedAt: date
        }];
        queryInterface.bulkInsert('Teams', teams, {});

        const roleAssignments = [{
            id: v4(),
            role_id: role_id_svm_admin,
            user_id: user_id_svm_admin,
            createdAt: date,
            updatedAt: date
        }];
        queryInterface.bulkInsert('RoleAssignments', roleAssignments, {});
        
        const memberships = [{
            id: v4(),
            user_id: user_id_svm_admin,
            team_id: team_id_svm_outdoor,
            createdAt: date,
            updatedAt: date
        }];
        queryInterface.bulkInsert('Memberships', memberships, {});
        
        const SALT_FACTOR = 10;
        const hashedPassword = await bcrypt.hash('admin123', SALT_FACTOR);
        const users = [{
            id: user_id_svm_admin,
            email: 'admin@admin.com',
            username: 'kehren',
            password:  hashedPassword,
            first_name: 'Katharina',
            last_name: 'Blessing-Kehren',
            gender: 'W',
            birthday: new Date('01.01.1985'),
            street: 'Oberdorfstr.',
            street_number: '9',
            post_code: '89522',
            city: 'Heidenheim',
            org_id: org_id_svm,
            is_active: true,
            is_admin: true,
            createdAt: date,
            updatedAt: date
        }];
        queryInterface.bulkInsert('Users', users, {});
    },

    down: async (queryInterface, Sequelize) => {
        queryInterface.bulkDelete('Users', null, {});
        queryInterface.bulkDelete('Organizations', null, {});
        queryInterface.bulkDelete('Roles', null, {});
        queryInterface.bulkDelete('RoleAssignments', null, {});
        queryInterface.bulkDelete('Teams', null, {});
        queryInterface.bulkDelete('Memberships', null, {});
    }
};
