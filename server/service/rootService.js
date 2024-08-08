import rootManageDao from "../dao/rootManageDao.js";

/**
 * 获取用户列表
 * @return array user
 */
const getUserList = async () => {
    return await rootManageDao.getAllUserListExceptRoot();
};


export default {
    getUserList
}