import fs from "fs";
import path from "path";
import logger from "./common/logger.js";
import nextConfig from "../next.config.mjs";


const fsp = fs.promises;

const { databasePath, backUpTime } = nextConfig.serverConfig;

let lockFlag = false;
export const backupDataBase = async () => {
    if (lockFlag) {
        logger.info("备份书数据库上次任务未完成，跳过...");
        return;
    }
    let startTime = Date.now();
    try {
        logger.info("备份书数据库【任务启动】...");
        lockFlag = true;
        const srcPath = path.resolve(databasePath);
        const srcStat = await fsp.stat(srcPath).catch(() => {
            throw new Error("源数据库文件不存在");
        });
        if (!srcStat.isFile()) {
            throw new Error("源数据库路径不是文件");
        }
        const dir = path.dirname(srcPath);
        const bakDir = path.join(dir, "bak");
        await fsp.mkdir(bakDir, { recursive: true });
        const now = new Date();
        const pad = (n) => String(n).padStart(2, "0");
        const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
        const baseName = path.basename(srcPath);
        const fragmentNames = baseName.split(".");
        const destName = fragmentNames.slice(0, fragmentNames.length - 1).join(".")
            + ".bak" + timestamp
            + "." + fragmentNames[fragmentNames.length - 1];
        const destPath = path.join(bakDir, destName);
        await fsp.copyFile(srcPath, destPath);
        const elapsedMs = Date.now() - startTime;
        const elapsed = `${elapsedMs}ms (${(elapsedMs / 1000).toFixed(3)}s)`;
        logger.info(`备份书数据库成功：${destPath}，耗时：${elapsed}`);
    } catch (err) {
        logger.error(`备份书数据库异常：${err.toString()}`);
    } finally {
        lockFlag = false;
    }
};

export default function backupDataBaseTask() {
    const timeFragments = backUpTime.split(":").map(e => Number(e));
    setInterval(() => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        // 检查时间是否为 backUpTime 配置
        if (hours === timeFragments[0] && minutes === timeFragments[1]) {
            backupDataBase().catch(console.error);
        }
    }, 60 * 1000);
    logger.info(`备份数据库定时任务启动，每天【${backUpTime}】备份一次（最大一分钟的延迟）`);
}
