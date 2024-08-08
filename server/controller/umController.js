import express from "express";
import RESPONSE from "../common/RESPONSE.js";
import umService from "../service/umService.js";

const router = express.Router();


router.post("/login", async function (req, res) {
    const { username, password } = req.body;
    const result_user_id = await umService.verifyUser(username, password);
    RESPONSE.SUCCESS(req, res, { verify: !!result_user_id, userId: result_user_id });
})

router.post("/getAllUserList", async function (req, res) {
    const users = await umService.getUserList();
    RESPONSE.SUCCESS(req, res, users);
})


export default router;