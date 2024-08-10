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
    const effectRows = await rootManageDao.updatePortals(portalId, portalConfig);
    return effectRows;
};

/**
 * 新建门户
 */
const insertPortal = async (portalConfig) => {
    portalConfig.events = typeof portalConfig.events === "object" ? JSON.stringify(portalConfig.events) : null;
    const effectRows = await rootManageDao.insertPortal(portalConfig);
    return effectRows;
};

/**
 * 删除门户
 */
const dropPortal = async (portalId) => {
    const effectRows = await rootManageDao.dropPortal(portalId);
    return effectRows;
};


export default {
    getPortalsByUserId,
    updatePortal,
    insertPortal,
    dropPortal
}