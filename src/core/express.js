import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import config from '../config';


export default [
  cors(),
  bodyParser.json(),
  morgan(config.morgan)
];
