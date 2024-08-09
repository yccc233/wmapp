import moment from "moment";
import rootManageDao from "../dao/rootManageDao.js";
import { getMoment } from "../common/utils.js";


/**
 * 获取用户的门户列表
 * @return array user
 */
const getPortalsByUserId = async (userId) => {
    const portals = await rootManageDao.getPortalsByUserId(userId);
    portals.forEach(p => {
        if (p.events) {
            try {
                p.events = JSON.parse(p.events);
            } catch (err) {
                console.error("ERROR:", err)
            }
        }
    })
    return portals;
};

/**
 * 更新门户信息
 */
const updatePortal = async (portalId, portalConfig) => {
    portalConfig.events = typeof portalConfig.events === "object" ? JSON.stringify(portalConfig.events) : null;
    portalConfig.update_time = getMoment();
    const rowCount = await rootManageDao.updatePortals(portalId, portalConfig);
    console.log('updatePortal', rowCount);
    return rowCount;
};

export default {
    getPortalsByUserId,
    updatePortal
}