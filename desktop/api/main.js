import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import https from 'https';
import fs from 'fs';

import setup from './routes/setup.js';
import auth from './routes/auth.js';
import content from './routes/content.js';
import vault from './routes/vault.js';
import { dbCheck } from './db/manager.js';
import path from 'path';
import { app } from 'electron';

const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'Data', 'box.db');

class DatabaseAPI {
    constructor() {
        this.port = process.env.PORT || 50010;
        this.app = express();
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        this.app.use('/setup', setup);
        this.app.use(auth);
        this.app.use('/content', content);
        this.app.use('/vault', vault);

        this.app.use((req, res, next) => {
            res.status(404).json({ error: 'Not found' });
        });
    }
    start() {
        return new Promise((resolve, reject) => {
            dbCheck();
            this.server = https.createServer({
                cert: fs.readFileSync('./api/cert.pem'),
                key: fs.readFileSync('./api/key.pem')
              },this.app).listen(this.port, function(){
                console.log(`Database API listening on port ${this.port}`);
                resolve();
             });
        });
    }
    stop() {
        return new Promise((resolve, reject) => {
            if (this.server) {
                this.server.close(() => {
                    console.log(`Database API stopped`);
                    resolve();
                });
            } else {
                reject('Server is not running');
            }
        });
    }
}
export { dbPath };
export default DatabaseAPI;