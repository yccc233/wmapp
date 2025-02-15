import moment from "moment";

const LOGGER = (req, res, ret) => {
    // 获取当前时间
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
    // 获取请求的接口（路径）
    const apiEndpoint = req.originalUrl;
    // 获取请求的参数（查询参数或请求体参数）
    const bodyParams = req.body;
    const queryStr = JSON.stringify(bodyParams).slice(0, 100);
    const resultStr = JSON.stringify(ret).slice(0, 100);
    const logMessage = `[${currentTime}] - ${apiEndpoint} - Query(${queryStr}) - Result(${resultStr})`;
    // 打印日志
    console.log(logMessage);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    SUCCESS: (req, res, data) => {
        const result = {
            code: 0,
            data: data,
            message: ''
        };
        res.end(JSON.stringify(result));
        LOGGER(req, res, result);
    },
    ERROR: (req, res, message) => {
        const result = {
            code: 3,
            data: null,
            message: message
        };
        res.end(JSON.stringify(result));
        LOGGER(req, res, result);
    },
    CODE: {
        MISSPARAMS: {
            title: "缺少必要参数"
        }
    }
}