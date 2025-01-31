import riskViewManageDao from "../dao/riskViewManageDao.js";

/**
 * 获取用户的门户列表
 * @param userId
 */
const getUserViewPortals = async (userId) => {
    const portals = await riskViewManageDao.getUserViewPortals(userId);
    portals.forEach(p => {
        p.events = JSON.parse(p.events);
    });
    return portals;
};


export default {
    getUserViewPortals
}