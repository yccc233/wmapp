"use client"
import {Button, Cascader, Empty, Select, Space} from "antd";
import {useEffect, useState} from "react";
import {makePost} from "@/src/utils.jsx";
import Manage from "@/src/topview/rootManage/manage.jsx";

export default function Index() {


    const [groupList, setGroupList] = useState([]);
    const [classList, setClassList] = useState([]);

    const [activeClassId, setActiveClassId] = useState(2001);

    const groupChange = (groupIds) => {
        const groupId = groupIds[groupIds.length - 1];
        if (groupId) {
            makePost("/topview/getClassesByGroupId", {groupId}).then(res => {
                if (res.data) {
                    setClassList(res.data.map(classItem => ({
                        label: classItem.class_name,
                        value: classItem.class_id,
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

    useEffect(() => {
        makePost("/topview/getAllGroups").then(res => {
            if (res.data) {
                if (res.data) {
                    res.data = res.data.map(group => ({
                        value: group.group_id,
                        label: group.group_name,
                        children: group.children ? group.children.map(child => ({
                            value: child.group_id,
                            label: child.group_name,
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
                <Cascader style={{width: 300}} options={groupList} onChange={groupChange} placeholder="请选择组"/>
                <Select style={{width: 300}} options={classList} onChange={classChange} placeholder="请选择班组"/>
            </Space>
            <div>
                <Button type={"link"} onClick={loginOut}>
                    登出
                </Button>
            </div>
        </div>
        <div className={"manage"}>
            {
                activeClassId ?
                    <Manage classId={activeClassId}/> :
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={"请先选择上方的班组选项"}
                    />
            }
        </div>
    </div>;
}