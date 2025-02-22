import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {Button, DatePicker, Space, Table} from "antd";
import {UserSwitchOutlined} from "@ant-design/icons";
import ManagePerson from "@/src/topview/rootManage/managePerson.jsx";


export default function Manage({classId}) {

    const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
    const [managePersonFlag, setManagePersonFlag] = useState(false);

    const monthChange = (v) => {
        setMonth(v)
    };

    useEffect(() => {
        console.log(classId)

    }, [classId]);

    return <div className={"manage-class"}>
        {/*选定小组 选定月份 管理成员 退出登录*/}
        {/*成员表格 扣分 加分 备注*/}
        <div className={"func-s"}>
            <DatePicker
                picker="month"
                size={"large"}
                allowClear={false}
                value={dayjs(month)}
                onChange={monthChange}
            />
            <ManagePerson
                visible={managePersonFlag}
                classId={classId}
                close={() => setManagePersonFlag(false)}
            />
            <Button type={"primary"} ghost style={{borderStyle: "dashed"}}
                    icon={<UserSwitchOutlined className={"mr5"}/>} size={"large"}
                    onClick={() => setManagePersonFlag(!managePersonFlag)}>
                管理成员
            </Button>
        </div>
        <div className={"mt20"}>
            <Table

            />
        </div>
    </div>;
}