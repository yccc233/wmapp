import express from "express";
import cors from "cors";

import bodyParser from "body-parser";
import nextConfig from "../next.config.mjs";
import umController from "./controller/umController.js";
import DATABASE from "./common/DATABASE.js";

const app = express();
const serverName = nextConfig.serverName;

// 使用body-parser中间件解析JSON请求体
app.use(bodyParser.json());

// 解决CORS跨域请求
app.use(cors());

// 配置请求路由
app.set('port', nextConfig.serverPort);


app.use(`/${serverName}/um`, umController);

app.listen(app.get('port'), () => {
    console.log(`start the server at: http://127.0.0.1:${app.get('port')}/`);
    console.log(`start the database...`);
    DATABASE.initDatabase("./server/database/riskview.db");
});




