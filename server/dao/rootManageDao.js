import DATABASE from "../common/DATABASE.js";

const getAllUserListExceptRoot = async () => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getDatabase();
        const sql = `select * from tbl_user_manage where username!='root'`;
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
    getAllUserListExceptRoot
}