import express from "express";
import RESPONSE from "../common/RESPONSE.js";
import rootService from "../service/rootService.js";

const router = express.Router();

router.post("/getPortalsByTargetId", async function (req, res) {
    const { targetId } = req.body;
    const portals = await rootService.getPortalsByUserId(targetId);
    RESPONSE.SUCCESS(req, res, portals);
})


router.post("/editPortalById", async function (req, res) {
    const { portalId, portalConfig } = req.body;
    const rowCount = await rootService.updatePortal(portalId, portalConfig);
    RESPONSE.SUCCESS(req, res, { count: rowCount });
})

export default router;