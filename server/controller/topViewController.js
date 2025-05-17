import express from "express";
import RESPONSE from "../common/RESPONSE.js";
import topViewService from "../service/topViewService.js";
import {getUserIdName} from "../common/utils.js";

const router = express.Router();

router.post("/getAllMyGroups", async function (req, res) {
    const {userId} = getUserIdName(req);
    const groups = await topViewService.getAllMyCollectedGroups(userId);
    RESPONSE.SUCCESS(req, res, groups);
})

router.post("/getLabelNames", async function (req, res) {
    const labelNames = await topViewService.getLabelNames();
    RESPONSE.SUCCESS(req, res, labelNames);
})

router.post("/getClassesByGroupId", async function (req, res) {
    const {groupId} = req.body;
    if (!groupId) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    const classList = await topViewService.getClassesByGroupId(groupId);
    RESPONSE.SUCCESS(req, res, classList);
})

router.post("/getGroupAvgScore", async function (req, res) {
    const {month} = req.body;
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
})

router.post("/getClassAvgScoreInMonth", async function (req, res) {
    const {classIdList, month} = req.body;
    if (!month) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    if (!Array.isArray(classIdList)) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    const data = await topViewService.getClassAvgScoreInMonth(classIdList, month);
    RESPONSE.SUCCESS(req, res, data);
})


router.post("/getChartData1", async function (req, res) {
    const {classIdList, month} = req.body;
    if (!month || !Array.isArray(classIdList)) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    const data = await topViewService.chartsForClass(classIdList, month);
    RESPONSE.SUCCESS(req, res, data);
})

router.post("/getChartData2", async function (req, res) {
    const {classIdList, startMonth, length = 12} = req.body;
    if (!startMonth || !Array.isArray(classIdList)) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    const data = await topViewService.chartsForHistory(classIdList, startMonth, length);
    RESPONSE.SUCCESS(req, res, data);
})

router.post("/getChartData3", async function (req, res) {
    const {groupId, month} = req.body;
    if (!month) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    const data = await topViewService.chatForDedScore(groupId, month);
    RESPONSE.SUCCESS(req, res, data);
})


/**
 * 需要n个接口
 *
 * 1.getGroupAvgScoreInMonth
 * 2.getClassAvgScoreInMonth接口改造，返回结果不专业
 * 3.接口数据更新
 * 4.管理人员，增删改查四个接口
 */


/**
 * @param sortBy default | Name
 */
router.post("/getPersonsInClass", async function (req, res) {
    const {classId, sortBy} = req.body;
    if (!classId) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    let data = await topViewService.getPersonsInClass(classId);
    if (sortBy === "Name") {
        data.sort((a, b) => a.person_name.localeCompare(b.person_name));
    }
    RESPONSE.SUCCESS(req, res, data);
})

router.post("/addPersonInClass", async function (req, res) {
    const {classId, personName, flagInfo} = req.body;
    if (!classId || !personName) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    const data = await topViewService.addPersonInClass(classId, personName, flagInfo);
    RESPONSE.SUCCESS(req, res, data);
})

router.post("/deletePersonInClass", async function (req, res) {
    const {personId} = req.body;
    if (!personId) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    const data = await topViewService.deletePersonInClass(personId);
    RESPONSE.SUCCESS(req, res, data);
})

router.post("/updatePersonInClass", async function (req, res) {
    const {personId, personName, flagInfo} = req.body;
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
})

export default router;