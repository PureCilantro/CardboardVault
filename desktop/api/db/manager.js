import path from 'path';
import fs from 'fs';

import initDB from './init.js';
import { readKey, openDB } from '../routes/encryption/encrypt.js';
import { dbPath } from '../../api/main.js';

const CreateDatabaseDirectory = () => {
    if (!fs.existsSync(path.dirname(dbPath))) {
        fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    }
};

const initDatabase = (db) => {
    db.transaction(() => {
        for (let query of initDB.split(';')) {
            if (query.trim()) {
                db.prepare(query).run();
            }
        }
    })();
};

const dbCheck = async () => {
    CreateDatabaseDirectory();
    let db = openDB( await readKey() );
    console.log(await readKey());
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    if (tables.length == 0) {
        console.log('Initializing database');
        initDatabase(db);
        db.close();
        dbCheck();
    } else if (tables.length == 4) {
        console.log('Database ready');
        db.close();
    }
};

export { dbCheck };