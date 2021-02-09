'use strict';
const v4 = require('uuid').v4;
const bcrypt =  require('bcryptjs');
const faker = require('faker');
const timeFunc = require ('../functions/random-time.func');

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
};
const SALT_FACTOR = 10;

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const dt = new Date();
        let date = timeFunc.startTime;
        let future_date = new Date ();
        future_date.setFullYear(dt.getFullYear() + 1);
        const org_id_svm = v4();
        const user_id_svm_admin = v4();
        const team_id_svm_outdoor = v4();
        const team_id_svm_turnen_fitness = v4();
        const role_id_svm_admin = v4();
        const role_id_svm_test_user = v4();
        const news_id_svm = v4();
        const event_id_svm_future = v4();
        const event_id_svm_past = v4();
        const poll_id_svm = v4();
        const pollanswer_id_svm_1 = v4();
        const pollanswer_id_svm_2 = v4();

    
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
            title: 'Administratoren',
            user_deletable: false,
            org_id: org_id_svm,
            createdAt: date,
            updatedAt: date
        },
        {
            id: role_id_svm_test_user,
            title: 'Test-User',
            user_deletable: true,
            org_id: org_id_svm,
            createdAt: date,
            updatedAt: date

        }];
        queryInterface.bulkInsert('Roles', roles, {});

        const teams = [{
            id: team_id_svm_outdoor,
            title: 'SVM Outdoor',
            org_id: org_id_svm,
            maintain_role_id: role_id_svm_admin,
            createdAt: date,
            updatedAt: date
        },
        {
            id: team_id_svm_turnen_fitness,
            title: 'SVM Turnen und Fitness',
            org_id: org_id_svm,
            maintain_role_id: role_id_svm_admin,
            createdAt: date,
            updatedAt: date
        }];
        queryInterface.bulkInsert('Teams', teams, {});  
        
        const news = [{
            id: news_id_svm,
            title: 'Test',
            org_id: org_id_svm,
            author_id: user_id_svm_admin ,
            is_active: true,
            createdAt: date,
            updatedAt: date,
            body: 'Neuigkeit'
        }];
        
        queryInterface.bulkInsert('News', news, {});

        const events = [{
            id: event_id_svm_past,
            title: 'Muster-Event-Vergangenheit',
            description: 'Ereignis',
            price: null,
            start_date: date,
            end_date: date,
            max_participants: null,
            is_active: true,
            author_id: user_id_svm_admin,
            org_id: org_id_svm,
            createdAt: date,
            updatedAt: date
            
        },
        {
            id: event_id_svm_future,
            title: 'Muster-Event-Zukunft',
            description: 'Ereignis',
            price: null,
            start_date: future_date,
            end_date: future_date,
            max_participants: null,
            is_active: true,
            author_id: user_id_svm_admin,
            org_id: org_id_svm,
            createdAt: date,
            updatedAt: date
        }];
        queryInterface.bulkInsert('Events', events, {});

        const polls = [{
            id: poll_id_svm,
            title: 'Muster-Poll',
            body: 'Umfrage',
            closes_at: date,
            is_active: true,
            author_id: user_id_svm_admin,
            org_id: org_id_svm,
            answer_team_id: team_id_svm_outdoor,
            createdAt: date,
            updatedAt: date
        }];
        queryInterface.bulkInsert('Polls', polls, {});

        const pollanswers = [{
            id: pollanswer_id_svm_1,
            title: 'Antwort 1',
            poll_id: poll_id_svm,
            is_active: true,
            createdAt: date,
            updatedAt: date
        },
        {
            id: pollanswer_id_svm_2,
            title: 'Antwort 2',
            poll_id: poll_id_svm,
            is_active: true,
            createdAt: date,
            updatedAt: date
        }];
        queryInterface.bulkInsert('PollAnswers', pollanswers, {});

        const hashedPassword = await bcrypt.hash('admin123', SALT_FACTOR);
        const admin = [{
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
            createdAt: date,
            updatedAt: date
        }];
        queryInterface.bulkInsert('Users', admin, {});

        const admin_roleAssignments = [{
            id: v4(),
            role_id: role_id_svm_admin,
            user_id: user_id_svm_admin,
            createdAt: date,
            updatedAt: date
        }];
        queryInterface.bulkInsert('RoleAssignments', admin_roleAssignments, {});
        
        const admin_memberships = [{
            id: v4(),
            user_id: user_id_svm_admin,
            team_id: team_id_svm_outdoor,
            createdAt: date,
            updatedAt: date
        }];
        queryInterface.bulkInsert('Memberships', admin_memberships, {});

        let femaleusers = [];
        let maleusers = [];
        for (let i = 0; i < 10; i++) {
            const hashedPassword = await bcrypt.hash(faker.internet.password(), SALT_FACTOR);
            const date = timeFunc.randomTime(timeFunc.startTime, timeFunc.endTime);
            const birthday = timeFunc.randomTime(timeFunc.birthdayStartTime, timeFunc.endTime);
            const name = faker.name.lastName();
            femaleusers.push({
                id: v4(),
                email: faker.internet.email(),
                username: name,
                password:  hashedPassword,
                first_name: faker.name.firstName(1), //1 = female
                last_name: name,
                gender: 'W',
                birthday: birthday,
                street: faker.address.streetName(),
                street_number: faker.random.number(),
                post_code: faker.address.zipCode(),
                city: faker.address.city(),
                org_id: org_id_svm,
                is_active: true,
                createdAt: date,
                updatedAt: timeFunc.randomTime(date, timeFunc.endTime)   
            });
            maleusers.push({
                id: v4(),
                email: faker.internet.email(),
                username: name,
                password:  hashedPassword,
                first_name: faker.name.firstName(0), //0 = male
                last_name: name,
                gender: 'M',
                birthday: birthday,
                street: faker.address.streetName(),
                street_number: faker.random.number(),
                post_code: faker.address.zipCode(),
                city: faker.address.city(),
                org_id: org_id_svm,
                is_active: true,
                createdAt: date,
                updatedAt: timeFunc.randomTime(date, timeFunc.endTime)   
            });
        }
        await queryInterface.bulkInsert('Users', femaleusers); 
        await queryInterface.bulkInsert('Users', maleusers); 

        let diverseusers = [];
        for (let i = 0; i < 2; i++) {
            const hashedPassword = await bcrypt.hash(faker.internet.password(), SALT_FACTOR);
            const date = timeFunc.randomTime(timeFunc.startTime, timeFunc.endTime);
            const birthday = timeFunc.randomTime(timeFunc.birthdayStartTime, timeFunc.endTime);
            const name = faker.name.lastName();
            diverseusers.push({
                id: v4(),
                email: faker.internet.email(),
                username: name,
                password:  hashedPassword,
                first_name: faker.name.firstName(), 
                last_name: name,
                gender: 'D',
                birthday: birthday,
                street: faker.address.streetName(),
                street_number: faker.random.number(),
                post_code: faker.address.zipCode(),
                city: faker.address.city(),
                org_id: org_id_svm,
                is_active: true,
                createdAt: date,
                updatedAt: timeFunc.randomTime(date, timeFunc.endTime)   
            });
        }
        await queryInterface.bulkInsert('Users', diverseusers);
    },

    down: async (queryInterface, Sequelize) => {
        queryInterface.bulkDelete('Organizations', null, {});
        queryInterface.bulkDelete('Roles', null, {});
        queryInterface.bulkDelete('Teams', null, {});
        queryInterface.bulkDelete('News', null, {});
        queryInterface.bulkDelete('Events', null, {});
        queryInterface.bulkDelete('Polls', null, {});
        queryInterface.bulkDelete('PollAnswers', null, {});
        queryInterface.bulkDelete('RoleAssignments', null, {});
        queryInterface.bulkDelete('Users', null, {});
        queryInterface.bulkDelete('Memberships', null, {});

    }
};
