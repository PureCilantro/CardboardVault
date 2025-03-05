import express from 'express';
const vault = express.Router();

import { openDB, readKey, swapKey, decodeCipher, cipherPlain } from './encryption/encrypt.js';

vault.post('/updateKey', async (req, res) => {
    const { password } = req.headers;
    const db = openDB( await readKey() );
    await swapKey(db, password);
    db.close();
    return res.status(200).json({ code: 200, message: "Key updated successfully" });
});

vault.post('/saveGood', async (req, res) => {
    const { password } = req.headers;
    const { name, storage } = req.body;

    const encrypted = await cipherPlain(password, storage);
    
    const db = openDB( await readKey() );
    db.prepare("INSERT INTO goods (name, code) VALUES (?, ?)").run(name, encrypted);
    db.close();
    
    return res.status(201).json({ code: 201, message: "Good saved successfully" });
});

vault.get('/getGood', async (req, res) => {
    const { password, name } = req.headers;

    const db = openDB( await readKey() );
    const encrypted = db.prepare("SELECT code FROM goods WHERE name = ?").get(name);
    db.close();

    const decrypted = await decodeCipher(password, await readKey(), encrypted.code);
    return res.status(200).json({ code: 200, message: decrypted });
});

vault.post('/savePeanut', async (req, res) => {
    const { password } = req.headers;
    const { size, texture, color } = req.body;

    const encrypted = await cipherPlain(password, color);

    const db = openDB( await readKey() );
    db.prepare("INSERT INTO peanuts VALUES (?, ?, ?)").run(size, texture, encrypted);
    db.close();

    return res.status(201).json({ code: 201, message: "Peanut saved successfully" });
});

vault.get('/getPeanut', async (req, res) => {
    const { password, size } = req.headers;
    
    const db = openDB( await readKey() );
    const encrypted = db.prepare("SELECT color FROM peanuts WHERE size = ?").get(size);
    db.close();

    const decrypted = await decodeCipher(password, await readKey(), encrypted.texture);
    return res.status(200).json({ code: 200, message: decrypted });
});

export default vault;