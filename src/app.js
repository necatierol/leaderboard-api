/* eslint-disable no-console */
import express from 'express';

import expressCore from './core/express';
import router from './core/router';

import errorHandling from './middlewares/errorHandling';
import connectMongoose from './core/mongoose';
import redis from './core/redis';
import cron from './core/cron';

import doc from './core/swagger';

import AMQP from './libs/amqp';


const port = process.env.PORT || 3000;
const app = express();


connectMongoose();
redis.connect();
cron();

AMQP.build()
  .then(() => console.log('RabbitMQ Connected!')) // eslint-disable-line
  .catch((error) => console.error('RabbitMQ Error', error)); // eslint-disable-line


app.all('/', (req, res) => {
  res.send('');
});

expressCore.forEach((middleware) => app.use(middleware));

app.use('/api/v1/doc', doc.swaggerUI.serve, doc.swaggerUI.setup(doc.swaggerDocument));
app.use('/api/v1/', router);
app.use(errorHandling);

app.listen(
  port,
  () => {
    console.log(`Application run at http://localhost:${port}`);
    console.log(`Api documentation: http://localhost:${port}/api/v1/doc`);
  },
);
