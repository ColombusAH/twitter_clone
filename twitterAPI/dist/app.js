"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import fs from 'fs';
// import morgan from 'morgan';
// import path from 'path';
const app = express_1.default();
// @ts-ignore
const port = +process.env.PORT || 3000;
app.set('port', port);
// set midllewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// set the log file.
// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, './logs/access.log'),
//   { flags: 'a' }
// );
console.log(__dirname);
// register morgan to be my logger.
// app.use(morgan('combined', { stream: accessLogStream }));
app.get('/', (req, res) => {
    res.send('Hello World');
});
exports.default = app;
//# sourceMappingURL=app.js.map