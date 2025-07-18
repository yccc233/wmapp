import { useEffect, useState } from "react";
import { Button, Form, Input, message, Modal, Space, Table } from "antd";
import { makePost } from "@/src/utils.jsx";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import { allTimeFormat } from "@/src/riskview/config.jsx";

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
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: required,
                            message: msg
                        }
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

export default function ManagePersonModal({ visible, classId, close }) {

    const [loading, setLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [form] = Form.useForm();

    const [addModalVisible, setAddModalVisible] = useState(false);
    const [addForm] = Form.useForm();

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
            title: "岗位",
            editable: true,
            sorter: (a, b) => a.flag_info && !b.flag_info ? true : false,
            render: text => text || <span style={{ fontStyle: "italic" }}>(无)</span>
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
                    </> : record.person_id ? <>
                        <Button type={"link"} size={"small"} onClick={() => edit(record)} disabled={!!editId}>修改</Button>
                        <Button type={"link"} size={"small"} onClick={() => del(record)} disabled={!!editId}>删除</Button>
                    </> : null
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
            makePost("/topView/updatePersonInClass", { personId: record.person_id, personName: row.person_name, flagInfo: row.flag_info })
                .then(res => {
                    if (res.code === 0) {
                        setEditId(null);
                        setTableData(prevData => {
                            const personItem = prevData.find(pd => pd.person_id === record.person_id);
                            if (personItem) {
                                personItem.person_name = row.person_name;
                                personItem.flag_info = row.flag_info;
                            }
                            return [...prevData];
                        });
                        message.success({ key: "person-message", content: "更新成功！" });
                    }
                });
        } catch (errInfo) {
            console.warn("表单验证失败！", errInfo);
        }
    };

    const del = (record) => {
        Modal.confirm({
            centered: true,
            title: `确认删除当前人物-${record.person_name}？`,
            content: <span style={{ color: "#eb0000" }}>此操作无法逆转，请谨慎操作</span>,
            onOk: () => {
                makePost("/topView/deletePersonInClass", { personId: record.person_id })
                    .then(res => {
                        if (res.code === 0) {
                            if (res.data === "success") {
                                setTableData(prevData => {
                                    const personIndex = prevData.findIndex(pd => pd.person_id === record.person_id);
                                    if (personIndex > -1) {
                                        prevData.splice(personIndex, 1);
                                    }
                                    return [...prevData];
                                });
                                message.success({ key: "person-message", content: "删除成功！" });
                            } else {
                                message.error({ key: "person-message", content: "删除失败！" });
                            }
                        }
                    })
                    .catch(console.error);
            }
        });
    };

    const toAdd = () => {
        setAddModalVisible(true);
        addForm.resetFields();
    };

    const add = () => {
        addForm.validateFields()
            .then(values => {
                // Check for duplicate names
                const isDuplicate = tableData.some(person => person.person_name === values.person_name);
                if (isDuplicate) {
                    Modal.warning({
                        title: "警告",
                        content: `成员"${values.person_name}"已存在，请勿重复添加`,
                        centered: true
                    });
                    return;
                }
                // Make API call to add new person
                makePost("/topView/addPersonInClass", {
                    classId,
                    personName: values.person_name,
                    flagInfo: values.flag_info
                })
                    .then(res => {
                        if (res.code === 0) {
                            // Add new person to table data
                            setTableData(prevData => [
                                ...prevData,
                                {
                                    person_id: res.data.person_id,
                                    person_name: values.person_name,
                                    flag_info: values.flag_info,
                                    update_time: moment().format(allTimeFormat),
                                    index: prevData.length + 1
                                }
                            ]);
                            message.success({ key: "person-message", content: "添加成功！" });
                            setAddModalVisible(false);
                        } else {
                            message.error({ key: "person-message", content: "添加失败！" });
                        }
                    })
                    .catch(error => {
                        console.error("添加人物失败:", error);
                        message.error({ key: "person-message", content: "添加失败！" });
                    });
            })
            .catch(errorInfo => {
                console.warn("表单验证失败:", errorInfo);
            });
    };

    useEffect(() => {
        if (visible && classId) {
            setLoading(true);
            makePost("/topView/getPersonsInClass", { classId, sortBy: "Name" })
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
                inputType: "text",
                dataIndex: col.dataIndex,
                title: col.title,
                required: col.dataIndex === "person_name",
                msg: col.dataIndex === "person_name" ? "必填项" : null,
                placeholder: col.title,
                editing: record.person_id === editId
            })
        };
    });

    return <>
        <Modal
            open={visible}
            onCancel={close}
            width={1000}
            closable={false}
            footer={null}
            title={<div style={{ display: "flex", alignContent: "center", justifyContent: "space-between" }}>
                <span>成员管理</span>
                <Button size={"small"} type={"primary"} ghost style={{ borderStyle: "dashed" }} icon={<PlusOutlined/>} onClick={toAdd}>添加成员</Button>
            </div>}
            destroyOnClose
            centered
            wrapClassName={"topview-manage-m-person-modal"}
        >
            <div className={"topview-manage-m-person"}>
                <Form form={form} component={false}>
                    <Table
                        loading={loading}
                        scroll={{ y: 600 }}
                        components={{
                            body: {
                                cell: EditableCell
                            }
                        }}
                        columns={mergedColumns}
                        dataSource={tableData}
                        pagination={{ showSizeChanger: true, pageSizeOptions: [50, 100, 200], defaultPageSize: 50 }}
                    />
                </Form>
            </div>
        </Modal>
        <Modal
            title="添加成员"
            open={addModalVisible}
            centered
            destroyOnClose
            onOk={add}
            onCancel={() => setAddModalVisible(false)}
        >
            <Form
                form={addForm}
                layout="vertical"
                initialValues={{
                    person_name: "",
                    flag_info: ""
                }}
            >
                <Form.Item
                    label="姓名"
                    name="person_name"
                    rules={[{ required: true, message: "请姓名" }]}
                >
                    <Input placeholder="请输入姓名" autoComplete="off"/>
                </Form.Item>
                <Form.Item
                    label="岗位"
                    name="flag_info"
                    className={"mt10"}
                >
                    <Input placeholder="岗位（选填）" autoComplete="off"/>
                </Form.Item>
            </Form>
        </Modal>
    </>;
}