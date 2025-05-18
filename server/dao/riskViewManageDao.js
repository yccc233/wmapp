import DATABASE from "../common/DATABASE.js";

const getUserViewPortals = async (userId) => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getWMAPPDatabase();
        const sql = `select * from tbl_portal_manage where user_id = ? and portal_status = 1`;
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

export default {
    getUserViewPortals
}