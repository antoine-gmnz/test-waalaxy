# Notes for the reviewer

My objective here is to create a reusable and scalable backend. Based on this a lot of things has been implemented (data validation, ActionType model etc...) it was not required for the scope of the test itself.

I also updated some dependencies since some of them showed minor security issues.

## Start the project
### Prerequisite
#### Env files
To start the project you need 2 env files. 
- `apps/frontend/.env`: `BASE_URL="http://localhost:4200/"`
- `apps/backend/.env`: Will be provided by email (my personal API key is present and the repo will be public)

#### Prisma
If you want to run the project locally you need the dynamics TS types created by prisma. The easiest way to have them is to run this command at the root of the project: `npx prisma db push`

### Useful commands
#### Frontend
`nx serve frontend` || `npx nx serve frontend`

#### Backend
`nx serve backend` || `npx nx serve backend`

#### Unit tests
 `nx test backend`


## Database
I used Mongodb to make this exercice easier, since it does not need any relational concepts.

During the `createAction` process, I used a ActionType static data (`backend/db/seed.js`) to create static data for actions, it makes sure the actions is created using a model.

### The database is already seeded, you don't need to run the script to make it work.

## Unit tests
I didn't focused on the code coverage but more on testing what's useful like the queue processor/make sure the controllers returned the right error codes etc...

## Tools installed
### Prisma
Used to interact with MongoDB.
I used prisma to make sure the db can be changed without major update.
If I had used `mongoose` for example, it would be hard to change the db provider, or even if we want to switch to a relational database, with prisma we only need some small updates on the schema to make it work.

## Rooms for improvement
### Error handling
Although I tried to handle errors for everything some improvements can be made on error handling.

- A custom logger would have been a nice to have. 
- Sometimes prisma will return an error if something is not find, I'm not digging inside prisma errors, that can cause misleading error codes returned to the frontend (eg: If I try to patch a non-existing item, prisma will return a `Not Found` error, but th catch in the controller will return an `Internal server error` with the prisma message).

### Queue process
The current algorithm is looping inside queue actions, and try for everyone of them to execute the action, in this case if we have 6 actions without the necessary credits to execute them, the algorithm will try to execute it one by one. I think this can be improved.

### Sync
The current way of getting the right timer for the queue execution is done using the `lastExecutedTime` property, each time the queue is executing an action it updates the `lastExecutedTime` property, this way, the frontend can calculate when will be the next execution. In some edge cases that can cause mis-synchronisation. 
To avoid this I could have use WebSockets (socket.io) to send messages directly to the frontend side. But it would cause a lot of messages and it's harder to maintain (to me, maybe for someone else it'll be easier).
