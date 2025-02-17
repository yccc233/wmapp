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

const getGroupInfoByGroupId = async (groupId) => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getDatabase();
        const sql = `select group_id, group_name, child_group_ids, display_order from tbl_topview_groups_def where visible = 1 and group_id = ?`;
        db.all(sql, [groupId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows[0] || null);
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

const getClassByClassId = async (classId) => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getDatabase();
        const sql = `select related_group_id, class_id, class_name from tbl_topview_classes_def where visible = 1 and class_id = ?`;
        db.all(sql, [classId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows[0] || null);
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

const getLabelInfoByLabelIdList = async (labelIdList) => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getDatabase();
        const sql = `select label_id, label_name, label_name_en,display_order from tbl_topview_labels_def where in_use = 1 ${labelIdList ? `and label_id in (${labelIdList.join(",")})`  : ""}`;
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
    getGroupInfoByGroupId,
    getAllClassList,
    getClassListByGroupId,
    getClassByClassId,
    getPersonsFromClassIdList,
    getDedScoresByPersonIds,
    getLabelInfoByLabelIdList
}