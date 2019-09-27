import express from 'express';
import fs from 'fs';
import morgan from 'morgan';
import path from 'path';

const app = express();

// @ts-ignore
const port: number = +process.env.PORT || 3000;

app.set('port', port);

// set midllewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set the log file.

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, './logs/access.log'),
  { flags: 'a' }
);
console.log(__dirname);

// register morgan to be my logger.
app.use(morgan('combined', { stream: accessLogStream }));

app.get('/', (req, res) => {
  res.send('Hello World');
});

export default app;
