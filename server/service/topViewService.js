import topViewManageDao from "../dao/topViewManageDao.js";
import { formatNumber } from "../common/utils.js";
import dayjs from "dayjs";
import topViewUtils from "../utils/topViewUtils.js";


const getAllMyCollectedGroups = async (userId) => {
    let allGroups = await topViewManageDao.getAllGroups();
    const groupManagerMapList = await topViewManageDao.getGroupsManagerMap(userId);
    let groupManagerMap = null;
    if (groupManagerMapList?.length > 0) {
        groupManagerMap = groupManagerMapList[0].group_ids;
    }
    // 过滤掉不是我的，null时保持全部
    if (groupManagerMap) {
        groupManagerMap = JSON.parse(groupManagerMap);
        allGroups = allGroups.filter(group => groupManagerMap.includes(group.group_id));
    }
    // 拼接成树形结构
    allGroups.forEach((group) => {
        if (group.child_group_ids) {
            group.child_group_ids = JSON.parse(group.child_group_ids);
            if (groupManagerMap) {
                group.child_group_ids = group.child_group_ids.filter(groupId => groupManagerMap.includes(groupId));
            }
            group.child_group_ids.forEach((childId, index) => {
                const findGroup = allGroups.find(g => g.group_id === childId);
                if (findGroup) {
                    findGroup.isLeaf = true;
                    group.child_group_ids[index] = findGroup;
                }
            });
        }
    });
    // 清洗结构
    allGroups.forEach((group) => {
        group.children = group.child_group_ids;
        delete group.child_group_ids;
        delete group.visible;
        delete group.insert_time;
    });
    allGroups = allGroups.filter((group) => !group.isLeaf);
    return allGroups;
};


const getLabelNames = async () => {
    const labels = await topViewManageDao.getLabelInfoByLabelIdList();
    return labels.sort((a, b) => a.display_order - b.display_order).map(label => ({
        label_name: label.label_name,
        label_name_en: label.label_name_en,
        label_id: label.label_id
    }));
};

/**
 * @param groupId   如果groupId为-1表示全部的分数
 * @param month
 */
const getGroupAvgScore = async (groupId, month) => {
    const labels = await topViewManageDao.getLabelInfoByLabelIdList();
    let classList;
    if (groupId === -1) {
        classList = await topViewManageDao.getAllClassList();
    } else {
        classList = await topViewManageDao.getClassListByGroupId(groupId);
    }
    const allGroupList = await topViewManageDao.getAllGroups();
    if (classList.length > 0) {
        const persons = await topViewManageDao.getPersonsFromClassIdList(classList.map(cl => cl.class_id), month);
        const dedScores = await topViewManageDao.getDedScoresByPersonIds(persons.map(p => p.person_id), month);

        persons.forEach(person => {
            const personDedScores = dedScores.filter((d) => d.person_id === person.person_id);
            let totalScore = 0;
            person.items = {};
            labels.forEach((label) => {
                const personInLabelDedScore = personDedScores.find(d => d.label_id === label.label_id);
                const score = 100 - (personInLabelDedScore ? personInLabelDedScore.ded_score : 0);
                const remark = personInLabelDedScore?.remark || "";
                person["items"][label.label_name_en] = { score, remark };
                totalScore += score;
            });
            person.total_score = totalScore;
            person.avg_score = formatNumber(totalScore / labels.length);
            person.class_id = person.related_class_id;
            const personClass = classList.find(cl => cl.class_id === person.class_id);
            let related_group_id = null;
            // 获取组信息
            if (personClass) {
                person.class_name = personClass.class_name;
                related_group_id = personClass.related_group_id;
            }
            // 获取班信息
            const personGroup = allGroupList.find(g => g.group_id === related_group_id);
            if (personGroup) {
                person.group_id = personGroup.group_id;
                person.group_name = personGroup.group_name;
            }
            delete person.related_class_id;
            delete person.insert_time;
        });
        return persons;
    } else {
        return [];
    }
};

const getGroupAvgScoreInMonthRange = async (groupId, startMonth, endMonth) => {
    const months = topViewUtils.getMonthRange(startMonth, endMonth);
    let lastPersons = {};
    for (let i = 0; i < months.length; i++) {
        const month = months[i];
        const persons = await getGroupAvgScore(groupId, month);
        persons.forEach(personItem => {
            const person_id = personItem.person_id;
            if (lastPersons[person_id]) {
                lastPersons[person_id]["months_state"][month] = { avg: personItem.avg_score, total: personItem.total_score };
            } else {
                lastPersons[person_id] = {
                    ...personItem,
                    months_state: {
                        [month]: { avg: personItem.avg_score, total: personItem.total_score }
                    }
                };
            }
        });
    }
    lastPersons = Object.values(lastPersons);
    lastPersons.forEach(person => {
        person.total_score = Object.values(person.months_state).reduce((total, item) => total + item.total, 0);
        person.avg_score = Object.values(person.months_state).reduce((total, item) => total + item.avg, 0) / (months.length || 1);
    });
    return lastPersons;
};

const getClassPersonsAvgScore = async (classId, month) => {
    const labels = await topViewManageDao.getLabelInfoByLabelIdList();
    const classInfo = await topViewManageDao.getClassByClassId(classId);
    const persons = await topViewManageDao.getPersonsFromClassIdList([classId], month);
    const dedScores = await topViewManageDao.getDedScoresByPersonIds(persons.map(p => p.person_id), month);
    persons.forEach(person => {
        const personDedScores = dedScores.filter((d) => d.person_id === person.person_id);
        let totalScore = 0;
        person.items = {};
        labels.forEach((label) => {
            const personInLabelDedScore = personDedScores.find(d => d.label_id === label.label_id);
            const score = 100 - (personInLabelDedScore ? personInLabelDedScore.ded_score : 0);
            const remark = personInLabelDedScore?.remark || "";
            person["items"][label.label_name_en] = { score, remark };
            totalScore += score;
        });
        person.total_score = totalScore;
        person.avg_score = formatNumber(totalScore / labels.length);
        person.class_id = person.related_class_id;
        person.class_name = classInfo?.class_name;
        delete person.related_class_id;
        delete person.insert_time;
    });
    // 排序
    persons.sort((a, b) => a.person_name.localeCompare(b.person_name));
    return persons;
};


const getClassAvgScoreInMonth = async (classIdList, month) => {
    const classMap = {};
    for (const classId of classIdList) {
        classMap[classId] = await getClassPersonsAvgScore(classId, month);
    }
    return classMap;
};


const getClassAvgScoreInMonthRange = async (classIdList, startMonth, endMonth) => {
    const classMap = {};
    for (const classId of classIdList) {
        let classScoreTemp = {};
        const months = topViewUtils.getMonthRange(startMonth, endMonth);
        for (let i = 0; i < months.length; i++) {
            const month = months[i];
            const monthTargetScorePersons = await getClassPersonsAvgScore(classId, month);
            monthTargetScorePersons.forEach(monthTargetScoreItem => {
                const person_id = monthTargetScoreItem.person_id;
                if (classScoreTemp[person_id]) {
                    classScoreTemp[person_id]["months_state"][month] = { avg: monthTargetScoreItem.avg_score, total: monthTargetScoreItem.total_score };
                } else {
                    classScoreTemp[person_id] = {
                        ...monthTargetScoreItem,
                        months_state: {
                            [month]: { avg: monthTargetScoreItem.avg_score, total: monthTargetScoreItem.total_score }
                        }
                    };
                }
            });
        }
        classScoreTemp = Object.values(classScoreTemp);
        classScoreTemp.forEach(person => {
            person.total_score = Object.values(person.months_state).reduce((total, item) => total + item.total, 0);
            person.avg_score = Object.values(person.months_state).reduce((total, item) => total + item.avg, 0) / (months.length || 1);
        });
        classMap[classId] = classScoreTemp;
    }
    return classMap;
};

/**
 * @param groupId       如果groupId为-1表示全部的分数
 */
const getClassesByGroupId = async (groupId) => {
    let classList;
    if (groupId === -1) {
        classList = await topViewManageDao.getAllClassList();
    } else {
        classList = await topViewManageDao.getClassListByGroupId(groupId);
    }
    return classList.map(cl => ({
        class_id: cl.class_id,
        class_name: cl.class_name
    }));
};

const getGroupInfoByGroupId = async (groupId) => {
    // 暂时不做扩展
    const groupInfo = await topViewManageDao.getGroupInfoByGroupId(groupId);
    return groupInfo;
};

const getClassInfoByClassId = async (classId) => {
    const classInfo = await topViewManageDao.getClassByClassId(classId);
    const r_group_id = classInfo.related_group_id;
    const groupInfo = await getGroupInfoByGroupId(r_group_id);
    classInfo.related_group = groupInfo;
    return classInfo;
};

const chartsForClass = async (classIdList, month) => {
    const classMap = await getClassAvgScoreInMonth(classIdList, month);
    let classData = [];
    const allGroupList = await topViewManageDao.getAllGroups();
    for (const classId of classIdList) {
        const classInfo = await topViewManageDao.getClassByClassId(classId);
        const classPersons = classMap[classId];
        classInfo.persons_count = classPersons.length;
        classInfo.avg_score = formatNumber(classPersons.reduce((acc, curr) => acc + curr.avg_score, 0) / classPersons.length, 2);
        classInfo.min_score = classPersons.reduce((score, person) => score < person.avg_score ? score : person.avg_score, 100);
        classInfo.max_score = classPersons.reduce((score, person) => score > person.avg_score ? score : person.avg_score, 0);
        classInfo.group_name = allGroupList.find(g => g.group_id === classInfo.related_group_id)?.group_name;
        delete classInfo.insert_time;
        delete classInfo.related_group_id;
        delete classInfo.visible;
        classData.push(classInfo);
    }
    classData = classData.filter(c => c.persons_count > 0);
    classData.sort((a, b) => b.avg_score - a.avg_score);
    return classData;
};

const chartsForHistory = async (classIdList, startMonth, length) => {
    const classData = [];

    for (const classId of classIdList) {
        const classInfo = await getClassInfoByClassId(classId);
        const appendObj = {
            class_id: classInfo.class_id,
            class_name: classInfo.class_name,
            group_name: classInfo.related_group?.group_name || "",
            data: []
        };
        appendObj.label_name = appendObj.group_name + "/" + appendObj.class_name;
        classData.push(appendObj);
    }
    const monthList = Array.from({ length }).map((_, ind) => dayjs(startMonth).subtract(ind, "months").format("YYYY-MM")).reverse();
    let minScore = 100, maxScore = 0;
    for (const month of monthList) {
        const classMap = await getClassAvgScoreInMonth(classIdList, month);

        for (const classInfo of classData) {
            const persons = classMap[classInfo.class_id];
            if (persons?.length > 0) {
                const avg_score = formatNumber(persons.reduce((acc, curr) => acc + curr.avg_score, 0) / persons.length, 2);
                minScore = minScore > avg_score ? avg_score : minScore;
                maxScore = maxScore < avg_score ? avg_score : maxScore;
                classInfo.data.push({
                    month: month,
                    avg_score: avg_score
                });
            } else {
                classInfo.data.push({
                    month: month,
                    avg_score: 0
                });
            }
        }
    }
    return {
        items: classData,
        months: monthList,
        minScore,
        maxScore
    };
};

const chatForDedScore = async (groupId, month) => {
    let classList;
    if (groupId === -1) {
        classList = await topViewManageDao.getAllClassList();
    } else {
        classList = await topViewManageDao.getClassListByGroupId(groupId);
    }
    const personsList = await topViewManageDao.getPersonsFromClassIdList(classList.map(c => c.class_id));
    const personIdList = personsList.map(p => p.person_id);
    const dedScore = await topViewManageDao.getDedScoresByPersonIds(personIdList, month);
    const dedScoreMap = {};
    for (const dedInfo of dedScore) {
        if (dedScoreMap[dedInfo.label_id]) {
            dedScoreMap[dedInfo.label_id] += dedInfo.ded_score;
        } else {
            dedScoreMap[dedInfo.label_id] = dedInfo.ded_score;
        }
    }
    const dedList = [];
    const labelInfos = await topViewManageDao.getLabelInfoByLabelIdList(Object.keys(dedScoreMap));
    for (const dedScoreLabelId of Object.keys(dedScoreMap)) {
        const label = labelInfos.find(l => l.label_id === Number(dedScoreLabelId));
        if (label) {
            label.dedScore = dedScoreMap[dedScoreLabelId];
            dedList.push(label);
        }
    }
    dedList.sort((a, b) => b.dedScore - a.dedScore);
    return dedList;
};

const updateScoreInPersonMonth = async (month, personId, labelId, scoreDelta = 0) => {
    try {
        const existRecord = await topViewManageDao.getDeltaRecord(month, personId, labelId);
        let count = 0;
        // 存在一条记录
        if (existRecord) {
            // 注意表中的ded是扣的分数，在delta中表现为相反数
            existRecord["ded_score"] -= scoreDelta;
            count = await topViewManageDao.updateDeltaScore(month, personId, labelId, existRecord["ded_score"]);
        } else {
            // 注意表中的ded是扣的分数，在delta中表现为相反数
            count = await topViewManageDao.insertDeltaScore(month, personId, labelId, -scoreDelta);
        }
        return count > 0 ? "success" : "fail";
    } catch (e) {
        console.error(e);
        return "fail";
    }
};

const updateRemarkInPersonMonth = async (month, personId, labelId, remark) => {
    try {
        const existRecord = await topViewManageDao.getDeltaRecord(month, personId, labelId);
        let count = 0;
        // 存在一条记录
        if (existRecord) {
            count = await topViewManageDao.updateDeltaScoreRemark(month, personId, labelId, remark);
        } else {
            count = await topViewManageDao.insertDeltaScoreRemark(month, personId, labelId, remark);
        }
        return count > 0 ? "success" : "fail";
    } catch (e) {
        console.error(e);
        return "fail";
    }
};

const getPersonsInClass = async (classId) => {
    return await topViewManageDao.getPersonsFromClassIdList([classId]);
};

const addPersonInClass = async (classId, personName, flagInfo) => {
    const counts = await topViewManageDao.addPersonInClass(classId, personName, flagInfo);
    return counts > 0 ? "success" : "fail";
};

const deletePersonInClass = async (personId) => {
    const counts = await topViewManageDao.deletePersonInClass(personId);
    return counts > 0 ? "success" : "fail";
};

const updatePersonInClass = async (personId, personName, flagInfo) => {
    const counts = await topViewManageDao.updatePersonInClass(personId, personName, flagInfo);
    return counts > 0 ? "success" : "fail";
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getAllMyCollectedGroups,
    getGroupAvgScore,
    getGroupAvgScoreInMonthRange,
    getGroupInfoByGroupId,
    getClassInfoByClassId,
    getClassAvgScoreInMonth,
    getClassAvgScoreInMonthRange,
    getLabelNames,
    getClassesByGroupId,
    chartsForClass,
    chartsForHistory,
    updateScoreInPersonMonth,
    updateRemarkInPersonMonth,
    chatForDedScore,
    getPersonsInClass,
    addPersonInClass,
    deletePersonInClass,
    updatePersonInClass
};
