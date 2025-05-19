import {useEffect, useState} from "react";
import {Button, Input, InputNumber, Modal, Space, Table, Form, message} from "antd";
import {makePost} from "@/src/utils.jsx";


const EditableCell = ({
                          editing,
                          dataIndex,
                          title,
                          inputType,
                          record,
                          index,
                          children,
                          required,
                          msg,
                          placeholder,
                          ...restProps
                      }) => {
    const inputNode = <Input placeholder={placeholder}/>;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{margin: 0}}
                    rules={[
                        {
                            required: required,
                            message: msg,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export default function ManagePersonModal({visible, classId, close}) {

    const [loading, setLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [form] = Form.useForm();

    const tableColumns = [
        {
            key: "index",
            dataIndex: "index",
            title: "序号",
            width: 70
        }, {
            key: "person_name",
            dataIndex: "person_name",
            title: "姓名",
            editable: true,
            sorter: (a, b) => a.person_name.localeCompare(b.person_name)
        }, {
            key: "flag_info",
            dataIndex: "flag_info",
            title: "身份标记",
            editable: true,
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
            render: (_, record) => <Space>
                {
                    record.person_id === editId ? <>
                        <Button type={"link"} size={"small"} onClick={() => save(record)}>保存</Button>
                        <Button type={"link"} size={"small"} onClick={cancel}>取消</Button>
                    </> : <>
                        <Button type={"link"} size={"small"} onClick={() => edit(record)} disabled={!!editId}>编辑</Button>
                        <Button type={"link"} size={"small"} disabled={!!editId}>删除</Button>
                    </>
                }
            </Space>
        }];

    const edit = (record) => {
        form.setFieldsValue({
            person_name: record.person_name,
            flag_info: record.flag_info
        });
        setEditId(record.person_id);
    };

    const cancel = () => {
        setEditId(null);
    };

    const save = async (record) => {
        try {
            const row = await form.validateFields();
            console.log(row)
            makePost("/topView/updatePersonInClass", {personId: record.person_id, personName: row.person_name, flagInfo: row.flag_info})
                .then(res => {
                    if (res.code === 0) {
                        setEditId(null);
                        message.success({key: "person-message", content: "更新成功！"});
                    }
                });
        } catch (errInfo) {
            console.warn("表单验证失败！", errInfo);
        }
    };

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

    const mergedColumns = tableColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                required: col.dataIndex === "person_name",
                msg: col.dataIndex === "person_name" ? "必填项" : null,
                placeholder: col.title,
                editing: record.person_id === editId
            }),
        };
    });

    return <Modal
        open={visible}
        onCancel={close}
        width={1000}
        closable={false}
        footer={null}
        title={"成员管理"}
        destroyOnClose
        centered
        wrapClassName={"topview-manage-m-person-modal"}
    >
        <div className={"topview-manage-m-person"}>
            <Form form={form} component={false}>
                <Table
                    loading={loading}
                    scroll={{y: 600}}
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    columns={mergedColumns}
                    dataSource={tableData}
                    pagination={{showSizeChanger: true, pageSizeOptions: [50, 100, 200], defaultPageSize: 50}}
                />
            </Form>
        </div>
    </Modal>;
}