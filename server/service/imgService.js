import imgManageDao from "../dao/imgManageDao.js";

/**
 * 上传文件
 * @param userId
 * @param base64
 * @return String   imgId
 */
const uploadFile = async (userId, base64) => {
    return await imgManageDao.uploadFile(userId, base64);
};
/**
 * 下载文件
 * @param imgId
 * @return String base64
 */
const downloadFile = async (imgId) => {
    const rows = await imgManageDao.downloadFile(imgId)
    if (rows.length > 0) {
        return rows[0].img_base64;
    } else {
        return null;
    }
}

export default {
    uploadFile,
    downloadFile
}