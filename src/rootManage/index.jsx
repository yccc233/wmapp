"use client"
import { Button, Select, Table, Image, Space, message } from "antd"
import { UserOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from "react-redux"
import { setActivePortalId, setActiveUserId, setPortals, setUserList } from "@/src/store/rootReducer"
import { useEffect, useState } from "react"
import { makePost } from "@/src/utils"
import PortalEditModal from "@/src/rootManage/portalEditModal"

// 接口：获取所有的用户及id  done
// 接口：获取用户的门户列表  done
// 接口：设置门户的状态     
// 接口：设置用户的门户配置


export default function Index() {

    const { portals, userList, activeUserId } = useSelector(state => state.rootReducer)
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false)

    const hideOrShowPortal = (portal) => {
        const newPortal = JSON.parse(JSON.stringify(portal))
        newPortal.portal_status = (newPortal.portal_status === 1 ? 0 : 1)
        makePost("/root/editPortalById", { portalId: newPortal.portal_id, portalConfig: newPortal })
            .then(res => {
                if (res.code === 0) {
                    message.success("修改成功")
                    getPortals(activeUserId)
                }
            })
    }

    const deletePortal = (portal) => {
        message.error("还在开发！")
    }

    const editPortal = (portal) => {
        dispatch(setActivePortalId(portal.portal_id))
    }

    const columns = [{
        title: '门户名称',
        dataIndex: 'portal_title',
        key: 'portal_title',
    }, {
        title: '图片',
        dataIndex: 'portal_img',
        key: 'portal_img',
        render: txt => <Image width={50} height={50} src={`/riskserver/img/getImageFromServer/${txt}`} />
    }, {
        title: '门户状态',
        dataIndex: 'portal_status',
        key: 'portal_status',
    }, {
        title: '讨论时间',
        dataIndex: 'comment_time',
        key: 'comment_time',
    }, {
        title: '讨论人员',
        dataIndex: 'comment_memebers',
        key: 'comment_memebers',
    }, {
        title: '事件数量',
        dataIndex: 'events',
        key: 'events',
        render: (_, record) => record.events?.length || 0
    }, {
        title: '操作',
        dataIndex: 'portal_id',
        key: 'portal_id',
        width: 300,
        render: (_, record) => <Space size="small">
            <Button onClick={() => hideOrShowPortal(record)}>{record.portal_status === 1 ? "隐藏" : "放开"}</Button>
            <Button onClick={() => editPortal(record)}>编辑</Button>
            <Button onClick={() => deletePortal(record)}>删除</Button>
        </Space>
    }]

    const changeUser = (v) => {
        dispatch(setActiveUserId(v))
    }

    const logout = () => {

    }

    const getPortals = (targetId) => {
        setLoading(true)
        makePost("/root/getPortalsByTargetId", { targetId: targetId })
            .then(res => {
                if (res.code === 0) {
                    dispatch(setPortals(res.data))
                    setLoading(false)
                }
            })
    }

    const getAllUsers = (cb) => {
        makePost("/um/getAllUserList")
            .then(res => {
                if (res.code === 0) {
                    dispatch(setUserList(res.data))
                    typeof cb === 'function' && cb(res.data)
                }
            })
            .catch(err => {
                console.error(err);
            })
    }

    useEffect(() => {
        if (activeUserId) {
            getPortals(activeUserId)
        }
    }, [activeUserId])

    useEffect(() => {
        getAllUsers(userList => {
            if (userList?.length > 0) {
                changeUser(userList[0].user_id)
            }
        })
    }, [])


    console.log("ttt", { portals, userList });

    return <div className={"root-manage"}>
        <div className={"top-manage"}>
            <div className={"h_center flex1 ml20"}>
                <Select
                    style={{ width: 240 }}
                    value={activeUserId}
                    options={userList.map(u => ({
                        value: u.user_id,
                        label: <span><UserOutlined className="mr2 gray" /><span>{u.username}</span></span>
                    }))}
                    onChange={changeUser}
                />
            </div>
            <div className={"h_center flex1 mr20"} style={{ justifyContent: "flex-end" }}>
                <Button onClick={logout}>登出</Button>
            </div>
        </div>
        <div>
            <Table
                loading={loading}
                columns={columns}
                dataSource={portals}
                pagination={false}
            />
        </div>
        <PortalEditModal />
    </div>
}