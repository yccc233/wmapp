import topViewManageDao from "../dao/topViewManageDao.js";
import {formatNumber} from "../common/utils.js";


const getAllCollectedGroups = async () => {
    let allGroups = await topViewManageDao.getAllGroups();
    // 拼接成树形结构
    allGroups.forEach((group) => {
        if (group.child_group_ids) {
            group.child_group_ids = JSON.parse(group.child_group_ids);
            group.child_group_ids.forEach((childId, index) => {
                const findGroup = allGroups.find(g => g.group_id === childId);
                findGroup.isLeaf = true;
                group.child_group_ids[index] = findGroup;
            });
        }
    });
    // 清洗结构
    allGroups.forEach((group) => {
        group.children = group.child_group_ids;
        delete group.child_group_ids;
        delete group.visible;
        delete group.insert_time;
    })
    allGroups = allGroups.filter((group) => !group.isLeaf);
    return allGroups;
};


const getLabelNames = async () => {
    const labels = await topViewManageDao.getLabels();
    return labels.sort((a, b) => a.display_order - b.display_order).map(label => ({
        label_name: label.label_name,
        label_name_en: label.label_name_en,
        label_id: label.label_id,
    }));
};

/**
 * @param groupId   如果groupId为-1表示全部的分数
 * @param month
 */
const getGroupAvgScore = async (groupId, month) => {
    const labels = await topViewManageDao.getLabels();
    let classList;
    if (groupId === -1) {
        classList = await topViewManageDao.getAllClassList();
    } else {
        classList = await topViewManageDao.getClassListByGroupId(groupId);
    }
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
                person['items'][label.label_name_en] = {score, remark};
                totalScore += score;
            });
            person.total_score = totalScore;
            person.avg_score = formatNumber(totalScore / labels.length);
            person.class_id = person.related_class_id;
            person.class_name = classList.find(cl => cl.class_id === person.class_id)?.class_name;
            delete person.related_class_id;
            delete person.insert_time;
        });
        return persons;
    } else {
        return [];
    }
};

const getClassAvgScore = async (classId, month) => {
    const labels = await topViewManageDao.getLabels();
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
            person['items'][label.label_name_en] = {score, remark};
            totalScore += score;
        });
        person.total_score = totalScore;
        person.avg_score = formatNumber(totalScore / labels.length);
        person.class_id = person.related_class_id;
        person.class_name = classInfo?.class_name;
        delete person.related_class_id;
        delete person.insert_time;
    });
    return persons;
};


const getClassAvgScoreInMonth = async (classIdList, month) => {
    const classMap = {};
    for (const classId of classIdList) {
        classMap[classId] = await getClassAvgScore(classId, month);
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

const chartsForClass = async (classIdList, month) => {
    const classMap = await getClassAvgScoreInMonth(classIdList, month);
    const classData = [];

    for (const classId of classIdList) {
        const classInfo = await topViewManageDao.getClassByClassId(classId);
        const classPersons = classMap[classId];
        delete classInfo.insert_time;
        delete classInfo.related_group_id;
        delete classInfo.visible;
        classInfo.persons_count = classPersons.length;
        classInfo.avg_score = formatNumber(classPersons.reduce((acc, curr) => acc + curr.avg_score, 0) / classPersons.length, 2);
        classInfo.min_score = classPersons.reduce((score, person) => score < person.avg_score ? score : person.avg_score, 100);
        classInfo.max_score = classPersons.reduce((score, person) => score > person.avg_score ? score : person.avg_score, 0);
        classData.push(classInfo);
    }

    return classData;
};

const chartsForHistory = async (classIdList, month) => {
    const classData = [];

    const classMap = await getClassAvgScoreInMonth(classIdList, month);




    return classData;
};


export default {
    getAllCollectedGroups,
    getGroupAvgScore,
    getClassAvgScoreInMonth,
    getLabelNames,
    getClassesByGroupId,
    chartsForClass,
    chartsForHistory
}
