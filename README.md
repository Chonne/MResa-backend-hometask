# MResa Backend Hometask

## Disclaimer

A few things that seem worthy to note to better understand what I've done:

- I've never worked with Nestjs and Prisma so there may be some features and best practices that I've missed and would gladly learn about.
- The stack I've chosen is based on the one described in the company's profile.
- Some routes were added for ease of use and because, well, it was quick to do with nest's resource generator.
- I wrote tests after writing the code, as I'm not used to TDD.
- Also, the openapi stuff and the code for vendors and buyers is out of scope but it was useful to better understand the framework.
- The feature commits look a bit disorganized and include multiple features for a single kind of resource. This is because I coded everything along the way and had to change a lot of code multiple times. In a real project, I'd create a branch for each feature (eg adding a new route) and would merge it through a PR.

### Assumptions

I've assumed a few details to ease development. Of course, they should be discussed with stakeholders before being taken into account:

- titles and names are unique: this was mostly to make seeding easier. It should be adapted to real constraints as it's not realistic, eg something like an email for buyers/vendors or a human-readable id
- appointments can be created in the past to allow backlogging, in case a buyer or vendor had forgotten to add one and wanted it in their history
- appointments can end and begin at the same time, ie appointment A ends at 10:00 and appointment B begins at 10:00. Even though that's not a good practice, I'm sure it happens.

### What I've done

- set the project up with nestjs' generator
- configure a postgresql db using docker-compose, mainly for dev purposes
- generate resources with nestjs' generator
- define the prisma schema, entities, DTOs and seeds
- add openapi decorators
- implemented the expected features (the name/company search is very basic)
- wrote e2e tests and a few unit tests

### What I would do next

Either I haven't had time to implement the features or it wasn't in the scope of this test and would've required spending too much time learning the specifics of the framework. Either way, these are features I would add to make it production-ready.

- implement soft deletion, eg using a `deleted_at` column
- add extra business data to tables and technical ones (`created_at`...)
- for further configuration needs, use @nestjs/config
- include user authentication, at least for creation, update and deletion, eg using bearer tokens or JWT
- listen to a port passed as an env variable
- disable swagger in production
- set proper indexes and unique fields for the db. And make sure they're enforced, it doesn't look like they are
- add pagination to all lists
- when returning exceptions, use default messages in prod to avoid displaying stacks
- use `nestjs-prisma` to replace boilerplate code (for the exception handling)
- if useful, include relational entities in appointments: I didn't do it because it would've made the code more complex by reassigning objects and avoiding recursion issues
- use a DTO for `GET /buyers` query params
- adapt the appointment conflict response to include more details to better identify the conflicting appointments, perhaps by including the list of appointment entities in the response
- include the api in the docker-compose
- include transactions? I haven't noticed anywhere they would be needed
- validate `Appointment.link` as an url?
- fix(appointment): changing the type must reset link or location
- use `AppointmentType` in the tests
- use unit tests to have better code coverage

## Description

This project is a technical hometask for a backend job.

Main stack: Nestjs, typescript, prisma, postgresql.

It was first built using Nestjs' generator.

## Installation

```bash
npm install
```

For local dev:

```bash
# this will create local config from dist files
npm run prepare:config
```

Edit the config filesto your liking:

- `.env`
- `docker-compose.override.yml`

Make sure your db is running. If you want to use the db defined in docker-compose, run this: `docker-compose up -d`

Initialize the db:

```bash
# this command will:
# generate the prisma client
# generate the db and tables
npx prisma migrate dev
```

If you want to add some dummy data to your local db:

```bash
npx prisma db seed
```

## Running the app

If you want to use the db defined in docker-compose, run this before the other commands: `docker-compose up -d`

Don't forget to stop the container with a command like this one: `docker-compose down`

Launch the server (default port is 3000):

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### API doc

Swagger is enabled and accessible there (if run locally): <http://localhost:3000/api>

## Test

### Unit tests

```bash
npm run test
```

### End to end tests

The e2e tests require a running db so you'll need to setup an env for them.

Run the command `npm run prepare:config:test`.

Then edit the newly created files if needed (the default values should be fine):

- `.env.test`
- `docker-compose.override.test.yml`

If you're using the provided db, you can run it in the background with `npm run test:run-db`

Create the database (you may need to wait a few seconds for the db to be available): `npm run test:e2e:prepare-db`

Run the tests: `npm run test:e2e`

If everything's working well, you can stop the db: `npm run test:stop-db`

## License

This project is unlicensed, do whatever you want with it.
