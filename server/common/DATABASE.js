import sqlite3 from "sqlite3";

const sqlite = sqlite3.verbose();

let db = null;

// 初始化数据库连接
function initWMAPPDatabase(path = "./database/wmapp.db") {
    if (!db) {
        db = new sqlite.Database(path, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`init the SQLite database (path:${path}) [success]!`);
            }
        });
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getWMAPPDatabase: () => {
        if (!db) {
            initWMAPPDatabase();
        }
        return db;
    },
    initWMAPPDatabase
};