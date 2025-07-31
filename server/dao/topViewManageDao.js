import DATABASE from "../common/DATABASE.js";
import { getMoment } from "../common/utils.js";


const getAllGroups = async () => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getWMAPPDatabase();
        const sql = `
            select *
            from tbl_topview_groups_def
            where visible = 1
        `;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const getAllPersons = async () => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getWMAPPDatabase();
        const sql = `
            select *
            from tbl_topview_persons
        `;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const getGroupsManagerMap = async (userId) => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getWMAPPDatabase();
        const sql = `
            select *
            from tbl_topview_group_manager_map
            where user_id = ?
        `;
        db.all(sql, [userId], (err, rows) => {
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
        const db = DATABASE.getWMAPPDatabase();
        const sql = `
            select group_id, group_name, child_group_ids, display_order
            from tbl_topview_groups_def
            where visible = 1
              and group_id = ?
        `;
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
        const db = DATABASE.getWMAPPDatabase();
        const sql = `
            select *
            from tbl_topview_classes_def
            where visible = 1
              and related_group_id = ?
        `;
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
        const db = DATABASE.getWMAPPDatabase();
        const sql = `
            select related_group_id, class_id, class_name
            from tbl_topview_classes_def
            where visible = 1
              and class_id = ?
        `;
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
        const db = DATABASE.getWMAPPDatabase();
        const sql = `
            select *
            from tbl_topview_classes_def
            where visible = 1
        `;
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
        const db = DATABASE.getWMAPPDatabase();
        const sql = `
            select *
            from tbl_topview_persons
            where related_class_id in (${classIdList.join(",")})
        `;
        // and (off_time is null ${month ? `or off_time >= '${month}'` : ""})
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
        const db = DATABASE.getWMAPPDatabase();
        const sql = `select label_id, label_name, label_name_en, display_order
                     from tbl_topview_labels_def
                     where in_use = 1 ${labelIdList ? `and label_id in (${labelIdList.join(",")})` : ""}`;
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
        const db = DATABASE.getWMAPPDatabase();
        const sql = `select *
                     from tbl_topview_scores_deduct
                     where deduct_month = ?
                       and person_id in (${personIdList.join(", ")})`;
        db.all(sql, [month], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const getDeltaRecord = async (month, personId, labelId) => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getWMAPPDatabase();
        const sql = `select *
                     from tbl_topview_scores_deduct
                     where deduct_month = ?
                       and person_id = ?
                       and label_id = ?`;
        db.all(sql, [month, personId, labelId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows[0] || null);
            }
        });
    });
};

const updateDeltaScore = async (month, personId, labelId, deltaScore) => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getWMAPPDatabase();
        const sql = `update tbl_topview_scores_deduct
                     set ded_score   = ?,
                         update_time = ?
                     where deduct_month = ?
                       and person_id = ?
                       and label_id = ?`;
        db.run(sql, [deltaScore, getMoment(), month, personId, labelId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

const insertDeltaScore = async (month, personId, labelId, deltaScore) => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getWMAPPDatabase();
        const sql = `insert into tbl_topview_scores_deduct ("deduct_month",
                                                            "person_id",
                                                            "label_id",
                                                            "ded_score")
                     values (?, ?, ?, ?)`;
        db.run(sql, [month, personId, labelId, deltaScore], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

const updateDeltaScoreRemark = async (month, personId, labelId, remark) => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getWMAPPDatabase();
        const sql = `update tbl_topview_scores_deduct
                     set remark      = ?,
                         update_time = ?
                     where deduct_month = ?
                       and person_id = ?
                       and label_id = ?`;
        db.run(sql, [remark, getMoment(), month, personId, labelId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

const insertDeltaScoreRemark = async (month, personId, labelId, remark) => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getWMAPPDatabase();
        const sql = `insert into tbl_topview_scores_deduct ("deduct_month",
                                                            "person_id",
                                                            "label_id",
                                                            "ded_score",
                                                            "remark")
                     values (?, ?, ?, ?, ?)`;
        db.run(sql, [month, personId, labelId, 0, remark], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

const addPersonInClass = async (classId, personName, flagInfo) => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getWMAPPDatabase();
        const sql = `insert into tbl_topview_persons ("related_class_id",
                                                      "person_name",
                                                      "flag_info",
                                                      "insert_time")
                     values (?, ?, ?, ?)`;
        db.run(sql, [
            classId,
            personName,
            flagInfo,
            getMoment()
        ], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

const deletePersonInClass = async (personId) => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getWMAPPDatabase();
        const sql = `delete
                     from tbl_topview_persons
                     where person_id = ?`;
        db.run(sql, [personId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

const updatePersonInClass = async (personId, personName, flagInfo) => {
    return new Promise((resolve, reject) => {
        const db = DATABASE.getWMAPPDatabase();
        const sql = `update tbl_topview_persons
                     set person_name = ?,
                         flag_info   = ?,
                         update_time = ?
                     where person_id = ?`;
        db.run(sql, [personName, flagInfo, getMoment(), personId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

const deleteScoreFromMonthAndLabel = async (month, labelIds) => {
    const placeholders = labelIds.map(() => "?").join(",");
    return new Promise((resolve, reject) => {
        const db = DATABASE.getWMAPPDatabase();
        const sql = `
            delete
            from tbl_topview_scores_deduct
            where deduct_month = ?
              and label_id in (${placeholders})
        `;
        db.run(sql, [month, ...labelIds], function (err) {
            console.log(err, this);
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getAllGroups,
    getAllPersons,
    getGroupsManagerMap,
    getGroupInfoByGroupId,
    getAllClassList,
    getClassListByGroupId,
    getClassByClassId,
    getPersonsFromClassIdList,
    getDedScoresByPersonIds,
    getDeltaRecord,
    getLabelInfoByLabelIdList,
    updateDeltaScore,
    insertDeltaScore,
    updateDeltaScoreRemark,
    insertDeltaScoreRemark,
    addPersonInClass,
    deletePersonInClass,
    updatePersonInClass,
    deleteScoreFromMonthAndLabel
};