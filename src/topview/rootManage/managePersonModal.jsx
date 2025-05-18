import {useEffect, useState} from "react";
import {Button, Modal, Space, Table} from "antd";
import {makePost} from "@/src/utils.jsx";


export default function ManagePersonModal({visible, classId, close}) {

    const [loading, setLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [editId, setEditId] = useState(null);

    const tableColumns = [{
        key: "index",
        dataIndex: "index",
        title: "序号",
        width: 70
    }, {
        key: "person_name",
        dataIndex: "person_name",
        title: "姓名"
    }, {
        key: "flag_info",
        dataIndex: "flag_info",
        title: "身份标记",
        sorter: (a, b) => a.flag_info && !b.flag_info ? true : false,
        render: text => text || <span style={{fontStyle: "italic"}}>(无)</span>
    }, {
        key: "update_time",
        dataIndex: "update_time",
        title: "最近更新时间",
        sorter: (a, b) => (a.update_time || "").localeCompare(b.update_time || ""),
        width: 200
    }, {
        key: "opt",
        dataIndex: "opt",
        title: "操作",
        width: 140,
        render: () => <Space>
            {
                editId ? <>
                    <Button type={"link"} size={"small"}>保存</Button>
                    <Button type={"link"} size={"small"}>取消</Button>
                </> : <>
                    <Button type={"link"} size={"small"}>编辑</Button>
                    <Button type={"link"} size={"small"}>删除</Button>
                </>
            }
        </Space>
    }];

    useEffect(() => {
        if (visible && classId) {
            setLoading(true);
            makePost("/topView/getPersonsInClass", {classId, sortBy: "Name"})
                .then(res => {
                    setTableData(res.data);
                    setLoading(false);
                });
        }
    }, [visible]);

    return <Modal
        open={visible}
        onCancel={close}
        width={1000}
        closable={false}
        footer={null}
        title={"成员管理"}
        destroyOnClose
        wrapClassName={"topview-manage-m-person-modal"}
    >
        <div className={"topview-manage-m-person"}>
            <Table
                loading={loading}
                scroll={{y: 600}}
                columns={tableColumns}
                dataSource={tableData}
                pagination={{showSizeChanger: true, pageSizeOptions: [20, 50, 100], defaultPageSize: 20}}
            />
        </div>
    </Modal>;
}