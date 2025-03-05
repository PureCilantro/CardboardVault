import express from "express";
const content = express.Router();

import { openDB, readKey } from "./encryption/encrypt.js";

content.get('/goods', async (req, res) => {
    const db = openDB(await readKey());
    const names = db.prepare("SELECT name FROM goods").all();
    db.close();
    return res.status(200).json({ code: 200, message: names });
});

content.get('/peanuts', async (req, res) => {
    const db = openDB(await readKey());
    const names = db.prepare("SELECT size,texture FROM peanuts").all();
    db.close();
    return res.status(200).json({ code: 200, message: names });
});

export default content;