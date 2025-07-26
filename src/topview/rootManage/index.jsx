"use client";
import { Button, Cascader, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { makePost } from "@/src/utils.jsx";
import Manage from "@/src/topview/rootManage/manage.jsx";
import { PEmpty } from "@/src/components/commonUtils.jsx";
import BatchManage from "./batchManage";
import RevokeScore from "@/src/topview/rootManage/revokeScore.jsx";


export default function Index() {


    const [groupList, setGroupList] = useState([]);
    const [classList, setClassList] = useState([]);

    const [activeGroupId, setActiveGroupId] = useState(null);
    const [activeClassId, setActiveClassId] = useState(null);

    const groupChange = (groupIds) => {
        const groupId = groupIds[groupIds.length - 1];
        setActiveGroupId(groupId);
        if (groupId) {
            makePost("/topview/getClassesByGroupId", { groupId }).then(res => {
                if (res.data) {
                    setClassList(res.data.map(classItem => ({
                        label: classItem.class_name,
                        value: classItem.class_id
                    })));
                }
            });
        }
    };

    const classChange = (classId) => {
        setActiveClassId(classId);
    };

    const loginOut = () => {
        window.location.href = "/wmapp/login";
    };

    const backToStore = () => {
        window.location.href = "/wmapp/appstore";
    };

    useEffect(() => {
        makePost("/topview/getAllMyGroups").then(res => {
            if (res.data) {
                if (res.data) {
                    res.data = res.data.map(group => ({
                        value: group.group_id,
                        label: group.group_name,
                        children: group.children ? group.children.map(child => ({
                            value: child.group_id,
                            label: child.group_name
                        })) : null
                    }));
                }
                setGroupList(res.data);
            }
        });
    }, []);

    return <div className={"topview-manage"}>
        <div className={"top"}>
            <Space className={"flex1"}>
                <Cascader allowClear={false} style={{ width: 300 }} options={groupList} onChange={groupChange} allow placeholder="请选择机组"/>
                <Select style={{ width: 300 }} options={classList} onChange={classChange} placeholder="请选择班组"/>
                <BatchManage/>
                <RevokeScore/>
            </Space>
            <div>
                <Button size={"small"} type={"link"} onClick={backToStore}>
                    首页
                </Button>
                <Button size={"small"} type={"link"} onClick={loginOut}>
                    登出
                </Button>
            </div>
        </div>
        <div className={"manage"}>
            {
                activeClassId ?
                    <Manage groupId={activeGroupId} classId={activeClassId}/> :
                    <PEmpty description={"请先选择上方的班组选项"}/>
            }
        </div>
    </div>;
}