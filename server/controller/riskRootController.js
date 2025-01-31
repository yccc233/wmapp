import express from "express";
import RESPONSE from "../common/RESPONSE.js";
import riskRootService from "../service/riskRootService.js";

const router = express.Router();

router.post("/getPortalsByTargetId", async function (req, res) {
    const {targetId} = req.body;
    const portals = await riskRootService.getPortalsByUserId(targetId);
    RESPONSE.SUCCESS(req, res, portals);
})


router.post("/editPortalById", async function (req, res) {
    const {portalId, portalConfig} = req.body;
    const effectRows = await riskRootService.updatePortal(portalId, portalConfig);
    RESPONSE.SUCCESS(req, res, {rows: effectRows});
})

router.post("/addPortal", async function (req, res) {
    const {portalConfig} = req.body;
    const effectRows = await riskRootService.insertPortal(portalConfig);
    RESPONSE.SUCCESS(req, res, {rows: effectRows});
})


router.post("/dropPortal", async function (req, res) {
    const {portalId} = req.body;
    const effectRows = await riskRootService.dropPortal(portalId);
    RESPONSE.SUCCESS(req, res, {rows: effectRows});
})

export default router;