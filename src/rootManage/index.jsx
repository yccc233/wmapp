"use client"

import { Button, Select, Table, Image, Space } from "antd"
import { useDispatch, useSelector } from "react-redux"
import { setPortals } from "@/src/store/rootReducer";
import { useEffect, useState } from "react"
import { makePost } from "@/src/utils";

// 接口：获取所有的用户及id  done
// 接口：获取用户的门户列表
// 接口：设置门户的状态
// 接口：设置用户的门户配置


export default function Index() {

    const dispatch = useDispatch();
    const { portals } = useSelector(state => state.rootReducer)


    const columns = [{
        title: '门户名称',
        dataIndex: 'portalTitle',
        key: 'portalTitle',
    }, {
        title: '图片',
        dataIndex: 'portalImg',
        key: 'portalImg',
        render: txt => <Image width={50} height={50} src={`/riskserver/img/getImageFromServer/${txt}`} />
    }, {
        title: '门户状态',
        dataIndex: 'portalStaus',
        key: 'portalStaus',
    }, {
        title: '讨论时间',
        dataIndex: 'commentTime',
        key: 'commentTime',
    }, {
        title: '讨论人员',
        dataIndex: 'commentMemebers',
        key: 'commentMemebers',
    }, {
        title: '事件数量',
        dataIndex: 'events',
        key: 'events',
        render: (_, record) => record.events?.length || 0
    }, {
        title: '操作',
        dataIndex: 'portalId',
        key: 'portalId',
        width: 300,
        render: (_, record) => <Space size="small">
            <Button>{record.portalStaus === 1 ? "隐藏" : "放开"}</Button>
            <Button>编辑</Button>
            <Button>删除</Button>
        </Space>
    }]

    const getPortals = () => {
        const portalsServes = [{
            "portalId": "2",
            "portalTitle": "出口段",
            "portalStaus": 1,
            "portalImg": "MRMLZNGNYVRTWZZFSPKS",
            "commentTime": "2024-07-18",
            "commentMemebers": "a,v,d,d",
            "events": [
                {
                    "eventTitle": "钢卷小车",
                    "eventPoint": [
                        20,
                        30
                    ],
                    "pointRadius": 10,
                    "lineswidth": 10,
                    "linecolor": "#ff0000",
                    "risklist": [
                        {
                            "title": "XXX故障",
                            "img": "LKDLUNBOQGZMBMDCPUEG",
                            "level": 3,
                            "dutier": "胖子",
                            "consequence": "可能造成停机",
                            "measure": "整体更换（周期）"
                        }
                    ]
                },
                {
                    "eventTitle": "钢卷da车",
                    "eventPoint": [
                        68,
                        35
                    ],
                    "pointRadius": 15,
                    "lineswidth": 12,
                    "linecolor": "#ff0000",
                    "risklist": [
                        {
                            "title": "XXX故障",
                            "img": "LKDLUNBOQGZMBMDCPUEG",
                            "level": 3,
                            "dutier": "胖子",
                            "consequence": "可能造成停机",
                            "measure": "整体更换（周期）"
                        }
                    ]
                }
            ]
        }, {
            "portalId": "4",
            "portalTitle": "测试123",
            "portalStaus": 0,
            "portalImg": "LKDLUNBOQGZMBMDCPUEG",
            "commentTime": "2024-07-18",
            "commentMemebers": "a,v,d,d",
            "events": [
                {
                    "eventTitle": "钢卷小车",
                    "eventPoint": [
                        12,
                        16
                    ],
                    "pointRadius": 2.4,
                    "lineswidth": 5,
                    "linecolor": "#ff0000",
                    "risklist": [
                        {
                            "title": "XXX故障",
                            "img": "345345",
                            "level": 3,
                            "dutier": "胖子",
                            "consequence": "可能造成停机",
                            "measure": "整体更换（周期）"
                        }
                    ]
                }
            ]
        }, {
            "portalId": "6",
            "portalTitle": "测试adasd",
            "portalStaus": 1,
            "portalImg": "LKDLUNBOQGZMBMDCPUEG",
            "commentTime": "2024-07-18",
            "commentMemebers": "a,v,d,d",
            "events": [
                {
                    "eventTitle": "钢卷小车",
                    "eventPoint": [
                        12,
                        16
                    ],
                    "pointRadius": 2.4,
                    "lineswidth": 5,
                    "linecolor": "#ff0000",
                    "risklist": [
                        {
                            "title": "XXX故障",
                            "img": "345345",
                            "level": 3,
                            "dutier": "胖子",
                            "consequence": "可能造成停机",
                            "measure": "整体更换（周期）"
                        }
                    ]
                }
            ]
        }]

        dispatch(setPortals(portalsServes))
    }

    const getAllUsers = () => {
        makePost("/um/getAllUserList")
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.error(err);
            })
    }

    useEffect(() => {
        getAllUsers()
    }, [])


    console.log("ttt", portals);

    return <div className={"root-manage"}>
        <div className={"top-manage"}>
            <div className={"vhcenter flex1"}>
                <Select style={{ width: 240 }}>

                </Select>
            </div>
            <div className={"vhcenter flex1"}>
                <Button>登出</Button>
            </div>
        </div>

        <div>
            <Table
                columns={columns}
                dataSource={portals}
                pagination={false}
            />
        </div>
    </div>
}