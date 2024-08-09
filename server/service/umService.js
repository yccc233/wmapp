import userManageDao from "../dao/userManageDao.js";

/**
 * 验证用户
 * @param userName
 * @param password
 * @return String   user_id
 */
const verifyUser = async (userName, password) => {
    const users = await userManageDao.getUsersByUserName(userName);
    if (users?.length > 0) {
        const user = users[0];
        if (user.pwmd5 === password) {
            return user.user_id;
        } else {
            return null;
        }
    } else {
        return null;
    }
};

/**
 * 获取用户列表
 * @return array user
 */
const getUserList = async () => {
    const users = await userManageDao.getAllUserListExceptRoot();
    users.forEach(u => {
        delete u.pwmd5
    });
    return users;
};


export default {
    verifyUser,
    getUserList
}