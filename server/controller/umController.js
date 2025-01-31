import express from "express";
import RESPONSE from "../common/RESPONSE.js";
import umService from "../service/umService.js";
import {getUserIdName} from "../common/utils.js";

const router = express.Router();


router.post("/login", async function (req, res) {
    const {username, password} = req.body;
    const result_user_id = await umService.verifyUser(username, password);
    RESPONSE.SUCCESS(req, res, {verify: !!result_user_id, userId: result_user_id});
})

router.post("/getAllUserList", async function (req, res) {
    const users = await umService.getUserList();
    RESPONSE.SUCCESS(req, res, users);
})

router.post("/getUserInfo", async function (req, res) {
    const {userId} = getUserIdName(req);
    const user = await umService.getUserById(userId);
    if (user) {
        delete user.pwmd5;
        delete user.update_time;
        delete user.insert_time;
    }
    RESPONSE.SUCCESS(req, res, user);
})

router.post("/getUserAppList", async function (req, res) {
    // 配置的默认角色
    let role = "USER";
    const {userId} = getUserIdName(req);
    const user = await umService.getUserById(userId);
    if (user) {
        role = user.role;
    }
    const appList = await umService.getUserApp(role);
    RESPONSE.SUCCESS(req, res, appList);
})

router.post("/getSystemConfigByKey", async function (req, res) {
    const {key} = req.body;
    const configObj = await umService.getSystemConfig(key);
    RESPONSE.SUCCESS(req, res, {
        [configObj.key]: configObj.value
    });
})


export default router;