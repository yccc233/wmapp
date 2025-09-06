import winston from "winston";
import nextConfig from "../../next.config.mjs";


const { format, transports } = winston;
const { serverName, loggerName } = nextConfig.serverConfig;


// 自定义日志格式
const logFormat = format.printf(({ level, message, timestamp, ...meta }) => {
    // 拼接自定义元数据
    const metaInfo = Object.keys(meta).length ? JSON.stringify(meta) : "";
    return `${timestamp} [${serverName}][${level.toUpperCase()}] ${message} ${metaInfo}`;
});

// 创建日志实例
const logger = winston.createLogger({
    level: "info", // 日志级别：error > warn > info > verbose > debug > silly
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // 添加时间戳
        logFormat
    ),
    transports: [
        // 所有日志记录到一个文件
        new transports.File({ filename: `logs/${loggerName}.log` }),
        // 输出到文件（错误日志单独记录）
        new transports.File({ filename: `logs/${loggerName}-error.log`, level: "error" }),
        // 开发环境同时输出到控制台
        new transports.Console({ format: format.combine(format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat) })
    ]
});

export default logger;
