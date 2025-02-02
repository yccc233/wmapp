import topViewManageDao from "../dao/topViewManageDao.js";


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

const getClassAvgScoreInMonth = async (classId, month) => {
    const labels = await topViewManageDao.getLabels();
    const labelCount = labels.length;
    if (classId) {
        const persons = await topViewManageDao.getPersonsFromClassId(classId, month);
        const dedScores = await topViewManageDao.getDedScoresByPersonIds(persons.map(p => p.person_id), month);

    } else {

    }
};


export default {
    getAllCollectedGroups,
    getClassAvgScoreInMonth,
}
