# leaderboard-api

Minimalist Leaderboard Module for Node.js using MongoDB and Redis.

You can access the APi document from http://localhost:3000/api/v1/doc after running the project

### Understanding the Folder Structure

    .
    ├── README.md           // documentation file
    ├── package.json        // dependencies
    ├── src
    └── .
        ├── config              // app config folder. this file contains db connection, api version, app port etc.
        ├── constants           // app constants folder. this file contains cron times, leaderboard and prizepool settings etc.
        ├── cores               // app base package settings folder.
        ├── libs                // aplication libraries
        ├── middlewares         // custom middlewares
        ├── models              // database models
        ├── services            // Api integations
        ├── utils               // Utilities
        ├── app.js              // main nodejs file

### Requirements

* Node 16.6.2
* MongoDB 4.4.6
* Redis 6.2.5

Clone the repository and:

    $ git clone --recursive git@bitbucket.org:smart-education/authoring-service.git
    $ cd authoring-service/

install requirements

    $ npm install

To run the project, Follow the following command:

    $ npm start

Lint your Javascript Files

    $ npm run lint


