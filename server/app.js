import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import nextConfig from "../next.config.mjs";
import logger from "./common/logger.js";
import DATABASE from "./common/DATABASE.js";
import backupDataBaseTask from "./backup.js";
import umController from "./controller/umController.js";
import imgController from "./controller/imgController.js";
import riskRootController from "./controller/riskRootController.js";
import riskViewController from "./controller/riskViewController.js";
import topViewController from "./controller/topViewController.js";


const { serverName, serverPort, databasePath } = nextConfig.serverConfig;


const app = express();

// 使用body-parser中间件解析JSON请求体
app.use(bodyParser.json({ limit: "10mb", extended: true }));

// 自定义中间件
app.use((_req, res, next) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    next();
});

// 使用 cookie-parser 中间件
app.use(cookieParser());
// 解决CORS跨域请求
app.use(cors());

// 配置请求路由
app.set("port", serverPort);

app.use(`/${serverName}/um`, umController);
app.use(`/${serverName}/img`, imgController);
app.use(`/${serverName}/root`, riskRootController);
app.use(`/${serverName}/view`, riskViewController);
app.use(`/${serverName}/topview`, topViewController);
app.use(`/`, (req, res) => res.send("OK!"));

app.listen(app.get("port"), () => {
    logger.info(`start the server at: http://127.0.0.1:${serverPort}/wmappserver/**/`);
    // 尝试连接数据库，如果异常会报错
    DATABASE.initWMAPPDatabase(databasePath);
    // 备份数据库
    setTimeout(backupDataBaseTask, 1000);
});

