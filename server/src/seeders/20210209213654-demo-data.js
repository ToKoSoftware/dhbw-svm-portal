'use strict';
const v4 = require('uuid').v4;
const bcrypt =  require('bcryptjs');
const faker = require('faker');
const timeFunc = require ('../functions/random-time.func');

Date.prototype.addDays = function (d) {
    this.setTime (this.getTime () + (d*24*60*60*1000));
    return this;
};
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
};
const SALT_FACTOR = 10;

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const dt = new Date();
        const date = timeFunc.startTime;
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
        await queryInterface.bulkInsert('Organizations', organizations, {});
        
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
        await queryInterface.bulkInsert('Roles', roles, {});

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
        await queryInterface.bulkInsert('Teams', teams, {});  
        
        const news = [{
            id: news_id_svm,
            title: 'Neue SVM-Website',
            org_id: org_id_svm,
            author_id: user_id_svm_admin ,
            createdAt: dt,
            updatedAt: dt,
            body: 'Die Dualen Wirtschaftsinformatik-Studenten der Kusre WWI19A und B arbeiten derzeit in einzelnen Gruppen jeweils an einer möglichen Website für den SV-Mergelstetten.'
        }];
        
        await queryInterface.bulkInsert('News', news, {});

        let past_event_start_date = new Date();
        past_event_start_date.setFullYear(dt.getFullYear() - 1);
        past_event_start_date.setDate(past_event_start_date.getDate() + 7);
        let past_event_end_date = new Date();
        past_event_end_date.setFullYear(dt.getFullYear() - 1);
        past_event_end_date.setDate(past_event_start_date.getDate() + 3);
        let future_event_end_date = new Date ();
        future_event_end_date.setFullYear(dt.getFullYear() + 1);
        future_event_end_date.setDate(future_date.getDate() + 1);
        const events = [{
            id: event_id_svm_past,
            title: 'Laufwochenende für Läufer',
            description: 'Wir wollen gemeinsam ein sportliches Wochenende mit begeisterten Läufern verbringen. ',
            price: null,
            start_date: past_event_start_date,
            end_date: past_event_end_date,
            max_participants: null,
            author_id: user_id_svm_admin,
            org_id: org_id_svm,
            createdAt: date,
            updatedAt: date
            
        },
        {
            id: event_id_svm_future,
            title: 'Seminar (mit übernachtung): Fit von zu Hause aus ',
            description: 'Hier erfahrt ihr, wie ihr auch von zu Hause aus ganz einfach sportlich aktiv bleibt und gleichzeitig etwas für eure Gesundheit tun könnt. ',
            price: null,
            start_date: future_date,
            end_date: future_event_end_date,
            max_participants: null,
            author_id: user_id_svm_admin,
            org_id: org_id_svm,
            createdAt: date,
            updatedAt: date
        }];
        await queryInterface.bulkInsert('Events', events, {});

        const polls = [{
            id: poll_id_svm,
            title: 'Würdet ihr an Online-Sportangeboten teilnehmen?',
            body: 'Wir wollen uns ein Meinungsbild schaffen, wie ihr zu dem Thema Online-Sportangebote steht.',
            closes_at: future_date,
            author_id: user_id_svm_admin,
            org_id: org_id_svm,
            answer_team_id: team_id_svm_outdoor,
            createdAt: date,
            updatedAt: date
        }];
        await queryInterface.bulkInsert('Polls', polls, {});

        const pollanswers = [{
            id: pollanswer_id_svm_1,
            title: 'Ja.',
            poll_id: poll_id_svm,
            createdAt: date,
            updatedAt: date
        },
        {
            id: pollanswer_id_svm_2,
            title: 'Nein.',
            poll_id: poll_id_svm,
            createdAt: date,
            updatedAt: date
        }];
        await queryInterface.bulkInsert('PollAnswers', pollanswers, {});

        const hashed_password = await bcrypt.hash('admin123', SALT_FACTOR);
        const admin = [{
            id: user_id_svm_admin,
            email: 'admin@admin.com',
            username: 'kehren',
            password:  hashed_password,
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
        await queryInterface.bulkInsert('Users', admin, {});

        const adminRoleAssignments = [{
            id: v4(),
            role_id: role_id_svm_admin,
            user_id: user_id_svm_admin,
            createdAt: date,
            updatedAt: date
        }];
        await queryInterface.bulkInsert('RoleAssignments', adminRoleAssignments, {});
        
        const adminMemberships = [{
            id: v4(),
            user_id: user_id_svm_admin,
            team_id: team_id_svm_outdoor,
            createdAt: date,
            updatedAt: date
        },
        {
            id: v4(),
            user_id: user_id_svm_admin,
            team_id: team_id_svm_turnen_fitness,
            createdAt: date,
            updatedAt: date
        }];
        await queryInterface.bulkInsert('Memberships', adminMemberships, {});

        let femaleusers = [];
        let maleusers = [];
        let roleAssignments = [];
        for (let i = 0; i < 15; i++) {
            const hashed_password = await bcrypt.hash('portal123', SALT_FACTOR);
            const birthday = timeFunc.randomTime(timeFunc.birthdayStartTime, timeFunc.endTime);
            const female_last_name = faker.name.lastName();
            const female_first_name = faker.name.firstName(1);//1 = female
            const male_last_name = faker.name.lastName();
            const male_first_name = faker.name.firstName(0);//0 = male
            femaleusers.push({
                id: v4(),
                email: faker.internet.email(),
                username: faker.internet.userName(female_last_name, female_first_name),
                password:  hashed_password,
                first_name: female_first_name, 
                last_name: female_last_name,
                gender: 'W',
                birthday: birthday,
                street: faker.address.streetName(),
                street_number: faker.random.number(),
                post_code: faker.address.zipCode(),
                city: faker.address.city(),
                org_id: org_id_svm,
                is_active: true,
                createdAt: date,
                updatedAt: date   
            });
            maleusers.push({
                id: v4(),
                email: faker.internet.email(),
                username: faker.internet.userName(male_last_name, male_first_name),
                password:  hashed_password,
                first_name: male_first_name, 
                last_name: male_last_name,
                gender: 'M',
                birthday: birthday,
                street: faker.address.streetName(),
                street_number: faker.random.number(),
                post_code: faker.address.zipCode(),
                city: faker.address.city(),
                org_id: org_id_svm,
                is_active: true,
                createdAt: date,
                updatedAt: date 
            });
            roleAssignments.push ({
                id: v4(),
                role_id: role_id_svm_test_user,
                user_id: femaleusers[i].id,
                createdAt: date,
                updatedAt: date
            });
            roleAssignments.push ({
                id: v4(),
                role_id: role_id_svm_test_user,
                user_id: maleusers[i].id,
                createdAt: date,
                updatedAt: date
            });
        }
        await queryInterface.bulkInsert('Users', femaleusers, {}); 
        await queryInterface.bulkInsert('Users', maleusers, {}); 
        await queryInterface.bulkInsert('RoleAssignments', roleAssignments, {});

        let diverseusers = [];
        let diverseRoleAssignment = [];
        let diverseTurnenFitnessmemberships = [];
        let diverseOutdoorMemberships = [];
        for (let i = 0; i < 2; i++) {
            const hashedPassword = await bcrypt.hash(faker.internet.password(), SALT_FACTOR);
            const date = timeFunc.randomTime(timeFunc.startTime, timeFunc.endTime);
            const birthday = timeFunc.randomTime(timeFunc.birthdayStartTime, timeFunc.endTime);
            const last_name = faker.name.lastName();
            const first_name = faker.name.firstName()
            diverseusers.push({
                id: v4(),
                email: faker.internet.email(),
                username: faker.internet.userName(last_name, first_name),
                password:  hashedPassword,
                first_name: first_name, 
                last_name: last_name,
                gender: 'D',
                birthday: birthday,
                street: faker.address.streetName(),
                street_number: faker.random.number(),
                post_code: faker.address.zipCode(),
                city: faker.address.city(),
                org_id: org_id_svm,
                is_active: true,
                createdAt: date,
                updatedAt: date  
            });
            diverseRoleAssignment.push ({
                id: v4(),
                role_id: role_id_svm_test_user,
                user_id: diverseusers[i].id,
                createdAt: date,
                updatedAt: date
            });
            diverseOutdoorMemberships.push({
                id: v4(),
                user_id: diverseusers[i].id,
                team_id: team_id_svm_outdoor,
                createdAt: date,
                updatedAt: date
            });
            diverseTurnenFitnessmemberships.push({
                id: v4(),
                user_id: diverseusers[i].id,
                team_id: team_id_svm_turnen_fitness,
                createdAt: date,
                updatedAt: date
            });
        }
        await queryInterface.bulkInsert('Users', diverseusers, {});
        await queryInterface.bulkInsert('RoleAssignments',  diverseRoleAssignment, {});
        await queryInterface.bulkInsert('Memberships', diverseOutdoorMemberships, {});
        await queryInterface.bulkInsert('Memberships', diverseTurnenFitnessmemberships, {});
    
        let outdoorMemberships = [];
        let pollVotes =[];
        let poll_answers_1 = [ null, 'Gute Idee!', 'Super, so spart man sich Fahrtwege.', 'Digitalisierung wir kommen!' ];
        let poll_answers_2 = [ null, 'Ich kenn mich mit der Technik leider nicht aus.', 'Ist mir zu kompliziert.', 'Ist nicht notwendig.' ]
        let pastEventRegistrations = [];
        let body = ['Zimmerkategorie: Einzelzimmer', 'Zimmerkategorie: Zweibettzimmer', 'Zimmerkategorie: Dreibettzimmer', 'Zimmerkategorie: Vierbettzimmer' ]
        for (let i = 0; i < 10; i++) {
           outdoorMemberships.push({
                id: v4(),
                user_id: femaleusers[i].id,
                team_id: team_id_svm_outdoor,
                createdAt: date,
                updatedAt: date
            });
            outdoorMemberships.push({
                id: v4(),
                user_id: maleusers[i].id,
                team_id: team_id_svm_outdoor,
                createdAt: date,
                updatedAt: date
            });
            pollVotes.push({
                id: v4(),
                user_id: femaleusers[i].id,
                title: poll_answers_1[getRandomInt(poll_answers_1.length)],
                createdAt: date,
                updatedAt: date,
                poll_answer_id: pollanswer_id_svm_1

            });
            pollVotes.push({
                id: v4(),
                user_id: maleusers[i].id,
                title: poll_answers_2[getRandomInt(poll_answers_2.length)],
                createdAt: date,
                updatedAt: date,
                poll_answer_id: pollanswer_id_svm_2

            });
            pastEventRegistrations.push({
                id: v4(),
                payment_done: true,
                user_id: femaleusers[i].id,
                event_id: event_id_svm_past,
                createdAt: date,
                updatedAt: date,
                body: body[getRandomInt(body.length)]
            });
            pastEventRegistrations.push({
                id: v4(),
                payment_done: true,
                user_id: maleusers[i].id,
                event_id: event_id_svm_past,
                createdAt: date,
                updatedAt: date,
                body: body[getRandomInt(body.length)]
            });
        }  
        await queryInterface.bulkInsert('Memberships', outdoorMemberships, {});
        await queryInterface.bulkInsert('PollVotes', pollVotes, {});
        await queryInterface.bulkInsert('EventRegistrations', pastEventRegistrations, {});
        
        let payment_done_future_event =[true , false];
        let turnenFitnessMemberships = [];
        let futureEventRegistrations = [];
        for (let i = 5; i < 15; i++) {
            turnenFitnessMemberships.push({
                id: v4(),
                user_id: femaleusers[i].id,
                team_id: team_id_svm_turnen_fitness,
                createdAt: date,
                updatedAt: date
            });
            turnenFitnessMemberships.push({
                id: v4(),
                user_id: maleusers[i].id,
                team_id: team_id_svm_turnen_fitness,
                createdAt: date,
                updatedAt: date
            });
            futureEventRegistrations.push({
                id: v4(),
                payment_done: payment_done_future_event[getRandomInt(payment_done_future_event.length)],
                user_id: femaleusers[i].id,
                event_id: event_id_svm_future,
                createdAt: date,
                updatedAt: date,
                body: body[getRandomInt(body.length)],
            });
            futureEventRegistrations.push({
                id: v4(),
                payment_done: payment_done_future_event[getRandomInt(payment_done_future_event.length)],
                user_id: maleusers[i].id,
                event_id: event_id_svm_future,
                createdAt: date,
                updatedAt: date,
                body: body[getRandomInt(body.length)],
            });
        }
        await queryInterface.bulkInsert('Memberships', turnenFitnessMemberships, {});
        await queryInterface.bulkInsert('EventRegistrations', futureEventRegistrations, {});
        
    },


    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Organizations', null, {});
        await queryInterface.bulkDelete('Roles', null, {});
        await queryInterface.bulkDelete('Teams', null, {});
        await queryInterface.bulkDelete('News', null, {});
        await queryInterface.bulkDelete('Events', null, {});
        await queryInterface.bulkDelete('Polls', null, {});
        await queryInterface.bulkDelete('PollAnswers', null, {});
        await queryInterface.bulkDelete('RoleAssignments', null, {});
        await queryInterface.bulkDelete('Users', null, {});
        await queryInterface.bulkDelete('Memberships', null, {});
        await queryInterface.bulkDelete('PollVotes', null, {});
        await queryInterface.bulkDelete('EventRegistrations', null, {});

    }
};
