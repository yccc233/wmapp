import fs from "fs";
import path from "path";
import logger from "./common/logger.js";
import nextConfig from "../next.config.mjs";


const fsp = fs.promises;

const { databasePath, backUpTime, backUpMaxCount } = nextConfig.serverConfig;

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
        // 获取现有备份文件列表并按时间排序
        const files = await fsp.readdir(bakDir);
        const backupFiles = files.filter(file =>
            file.startsWith(path.basename(srcPath, path.extname(srcPath)) + ".bak") &&
            file.endsWith(path.extname(srcPath))
        ).sort(); // 按文件名排序（时间戳从小到大）
        // 如果备份文件数量达到backUpMaxCount个，删除最旧的一个
        if (backupFiles.length >= backUpMaxCount) {
            const oldestFile = backupFiles[0];
            await fsp.unlink(path.join(bakDir, oldestFile));
            logger.info(`备份空间超限，删除备份文件：${oldestFile}`);
        }
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

    setInterval(() => {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        // 检查时间是否为 backUpTime 配置
        if (minutes === backUpTime[0] && hours === backUpTime[1] && dayOfWeek === backUpTime[2]) {
            backupDataBase().catch(console.error);
        }
    }, 60 * 1000);
    logger.info(`备份数据库定时任务启动，配置【${backUpTime}】备份一次（最大一分钟的延迟）`);
}
