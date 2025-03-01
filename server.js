/* ------ this is where our server is set up to handle requests and connect to the database ------ */
import chalk from 'chalk';
import express from 'express';
import router from './router/router.js';
import { morganLogger } from './middlewares/logger.js';
import { badRequest } from './middlewares/badRequest.js';
import { connectServer } from './services/db.service.js';
import { seedUsers } from './users/dataSeed/usersSeed.js';
import seedCards from './cards/dataSeed/cardsSeed.js';

/*--- import from the .env service file ---*/
import { PORT } from './services/env.service.js';

const app = express();

// Add middleware to parse JSON, maximum request body size is 5mb
app.use(express.json({ limit: '5mb' }));

/* Add logger middleware -> is a logging middleware
(like console.log for HTTP requests) */
app.use(morganLogger);

//add a static files middleware
app.use(express.static('public'));

// Add the router to the app
app.use(router);

// Add middleware to handle 404 errors
app.use(badRequest);

// Add middleware to handle 500 errors
app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(500).send("Something BROKE !");
});

app.listen(PORT, async () => {
    console.log(chalk.magenta(`App Is Running On Port ${PORT}`));

    await connectServer();
    await seedUsers();
    await seedCards();

});