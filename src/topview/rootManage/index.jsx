"use client";
import { Button, Cascader, DatePicker, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { makePost } from "@/src/utils.jsx";
import Manage from "@/src/topview/rootManage/manage.jsx";
import { PEmpty } from "@/src/components/commonUtils.jsx";
import BatchManage from "./batchManage";
import RevokeScore from "@/src/topview/rootManage/revokeScore.jsx";
import dayjs from "dayjs";


export default function Index() {


    const [groupList, setGroupList] = useState([]);
    const [classList, setClassList] = useState([]);
    const [activeMonth, setActiveMonth] = useState(dayjs().format("YYYY-MM"));
    const [activeGroupId, setActiveGroupId] = useState(null);
    const [activeClassId, setActiveClassId] = useState(null);

    const monthChange = (_, vStr) => {
        setActiveMonth(vStr);
    };

    const groupChange = (groupIds) => {
        const groupId = groupIds ? groupIds[groupIds.length - 1] : null;
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
                <DatePicker picker="month" size={"large"} style={{ width: 110 }} allowClear={false} value={dayjs(activeMonth)} onChange={monthChange}/>
                <Cascader allowClear style={{ width: 150 }} size={"large"} options={groupList} onChange={groupChange} allow placeholder="请选择机组"/>
                <Select allowClear style={{ width: 150 }} size={"large"} options={classList} onChange={classChange} placeholder="请选择班组"/>
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
            <Manage month={activeMonth} groupId={activeGroupId} classId={activeClassId}/> :
            <PEmpty description={"请先选择上方的班组选项"}/>
        </div>
    </div>;
}