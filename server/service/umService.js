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

const getUserById = async (userId) => {
    const users = await userManageDao.getUsersById(userId);
    const user = users[0] || null;
    return user;
};

const getUserAppList = async (user, role = "USER") => {
    let apps = await userManageDao.getAppList();
    const scopes = user.scopes ? JSON.parse(user.scopes) : null;
    if (scopes) {
        apps = apps.filter(app => scopes.includes(app.app_id));
    }
    apps = apps?.map(app => ({
        name: app.name,
        url: role === "ROOT" ? app.root_url : app.user_url,
        description: app.description,
    })) || [];
    return apps;
};

const getSystemConfig = async (key) => {
    let confs = await userManageDao.getSystemConfigs(key);
    return confs[0] || null;
};


export default {
    verifyUser,
    getUserList,
    getUserById,
    getUserAppList,
    getSystemConfig
}