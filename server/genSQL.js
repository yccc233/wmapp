// // 常见姓氏数组
// const surnames = [
//     '赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈',
//     '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许'
// ];
//
// // 常见名字数组
// const names = [
//     '伟', '芳', '娜', '敏', '静', '强', '磊', '军', '洋', '勇',
//     '艳', '杰', '娟', '秀', '霞', '婷', '萍', '慧', '琳', '桂'
// ];
//
// // 生成随机姓名的函数
// function generateRandomName() {
//     const surname = surnames[Math.floor(Math.random() * surnames.length)];
//     const name = names[Math.floor(Math.random() * names.length)];
//     return surname + name;
// }
//
// // 关联的班 id 数组
// const relatedClassIds = [2001, 2002, 2003];
//
// // 生成 100 条 insert 语句
// let insertStatements = '';
// for (let i = 0; i < 100; i++) {
//     const relatedClassId = relatedClassIds[Math.floor(Math.random() * relatedClassIds.length)];
//     const personName = generateRandomName();
//     insertStatements += `INSERT INTO "main"."tbl_topview_persons" ("related_class_id", "person_id", "person_name", "off_time", "insert_time") VALUES (${relatedClassId}, NULL, '${personName}', NULL, CURRENT_TIMESTAMP);\n`;
// }
//
// console.log(insertStatements);










function generateTestData() {
    const data = [];
    const usedKeys = new Set();

    // 获取近三个月的月份
    const now = new Date();
    const months = [];
    for (let i = 0; i < 3; i++) {
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        months.push(`${year}-${month}`);
        now.setMonth(now.getMonth() - 1);
    }

    while (data.length < 1000) {
        const deduct_month = months[Math.floor(Math.random() * months.length)];
        const person_id = Math.floor(Math.random() * 100) + 10001;
        const label_id = Math.floor(Math.random() * 7) + 3001;
        const ded_score = Math.floor(Math.random() * 20) + 1;
        const remark = null;

        const key = `${deduct_month}-${person_id}-${label_id}`;
        if (!usedKeys.has(key)) {
            usedKeys.add(key);
            data.push([deduct_month, person_id, label_id, ded_score, remark]);
        }
    }

    return data;
}

const testData = generateTestData();
const insertStatements = testData.map(([deduct_month, person_id, label_id, ded_score, remark]) => {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    const remarkValue = remark === null ? 'NULL' : `'${remark}'`;
    return `INSERT INTO "main"."tbl_topview_scores_deduct" ("deduct_month", "person_id", "label_id", "ded_score", "remark", "update_time", "insert_time") VALUES ('${deduct_month}', ${person_id}, ${label_id}, ${ded_score}, ${remarkValue}, '${timestamp}', '${timestamp}');`;
});

// 输出生成的 SQL 语句
insertStatements.forEach(statement => console.log(statement));