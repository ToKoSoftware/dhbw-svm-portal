# Website project DHBW Heidenheim
![](https://github.com/ToKoSoftware/dhbw-svm-portal/workflows/CI/badge.svg)


This is a university assignment project for the course of Database application development (WWI2019A).


## Installation - Docker
**This is the recommended way**

0. You need to have docker installed
1. Create a `.env` file and fill in your desired database configuration:

```
POSTGRES_PASSWORD=postgres
POSTGRES_USER=postgres
POSTGRES_DB=portal
JWT_HASH=randomstr
```
**Warning** This file should not be commited to the repository!

2. run `docker-compose up`. Docker will pull all images for you and automatically set everting up.
3. postgresql should now be running on port `5432`, the express server should be running at port `80`

## Installation - Without Docker
0. You need to have a local working postgresql installation running
1. In `server` run `npm install` (`cd server && npm install`)
2. Run migrations and seeders, see section below
3. To start a local 
  - developent server, which restarts on filechange run 
  ```bash
  PORT=80 LOGGING=true JWT_HASH=abc DATABASE_URL=localhost DATABASE_NAME=portal DATABASE_USER=postgres DATABASE_PASSWORD=postgres npm run dev
  ```
  - production server, run 
  ```bash
  PORT=80 LOGGING=true JWT_HASH=abc DATABASE_URL=localhost DATABASE_NAME=portal DATABASE_USER=postgres DATABASE_PASSWORD=postgres npm start
  ```
  **Remember to fill in your own database configuaration**
  
4. Open a new terminal window. In `frontend` run `npm install` (`cd frontend && npm install`)
5. To start an Angular Dev Server run run `npm start`
6. The API should be running on port `80`; The Angular development server should be running on port `4200` 

## Migrations

To run a database migration execute `cd server && npm run db:migrate`. The Docker container will do this automatically on restart.

To undo a database migration execute `cd server && npm run db:migrate:undo`.

Note: Remember to add your database configuration as ENV variables (`DATABASE_NAME=portal DATABASE_PASSWORD=postgres DATABASE_USER=postgres DATABASE_URL=localhost npm run db:migrate`) 

## Seeders

A random sample data set is provided by seeders.

To run all seeders execute `cd server && npm run db:seed`. The Docker container will do this automatically on restart.
**This is not recommended behaviour on production systems.**

To undo all seeders run `cd server && npm run db:seed:undo`. **This may lead to a data loss.**

Note: Remember to add your database configuration as ENV variables (`DATABASE_NAME=protal DATABASE_PASSWORD=postgres DATABASE_USER=postgres DATABASE_URL=localhost npm run db:seed`) 
