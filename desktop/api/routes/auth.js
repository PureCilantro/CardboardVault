import bcrypt from "bcrypt";

import { openDB, readKey } from "./encryption/encrypt.js";

const authMiddleware = async (req, res, next) => {
    const password = req.headers.password;
    if (password) {
        const db = openDB(await readKey());
        const hash = db.prepare("SELECT name FROM tape").all();
        db.close();
        if (await bcrypt.compare(password, hash[0].name)) {
            next();
        } else return res.status(401).json({ code: 401, message: "Unauthorized" });
    } else return res.status(400).json({ code: 400, message: "Bad request" });
};
export default authMiddleware;