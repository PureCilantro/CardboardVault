import express from 'express';
const setup = express.Router();

import bcrypt from 'bcrypt';

import { openDB, readKey } from './encryption/encrypt.js';

setup.post('/setPassword', async (req, res) => {
    const password = req.body.password;
    const db = openDB( await readKey() );
    const exists = db.prepare("SELECT name FROM tape").all();
    if (exists.length == 1) {
        db.close();
        return res.status(400).json({ code: 400, message: "Password already set" });
    } else {
        const hash = await bcrypt.hash(password, 14);
        db.prepare("INSERT INTO tape VALUES (?)").run(hash);
        db.close();
        return res.status(200).json({ code: 200, message: "Password set successfully" });
    }
});

export default setup;