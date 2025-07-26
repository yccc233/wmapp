import express from "express";
import RESPONSE from "../common/RESPONSE.js";
import topViewService from "../service/topViewService.js";
import { getUserIdName } from "../common/utils.js";


const router = express.Router();

router.post("/getAllMyGroups", async function (req, res) {
    const { userId } = getUserIdName(req);
    const groups = await topViewService.getAllMyCollectedGroups(userId);
    RESPONSE.SUCCESS(req, res, groups);
});

router.post("/getLabelNames", async function (req, res) {
    const labelNames = await topViewService.getLabelNames();
    RESPONSE.SUCCESS(req, res, labelNames);
});

router.post("/getClassesByGroupId", async function (req, res) {
    const { groupId } = req.body;
    if (!groupId) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    const classList = await topViewService.getClassesByGroupId(groupId);
    RESPONSE.SUCCESS(req, res, classList);
});

router.post("/getGroupAvgScore", async function (req, res) {
    const { month } = req.body;
    const groupId = Number(req.body.groupId);
    if (!month || !groupId) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    let data = await topViewService.getGroupAvgScore(groupId, month);
    data = data.sort((a, b) => b.avg_score - a.avg_score).map((d, i) => ({
        ...d,
        range: i + 1
    }));
    RESPONSE.SUCCESS(req, res, data);
});

router.post("/getGroupAvgScoreInMonthRange", async function (req, res) {
    const { startMonth, endMonth } = req.body;
    const groupId = Number(req.body.groupId);
    if (!startMonth || !endMonth || !groupId) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    let data = await topViewService.getGroupAvgScoreInMonthRange(groupId, startMonth, endMonth);
    data = data
        .sort((a, b) => {
            if (b.avg_score !== a.avg_score) {
                return b.avg_score - a.avg_score;
            }
            return b.total_score - a.total_score;
        })
        .map((d, i) => ({
            ...d,
            range: i + 1
        }));
    RESPONSE.SUCCESS(req, res, data);
});

router.post("/getClassAvgScoreInMonth", async function (req, res) {
    const { classIdList, month } = req.body;
    if (!month || !Array.isArray(classIdList)) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    const data = await topViewService.getClassAvgScoreInMonth(classIdList, month);
    Object.values(data).forEach(arr => arr.forEach((a, i) => a.index = i + 1));
    RESPONSE.SUCCESS(req, res, data);
});

router.post("/getClassAvgScoreInMonthRange", async function (req, res) {
    const { classIdList, startMonth, endMonth } = req.body;
    if (!startMonth || !endMonth || !Array.isArray(classIdList)) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    let data = await topViewService.getClassAvgScoreInMonthRange(classIdList, startMonth, endMonth);
    data = data.sort((a, b) => b.avg_score - a.avg_score).map((d, i) => ({
        ...d,
        range: i + 1
    }));
    RESPONSE.SUCCESS(req, res, data);
});


router.post("/getChartData1", async function (req, res) {
    const { classIdList, month } = req.body;
    if (!month || !Array.isArray(classIdList)) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    const data = await topViewService.chartsForClass(classIdList, month);
    RESPONSE.SUCCESS(req, res, data);
});

router.post("/getChartData2", async function (req, res) {
    const { classIdList, startMonth, length = 12 } = req.body;
    if (!startMonth || !Array.isArray(classIdList)) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    const data = await topViewService.chartsForHistory(classIdList, startMonth, length);
    RESPONSE.SUCCESS(req, res, data);
});

router.post("/getChartData3", async function (req, res) {
    const { groupId, month } = req.body;
    if (!month) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    const data = await topViewService.chartForDedScore(groupId, month);
    RESPONSE.SUCCESS(req, res, data);
});


/**
 * 需要n个接口
 *
 * 1.getGroupAvgScoreInMonth
 * 2.getClassAvgScoreInMonth接口改造，返回结果不专业
 * 3.接口数据更新
 * 4.修改备注
 * 5.管理人员，增删改查四个接口
 */

router.post("/getAllPersons", async function (req, res) {
    try {
        const data = await topViewService.getAllPersonsInfo();
        RESPONSE.SUCCESS(req, res, data);
    } catch (e) {
        RESPONSE.ERROR(req, res, e);
    }
});


/**
 * scoreDelta需要的是分数的正比值，扣分的是负数
 */
router.post("/updateScoreInPersonMonth", async function (req, res) {
    const { month, personId, labelId, scoreDelta } = req.body;
    if (!month || !personId || !labelId) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    try {
        const data = await topViewService.updateScoreInPersonMonth(month, personId, labelId, scoreDelta);
        RESPONSE.SUCCESS(req, res, data);
    } catch (e) {
        RESPONSE.ERROR(req, res, e);
    }
});

router.post("/updateRemarkInPersonMonth", async function (req, res) {
    let { month, personId, labelId, remark } = req.body;
    if (!month || !personId || !labelId) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    try {
        remark = remark || null;
        const data = await topViewService.updateRemarkInPersonMonth(month, personId, labelId, remark);
        RESPONSE.SUCCESS(req, res, data);
    } catch (e) {
        RESPONSE.ERROR(req, res, e);
    }
});


/**
 * 批量记录接口，目前使用多批次的方法，效率很低，后续可以改进
 * @param records   [{month, personId, labelId, scoreDelta, remark}]
 */
router.post("/updateBatchInfoInPersonMonth", async function (req, res) {
    let { records } = req.body;
    if (!records) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    try {
        const failedRecords = await topViewService.updateBatchInfoInPersonMonth(records);
        RESPONSE.SUCCESS(req, res, failedRecords);
    } catch (e) {
        RESPONSE.ERROR(req, res, e);
    }
});



/**
 * @param sortBy default | Name
 */
router.post("/getPersonsInClass", async function (req, res) {
    const { classId, sortBy } = req.body;
    if (!classId) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    let data = await topViewService.getPersonsInClass(classId);
    if (sortBy === "Name") {
        data.sort((a, b) => a.person_name.localeCompare(b.person_name));
    }
    data.forEach((d, i) => d.index = i + 1);
    RESPONSE.SUCCESS(req, res, data);
});

router.post("/addPersonInClass", async function (req, res) {
    const { classId, personName, flagInfo } = req.body;
    if (!classId || !personName) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    const data = await topViewService.addPersonInClass(classId, personName, flagInfo);
    RESPONSE.SUCCESS(req, res, data);
});

router.post("/deletePersonInClass", async function (req, res) {
    const { personId } = req.body;
    if (!personId) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    const data = await topViewService.deletePersonInClass(personId);
    RESPONSE.SUCCESS(req, res, data);
});

router.post("/updatePersonInClass", async function (req, res) {
    const { personId, personName, flagInfo } = req.body;
    if (!personId) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    if (!personName) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.NULLTYPE.title);
        return;
    }
    const data = await topViewService.updatePersonInClass(personId, personName, flagInfo);
    RESPONSE.SUCCESS(req, res, data);
});

export default router;