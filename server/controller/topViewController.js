import express from "express";
import RESPONSE from "../common/RESPONSE.js";
import topViewService from "../service/topViewService.js";

const router = express.Router();

router.post("/getAllGroups", async function (req, res) {
    const groups = await topViewService.getAllCollectedGroups();
    RESPONSE.SUCCESS(req, res, groups);
})

router.post("/getClassesByGroupId", async function (req, res) {
    RESPONSE.SUCCESS(req, res, null);
})

/**
 * classId如果不传的话，默认是全部class
 */
router.post("/getClassAvgScoreInMonth", async function (req, res) {
    const {classId, month} = req.body;
    if (!month) {
        RESPONSE.ERROR(req, res, "缺少月份信息");
    }
    const data = await topViewService.getClassAvgScoreInMonth(classId, month);
    RESPONSE.SUCCESS(req, res, data);
})

export default router;