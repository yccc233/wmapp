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


const getPortalsByUserId = async (userId) => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getDatabase();
        const sql = `select * from tbl_portal_manage where user_id = ?`;
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};


const updatePortals = async (portalId, portalConfig) => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getDatabase();
        const sql = `update tbl_portal_manage
                        set portal_title=?,
                        portal_status=?,
                        portal_img=?,
                        comment_time=?,
                        comment_members=?,
                        events=?,
                        update_time=?
                    where 
                        portal_id=?
                    `;
        db.run(sql, [
            portalConfig.portal_title,
            portalConfig.portal_status,
            portalConfig.portal_img,
            portalConfig.comment_time,
            portalConfig.comment_members,
            portalConfig.events,
            portalConfig.update_time,
            portalId
        ], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

export default {
    getAllUserListExceptRoot,
    getPortalsByUserId,
    updatePortals
}