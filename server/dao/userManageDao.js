import DATABASE from "../common/DATABASE.js";

const getUsersByUserName = async (userName) => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getDatabase();
        const sql = `select * from tbl_user_manage where username='${userName}'`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const getAllUserListExceptRoot = async () => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getDatabase();
        const sql = `select * from tbl_user_manage where username != 'root'`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const getUsersById = async (userId) => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getDatabase();
        const sql = `select * from tbl_user_manage where user_id = ${userId}`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const getAppList = async () => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getDatabase();
        const sql = `select * from tbl_apps`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};


export default {
    getUsersByUserName,
    getAllUserListExceptRoot,
    getUsersById,
    getAppList
}