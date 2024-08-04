import express from "express";
import RESPONSE from "../common/RESPONSE.js";
import imgService from "../service/imgService.js";

const router = express.Router();

router.post("/upload", async function (req, res) {
    const {source, userId} = req.body;
    const imgId = await imgService.uploadFile(userId, source);
    RESPONSE.SUCCESS(req, res, imgId);
})

router.post("/download", async function (req, res) {
    const {imgId} = req.body;
    const base64 = await imgService.downloadFile(imgId);
    RESPONSE.SUCCESS(req, res, base64);
})

// http://127.0.0.1:3000/riskserver/img/getImageFromServer/LKDLUNBOQGZMBMDCPUEG
router.get("/getImageFromServer/:imgId", async function (req, res) {
    const {imgId} = req.params;
    const base64 = await imgService.downloadFile(imgId);
    const imageData = Buffer.from(base64, 'base64');
    res.setHeader('Content-Type', 'image/png');
    res.end(imageData);
})


export default router;