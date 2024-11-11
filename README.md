# Notes for the reviewer

My objective here is to create a reusable and scalable backend. Based on this a lot of things has been implemented (data validation, BaseAction model etc...) it was not required for the scope of the test itself.

I also updated some dependencies since some of them showed minor security issues. 

## Database

I used Mongodb to make this exercice easier, since it does not need any relational concepts.

During the `createAction` process, I used a BaseAction static data (`backend/db/seed.js`) to create static data for actions, it makes sure the actions is created using a model.

This is used to store the `maxCredits` for each type of `BaseAction`, and the creation of new `Actions` that can be used by the frontend.

### The database is already seeded, you don't need to run the script to make it work.

## Tests
I didn't focused on the code coverage but more on testing what's useful like the queue processor/make sure the controllers returned the right error codes etc...

## Tools installed

### Prisma

Used to interact with MongoDB.
I used prisma to make sure the db can be changed without major update.
If I had used `mongoose` for example, it would be hard to change the db provider, or even if we want to switch to a relational database, with prisma we only need some small updates on the schema to make it work.
