'use strict';
const v4 = require('uuid').v4;
const bcrypt =  require('bcryptjs');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('SELECT id FROM "Organizations" WHERE title = ? ', {
            replacements: ['SV Mergelstetten 1879 e.V.'],
            type: queryInterface.sequelize.QueryTypes.SELECT
        })
            .then(async function (organizations) {
                await queryInterface.sequelize.query('SELECT id FROM "Teams" WHERE title = ? ', {
                    replacements: ['SVM Outdoor'],
                    type: queryInterface.sequelize.QueryTypes.SELECT
                })
                    .then(async function (teams) {
                        await queryInterface.sequelize.query('SELECT id FROM "Users" WHERE username = ? ', {
                            replacements: ['kehren'],
                            type: queryInterface.sequelize.QueryTypes.SELECT
                        })
                            .then(async function (adminuser) {
                                const date = new Date();
                                const user_id_svm_test = v4();
                                const role_id_svm_test = v4();

                                const roles = [{
                                    id: role_id_svm_test,
                                    title: 'Alle Test-User',
                                    user_deletable: true,
                                    is_active: true,
                                    org_id: organizations[0].id,
                                    createdAt: date,
                                    updatedAt: date
                                }];
                                queryInterface.bulkInsert('Roles', roles, {});

                                const roleAssignments = [{
                                    id: v4(),
                                    role_id: role_id_svm_test,
                                    user_id: user_id_svm_test,
                                    createdAt: date,
                                    updatedAt: date
                                }];
                                queryInterface.bulkInsert('RoleAssignments', roleAssignments, {});
                                
                                const memberships = [{
                                    id: v4(),
                                    user_id: user_id_svm_test,
                                    team_id: teams[0].id,
                                    createdAt: date,
                                    updatedAt: date
                                }];
                                queryInterface.bulkInsert('Memberships', memberships, {});
                                
                                const SALT_FACTOR = 10;
                                const hashedPassword = await bcrypt.hash('test123', SALT_FACTOR);
                                const users = [{
                                    id: user_id_svm_test,
                                    email: 'Max@Muster.com',
                                    username: 'MaxMuster',
                                    password:  hashedPassword,
                                    first_name: 'Max',
                                    last_name: 'Muster',
                                    gender: 'M',
                                    birthday: new Date('01.01.1990'),
                                    street: 'Musterstr.',
                                    street_number: '9',
                                    post_code: '89522',
                                    city: 'Heidenheim',
                                    org_id: organizations[0].id,
                                    is_active: true,
                                    is_admin: false,
                                    createdAt: date,
                                    updatedAt: date
                                }];
                                queryInterface.bulkInsert('Users', users, {});

                                const events = [{
                                    id: v4(),
                                    title: 'MusterEvent',
                                    description: 'Muster',
                                    price: null,
                                    date: date,
                                    max_participants: null,
                                    is_active: true,
                                    author_id: adminuser[0].id,
                                    org_id: organizations[0].id,
                                    createdAt: date,
                                    updatedAt: date
                                    
                                }];
                                queryInterface.bulkInsert('Events', events, {});

                                const polls = [{
                                    id: v4(),
                                    title: 'MusterPoll',
                                    body: 'Muster',
                                    closes_at: date,
                                    is_active: true,
                                    author_id: adminuser[0].id,
                                    org_id: organizations[0].id,
                                    answer_team_id: teams[0].id,
                                    createdAt: date,
                                    updatedAt: date
                                }];
                                queryInterface.bulkInsert('Polls', polls, {});
                    })   
                })
            })
    },

    down: async (queryInterface, Sequelize) => {
        queryInterface.bulkDelete('Users', null, {});
        queryInterface.bulkDelete('Roles', null, {});
        queryInterface.bulkDelete('RoleAssignments', null, {});
        queryInterface.bulkDelete('Memberships', null, {});
        queryInterface.bulkDelete('Events', null, {});
        queryInterface.bulkDelete('Polls', null, {});
    }
};
