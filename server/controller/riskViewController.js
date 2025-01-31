import express from "express";
import RESPONSE from "../common/RESPONSE.js";
import riskViewService from "../service/riskViewService.js";

const router = express.Router();


router.post("/getUserPortals", async function (req, res) {
    const { userId } = req.body;
    const portals = await riskViewService.getUserViewPortals(userId);
    RESPONSE.SUCCESS(req, res, portals);
})


export default router;