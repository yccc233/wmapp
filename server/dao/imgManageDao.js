import DATABASE from "../common/DATABASE.js";
import { getMoment, getRandomId } from "../common/utils.js";

const uploadFile = async (userId, base64) => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getDatabase();
        const imgId = getRandomId(20)
        const sql = `insert into tbl_imgs(img_id, img_base64, user_id, insert_time) VALUES (?,?,?,?)`;
        db.run(sql, [imgId, base64, userId, getMoment()], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(imgId);
            }
        });
    });
};

const downloadFile = async (imgId) => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getDatabase();
        const sql = `select * from tbl_imgs where img_id=?`;
        db.all(sql, [imgId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

export default {
    uploadFile,
    downloadFile
}