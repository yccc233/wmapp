import express from "express";
import RESPONSE from "../common/RESPONSE.js";
import viewService from "../service/viewService.js";

const router = express.Router();


router.post("/getUserPortals", async function (req, res) {
    const { userId } = req.body;
    const portals = await viewService.getUserViewPortals(userId);
    RESPONSE.SUCCESS(req, res, portals);
})


export default router;