import express from 'express';

import expressCore from './core/express';
import router from './core/router';

import errorHandling from './middlewares/errorHandling';
import connectMongoose from './core/mongoose';


const port = process.env.PORT || 3000;
const app = express();
connectMongoose();

app.all('/', (req, res) => {
  res.send('');
});

expressCore.forEach((middleware) => app.use(middleware));

app.use('/api/v1/', router);
app.use(errorHandling);

app.listen(
  port,
  () => {
    // eslint-disable-next-line
    console.log(`Application run at http://localhost:${port}`);
  },
);
