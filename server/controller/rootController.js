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
    const effectRows = await rootService.updatePortal(portalId, portalConfig);
    RESPONSE.SUCCESS(req, res, { rows: effectRows });
})

router.post("/addPortal", async function (req, res) {
    const { portalConfig } = req.body;
    const effectRows = await rootService.insertPortal(portalConfig);
    RESPONSE.SUCCESS(req, res, { rows: effectRows });
})


router.post("/dropPortal", async function (req, res) {
    const { portalId } = req.body;
    const effectRows = await rootService.dropPortal(portalId);
    RESPONSE.SUCCESS(req, res, { rows: effectRows });
})

export default router;