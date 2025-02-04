import DATABASE from "../common/DATABASE.js";

const getAllGroups = async () => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getDatabase();
        const sql = `select * from tbl_topview_groups_def where visible = 1`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const getClassListByGroupId = async (groupId) => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getDatabase();
        const sql = `select * from tbl_topview_classes_def where visible = 1 and related_group_id = ?`;
        db.all(sql, [groupId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const getAllClassList = async () => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getDatabase();
        const sql = `select * from tbl_topview_classes_def where visible = 1`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const getPersonsFromClassIdList = async (classIdList, month) => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getDatabase();
        const sql = `
                  select * from tbl_topview_persons 
                  where related_class_id in (${classIdList.join(",")}) 
                  and (off_time is null ${month ? `or off_time >= '${month}'
        ` : ""})`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const getLabels = async () => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getDatabase();
        const sql = `select * from tbl_topview_labels_def where in_use = 1`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const getDedScoresByPersonIds = async (personIdList, month) => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getDatabase();
        const sql = `select * from tbl_topview_scores_deduct where deduct_month = ? and person_id in (${personIdList.join(", ")})`;
        db.all(sql, [month], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

export default {
    getAllGroups,
    getAllClassList,
    getClassListByGroupId,
    getPersonsFromClassIdList,
    getDedScoresByPersonIds,
    getLabels
}