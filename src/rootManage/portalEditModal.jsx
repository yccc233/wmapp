import {default_event, default_risk} from "@/src/config";
import {setActivePortalId} from "@/src/store/rootReducer";
import {CircleEvent} from "@/src/view/ctnMain";
import {
    Button,
    Col,
    ColorPicker,
    DatePicker,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Popconfirm,
    Radio,
    Row,
    Slider,
    Space,
    Table,
    Tabs
} from "antd";
import dayjs from "dayjs";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import UploadFile, {uploadFile, validFile} from "@/src/components/UploadFile";
import {makePost} from "@/src/utils";


export default function PortalEditModal({onSave}) {
    const {activePortalId, portals} = useSelector(state => state.rootReducer)
    const dispatch = useDispatch()

    const imgRef = useRef()

    const [baseNum, setBaseNum] = useState([0, 0])
    const [isNew, setIsNew] = useState(true)
    const [count, setCount] = useState(0)

    const [form] = Form.useForm();


    const cancel = () => {
        dispatch(setActivePortalId(null))
    }

    const save = () => {
        form.validateFields()
            .then((values) => {
                const portalConfig = {...portals.find(p => p.portal_id === activePortalId), ...values}
                makePost("/root/editPortalById", {portalId: activePortalId, portalConfig: portalConfig})
                    .then(res => {
                        if (res.code === 0) {
                            message.success("修改成功")
                            typeof onSave === "function" && onSave();
                            dispatch(setActivePortalId(null))
                        }
                    })
            })
            .catch(err => {
                console.error(err)
            })
    }

    const formChange = (changedValues, allValues) => {
        setCount(count + 1)
        if (changedValues.portal_img) {
            setTimeout(() => {
                getBase()
            }, 50)
        }
    }

    const getBase = () => {
        const height = imgRef.current?.clientHeight || 100
        const width = imgRef.current?.clientWidth || 100
        setBaseNum([width, height])
    }

    useEffect(() => {
        // 为window对象的resize事件添加事件监听器  
        window.addEventListener('resize', getBase)
        return () => window.removeEventListener('resize', getBase)
    }, [])


    useEffect(() => {
        if (activePortalId) {
            const _curPortal = portals?.find(p => p.portal_id === activePortalId)
            setIsNew(false)
            form.setFieldsValue(_curPortal)
            setTimeout(() => {
                getBase()
            }, 50);
        }
    }, [activePortalId])


    const curPortal = form.getFieldsValue()

    useEffect(() => {
        setTimeout(() => {
            getBase()
        }, 50);
    }, [curPortal.portal_img])


    return <Modal
        title={isNew ? "新增门户" : curPortal.portal_title}
        width={1600}
        closable={false}
        maskClosable={false}
        visible={activePortalId}
        centered={true}
        destroyOnClose={true}
        okText={isNew ? "新增" : "保存"}
        onOk={save}
        onCancel={cancel}
    >
        <div className={"portal-edit-modal"}>
            <div className={"edit-left"}>
                <div ref={imgRef} className="img-div">
                    {
                        curPortal.portal_img ?
                            <img src={`/riskserver/img/getImageFromServer/${curPortal.portal_img}`}/> :
                            <div>请右侧上传图片</div>
                    }
                    {
                        curPortal.events?.map((e, i) => <CircleEvent
                            key={`event-${i}`}
                            base={baseNum}
                            type={e.type}
                            point={e.event_point}
                            radius={e.point_radius}
                            lineWidth={e.lines_width}
                            lineColor={e.line_color}
                            title={e.event_title}
                            risklist={e.risk_list}
                        />)
                    }
                </div>
            </div>
            <div className={"divide-line"}/>
            <div className={"edit-right over-auto"} style={{width: 900}}>
                <Form
                    form={form}
                    size="small"
                    labelCol={{span: 3}}
                    wrapperCol={{span: 20}}
                    onValuesChange={formChange}
                >
                    <Form.Item
                        name="portal_title"
                        label="门户名称"
                        rules={[
                            {
                                required: true,
                                message: '请输入门户名称',
                            },
                        ]}
                    >
                        <Input style={{width: 200}}/>
                    </Form.Item>
                    <Form.Item
                        name="portal_img"
                        label="门户图片"
                        rules={[
                            {
                                required: true,
                                message: '请上传图片',
                            },
                        ]}
                    >
                        <ItemImgUpload/>
                    </Form.Item>
                    {/*<Form.Item*/}
                    {/*    name="comment_members"*/}
                    {/*    label="参与人（暂无用）"*/}
                    {/*>*/}
                    {/*    <Input style={{ width: 200 }} />*/}
                    {/*</Form.Item>*/}
                    {/*<Form.Item*/}
                    {/*    name="comment_time"*/}
                    {/*    label="参与时间（暂无用）"*/}
                    {/*>*/}
                    {/*    <ItemDataPicker />*/}
                    {/*</Form.Item>*/}
                    <Form.Item
                        name="events"
                        label="过程/设备"
                        rules={[
                            {
                                required: true,
                                message: '请录入事件',
                            },
                        ]}
                    >
                        <ItemEvents/>
                    </Form.Item>
                </Form>
            </div>
        </div>
    </Modal>
}

const ItemImgUpload = ({value, onChange}) => {
    const upFile = () => {
        if (!validFile()) {
            return false
        }
        uploadFile().then(img => {
            onChange(img)
        });
    }

    return <>
        <UploadFile onChange={upFile}/>
        <span>{value}</span>
    </>
}

const ItemEvents = ({value, onChange}) => {

    const items = (value || []).map((e, i) => ({
        key: i,
        label: e.event_title,
        value: e,
        children: null,
    }))

    const [form] = Form.useForm();

    const [activeKey, setActiveKey] = useState(null)

    const tabsChange = (newActiveKey) => {
        setActiveKey(newActiveKey)
    }

    const tabsEdit = (activeIndex, action) => {
        if (action === 'add') {
            const newEvent = {...default_event}
            const newE = value.concat([newEvent])
            typeof onChange === "function" && onChange(newE)
        } else {
            let newE = JSON.parse(JSON.stringify(value))
            newE.splice(activeIndex, 1)
            typeof onChange === "function" && onChange(newE)
        }
    }

    const valuesChange = (changedValues, allValues) => {
        const targetValue = {...value[activeKey], ...changedValues}
        value[activeKey] = targetValue
        typeof onChange === "function" && onChange(value)
    }

    useEffect(() => {
        if (activeKey !== null && activeKey != undefined) {
            if (items?.length > 0) {
                form.setFieldsValue(items[activeKey].value)
            }
        }
    }, [activeKey])

    return <div className="form-item-events">
        <Tabs
            type="editable-card"
            size="small"
            style={{width: 750}}
            onChange={tabsChange}
            activeKey={activeKey}
            onEdit={tabsEdit}
            items={items}
        />
        {
            activeKey === null ? <div>
                请选择一个事件
            </div> : <Form
                form={form}
                // layout="inline"
                onValuesChange={valuesChange}
            >
                <Row style={{height: 40}}>
                    <Col span={6}>
                        <Form.Item
                            name="event_title"
                            label="过程/设备"
                        >
                            <Input style={{width: 80}}/>
                        </Form.Item>
                    </Col>
                    <Col span={18}>
                        <Form.Item
                            name="event_point"
                            label="坐标"
                        >
                            <ItemSlider/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{height: 40}}>
                    <Col span={6}>
                        <Form.Item
                            name="point_radius"
                            label="半径"
                        >
                            <Slider style={{width: 100}}/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="lines_width"
                            label="线宽/字号"
                        >
                            <Slider style={{width: 100}}/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="line_color"
                            label="颜色"
                        >
                            <ItemColorPicker/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="type"
                            label="种类"
                        >
                            <Radio.Group>
                                <Radio value={"circle"}>图形</Radio>
                                <Radio value={"word"}>文字</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    name="risk_list"
                >
                    <ItemRiskList/>
                </Form.Item>
            </Form>
        }
    </div>
}

const ItemSlider = ({value = [0, 0], onChange}) => {

    return <div className="flex" style={{width: 300}}>
        <div className="flex1">
            {/* <div className="v_center fs12">x位置</div> */}
            <Slider style={{width: 100}} value={value[0]} onChange={newV => onChange([newV, value[1]])}/>
        </div>
        <div style={{width: 50}}/>
        <div className="flex1">
            {/* <div className="v_center fs12">y位置</div> */}
            <Slider style={{width: 100}} value={value[1]} onChange={newV => onChange([value[0], newV])}/>
        </div>
    </div>
}

const ItemColorPicker = ({value, onChange}) => {
    return <ColorPicker size="small" value={value} onChange={c => onChange(c.toHexString())}/>
}

const ItemRiskList = ({value, onChange}) => {

    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState(null);


    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        })
        setEditingKey(record.id)
    }
    const del = (record) => {
        const newV = value.filter(v => v.id != record.id)
        typeof onChange === "function" && onChange(newV)
    }
    const cancel = () => {
        setEditingKey(null);
    }
    const save = (record) => {
        const val = form.getFieldsValue();
        // 字段特殊处理，字符串去除边白
        Object.keys(val).forEach(k=> {
            if (typeof val[k] ==="string") {
                val[k] = val[k].trim()
            }
        })
        
        const newData = {...record, ...val};
        const index = value.findIndex((item) => newData.id === item.id);
        if (index > -1) {
            const newV = JSON.parse(JSON.stringify(value))
            newV[index] = newData
            typeof onChange === "function" && onChange(newV.sort((a, b) => a.order - b.order));
        } else {
            message.error("找不到这条记录了")
        }
        setEditingKey(null);
    }

    const add = () => {
        let maxId = 0, maxOrder = 0;
        value.forEach(v => {
            if (v.id > maxId) {
                maxId = v.id
            }
            if (v.order > maxOrder) {
                maxOrder = v.order
            }
        })
        const newR = {...default_risk, id: maxId + 1, order: maxOrder + 1}
        const newV = value.concat([newR])
        typeof onChange === "function" && onChange(newV);
        form.setFieldsValue({
            ...newR,
        })
        setEditingKey(newR.id);
    }

    const columns = [{
        title: '顺序',
        dataIndex: 'order',
        key: 'order',
        // fixed: "left",
        width: 100,
        editable: true,
        inputType: "number",
    }, {
        title: '分类',
        dataIndex: 'group',
        key: 'group',
        // fixed: "left",
        width: 100,
        editable: true,
    }, {
        title: '可能失效点',
        dataIndex: 'title',
        key: 'title',
        width: 200,
        editable: true,
        inputType: "text",
        render: t => <pre className={"long-text-pre"}>{t}</pre>
    }, {
        title: '造成后果/历史事故',
        dataIndex: 'consequence',
        key: 'consequence',
        width: 300,
        editable: true,
        inputType: "text",
        render: t => <pre className={"long-text-pre"}>{t}</pre>
    }, {
        title: '点检要求/预防措施',
        dataIndex: 'measure',
        key: 'measure',
        width: 300,
        editable: true,
        inputType: "text",
        render: t => <pre className={"long-text-pre"}>{t}</pre>
    }, {
        title: '责任人',
        dataIndex: 'dutier',
        key: 'dutier',
        width: 150,
        editable: true,
    }, {
        title: '风险等级',
        dataIndex: 'level',
        key: 'level',
        width: 100,
        editable: true,
        inputType: "number",
        render: t => `${t}星`
    }, {
        title: '操作',
        dataIndex: 'opt',
        key: 'opt',
        fixed: 'right',
        width: 120,
        render: (_, record) => <Space size={"small"}>
            {record.id === editingKey ? <>
                <Button size="small" type="link" onClick={() => save(record)}>保存</Button>
                <Button size="small" type="link" onClick={cancel}>取消</Button>
            </> : <>
                <Button size="small" type="link" onClick={() => edit(record)}>编辑</Button>
                <Popconfirm title="谨慎操作" onConfirm={() => del(record)}>
                    <Button size="small" type="link" danger>删除</Button>
                </Popconfirm>
            </>}
        </Space>
    }].map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.inputType || 'input',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: record.id === editingKey
            }),
        };
    });

    return <Form form={form} component={false}>
        <Table
            style={{width: 750}}
            size="small"
            columns={columns}
            dataSource={value}
            pagination={false}
            scroll={{
                x: 1250,
            }}
            components={{
                body: {
                    cell: EditableCell,
                },
            }}
            footer={() => <div className="vhcenter">
                <Button style={{width: 100}} type="primary" ghost onClick={add}>新增</Button>
            </div>}
        />
    </Form>
}
const EditableCell = ({
                          editing,
                          dataIndex,
                          title,
                          inputType,
                          record,
                          index,
                          children,
                          ...restProps
                      }) => {
    const inputNode = inputType === 'number' ? <InputNumber/> : inputType === 'text' ? <Input.TextArea/> :
        <Input/>;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{margin: 0}}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};