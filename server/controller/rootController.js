import express from "express";
import RESPONSE from "../common/RESPONSE.js";
import rootService from "../service/rootService.js";

const router = express.Router();

router.post("/getAllUserList", async function (req, res) {
    const users = await rootService.getUserList();
    RESPONSE.SUCCESS(req, res, users);
})


export default router;