import crypto from "crypto"
import moment from "moment";

export const getRandomId = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    const bytes = crypto.randomBytes(length);
    for (let i = 0; i < bytes.length; i++) {
        // 获取一个随机的索引值，该值在字符集长度内
        const charIndex = bytes[i] % chars.length;
        // 从字符集中取出对应的字符并添加到结果字符串中
        result += chars[charIndex];
    }
    return result;
};

export const getMoment = () => {
    return moment().format("yyyy-MM-DD HH:mm:ss");
};

export const getUserIdName = (req) => {
    return {userId: req.cookies.userid, userName: req.cookies.username}
};


export const formatNumber = (num, digits = 1) => {
    if (Number.isInteger(num)) {
        return num;
    }
    return Number(num.toFixed(digits));
}
