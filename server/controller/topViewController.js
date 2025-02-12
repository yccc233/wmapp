import express from "express";
import RESPONSE from "../common/RESPONSE.js";
import topViewService from "../service/topViewService.js";

const router = express.Router();

router.post("/getAllGroups", async function (req, res) {
    const groups = await topViewService.getAllCollectedGroups();
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
    if (!month) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    if (!Array.isArray(classIdList)) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    const data = await topViewService.chartsForClass(classIdList, month);
    RESPONSE.SUCCESS(req, res, data);
})

router.post("/getChartData2", async function (req, res) {
    const {classIdList, month} = req.body;
    if (!month) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    if (!Array.isArray(classIdList)) {
        RESPONSE.ERROR(req, res, RESPONSE.CODE.MISSPARAMS.title);
        return;
    }
    const data = await topViewService.chartsForClass(classIdList, month);
    RESPONSE.SUCCESS(req, res, data);
})

export default router;