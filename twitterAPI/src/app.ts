import express from 'express';
import fs from 'fs';
import morgan from 'morgan';
import path from 'path';
import { initializePassport } from './config/passport';
import mongoose from 'mongoose';
import { config } from './config';
import router from './routes';
import helmet from 'helmet';

const app = express();

// @ts-ignore
const port: number = +process.env.PORT || 3000;

app.set('port', port);

// set midllewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// set the log file.

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, './logs/access.log'),
  { flags: 'a' }
);

// register morgan to be my logger.
app.use(morgan('combined', { stream: accessLogStream }));

mongoose.connect(
  config.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('connected to DB')
);

initializePassport();

app.use(router);

app.get('/', (req, res) => {
  res.send('Hello World');
});

export default app;
