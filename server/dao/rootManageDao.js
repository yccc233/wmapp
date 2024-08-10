import moment from "moment";
import DATABASE from "../common/DATABASE.js";
import { getMoment } from "../common/utils.js";

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
        ], (err) => {
            if (err) {
                reject(err);
            } else {
                const rowCount = db.changes;
                resolve(rowCount);
            }
        });
    });
};


const insertPortal = async (portalConfig) => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getDatabase();
        const sql = `insert into tbl_portal_manage (
                        "user_id",
                        "portal_title",
                        "portal_status",
                        "portal_img",
                        "comment_time",
                        "comment_members",
                        "footer_btn",
                        "events",
                        "insert_time"
                    ) values (
                        ?,?,?,?,?,?,?,?,?
                    )
                    `;
        db.run(sql, [
            portalConfig.user_id,
            portalConfig.portal_title,
            portalConfig.portal_status,
            portalConfig.portal_img,
            portalConfig.comment_time,
            portalConfig.comment_members,
            null,
            portalConfig.events,
            getMoment()
        ], (err) => {
            if (err) {
                reject(err);
            } else {
                const rowCount = db.changes;
                resolve(rowCount);
            }
        });
    });
};


const dropPortal = async (portalId) => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getDatabase();
        const sql = `delete from tbl_portal_manage where portal_id = ?`;
        db.run(sql, [portalId], (err) => {
            if (err) {
                reject(err);
            } else {
                const rowCount = db.changes;
                resolve(rowCount);
            }
        });
    });
};



export default {
    getAllUserListExceptRoot,
    getPortalsByUserId,
    updatePortals,
    insertPortal,
    dropPortal
}