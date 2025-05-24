"use client"
import { Badge, Button, Image, message, Popconfirm, Select, Space, Table } from "antd"
import { UserOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from "react-redux"
import { setActivePortalId, setActiveUserId, setPortals, setUserList } from "@/src/store/riskview/rootReducer.jsx"
import { useEffect, useState } from "react"
import { makePost } from "@/src/utils.jsx"
import PortalEditModal from "@/src/riskview/rootManage/portalEditModal.jsx"
import { default_portal } from "@/src/riskview/config.jsx"
import RiskModalCom from "@/src/components/RiskModal.jsx";

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
        makePost("/root/dropPortal", { portalId: portal.portal_id })
            .then(res => {
                if (res.code === 0) {
                    getPortals(activeUserId)
                    message.success("成功删除")
                }
            })
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
        render: txt => <Image width={50} height={50} src={`/wmappserver/img/getImageFromServer/${txt}`}/>
    }, {
        title: '门户状态',
        dataIndex: 'portal_status',
        key: 'portal_status',
        render: t => t === 1 ?
            <Badge status="success" text={<span className={"success"}>在用</span>}/> :
            <Badge status="default" text={<span className={"gray"}>停用</span>}/>
    }, {
        title: '讨论时间',
        dataIndex: 'comment_time',
        key: 'comment_time',
    }, {
        title: '讨论人员',
        dataIndex: 'comment_members',
        key: 'comment_members',
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
            <Button onClick={() => hideOrShowPortal(record)}>{record.portal_status === 1 ? "停用" : "使用"}</Button>
            <Button onClick={() => editPortal(record)}>编辑</Button>
            <Popconfirm title="谨慎操作" onConfirm={() => deletePortal(record)}>
                <Button>删除</Button>
            </Popconfirm>
        </Space>
    }]

    const changeUser = (v) => {
        dispatch(setActiveUserId(v))
    }

    const logout = () => {
        window.location.href = "/wmapp/login"
    }

    const backToStore = () => {
        window.location.href = "/wmapp/appstore";
    }

    const getPortals = (targetId) => {
        setLoading(true)
        makePost("/root/getPortalsByTargetId", { targetId })
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

    const add = () => {
        const newP = { ...default_portal }
        newP.user_id = activeUserId
        makePost("/root/addPortal", { portalConfig: newP })
            .then(res => {
                if (res.code === 0) {
                    message.success("成功新建一个门户")
                    getPortals(activeUserId)
                }
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


    return <div className={"root-manage"}>
        <div className={"flex"} style={{ height: 80 }}>
            <div className={"h_center flex1 ml20"}>
                <Select
                    style={{ width: 240 }}
                    value={activeUserId}
                    options={userList.map(u => ({
                        value: u.user_id,
                        label: <span><UserOutlined className="mr2 gray"/><span>{u.username}</span></span>
                    }))}
                    onChange={changeUser}
                />
            </div>
            <div className={"h_center flex1 mr20"} style={{ justifyContent: "flex-end" }}>
                <Button size={"small"} type={"link"} onClick={backToStore}>首页</Button>
                <Button size={"small"} type={"link"} onClick={logout}>登出</Button>
            </div>
        </div>
        <div className="over-auto" style={{ height: "calc(100% - 80px)" }}>
            <Table
                loading={loading}
                columns={columns}
                dataSource={portals}
                pagination={false}
                footer={() => <div className="vhcenter">
                    <Button style={{ width: 100 }} type="primary" ghost onClick={add}>新增</Button>
                </div>}
            />
        </div>
        <PortalEditModal onSave={() => getPortals(activeUserId)}/>
        <RiskModalCom/>
    </div>
}