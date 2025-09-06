import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file"; // 引入专用的轮转传输器
import nextConfig from "../../next.config.mjs";


const { format } = winston;
const { serverName, loggerName } = nextConfig.serverConfig;

// 自定义日志格式
const logFormat = format.printf(({ level, message, timestamp, ...meta }) => {
    const metaInfo = Object.keys(meta).length ? JSON.stringify(meta) : "";
    return `${timestamp} [${serverName}][${level.toUpperCase()}] ${message} ${metaInfo}`;
});

// 通用日志轮转配置
const rotateFileOptions = {
    filename: `logs/${loggerName}-server-%DATE%.log`,
    datePattern: "YYYY-MM-DD",
    maxSize: "10m", // 每个文件最大
    maxFiles: 5, // 最多保留文件
    zippedArchive: false, // 不压缩归档
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
    )
};

// 错误日志轮转配置
const errorRotateFileOptions = {
    ...rotateFileOptions,
    filename: `logs/${loggerName}-server-error-%DATE%.log`,
    level: "error" // 只记录错误级别日志
};

// 终端打印
const consoleLogOptions = {
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
    )
};

// 创建日志实例
const logger = winston.createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
    ),
    transports: [
        // 使用 DailyRotateFile 而不是普通的 File 传输器
        new DailyRotateFile(rotateFileOptions),
        new DailyRotateFile(errorRotateFileOptions),
        new winston.transports.Console(consoleLogOptions)
    ]
});

export default logger;
