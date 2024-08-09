import { Form, Input, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setActivePortalId } from "@/src/store/rootReducer";
import { useEffect, useState, useRef } from "react"
import { CircleEvent } from "@/src/view/ctnMain";
import UploadFile, { uploadFile, validFile } from "../components/UploadFile";



export default function PortalEditModal() {
    const { activePortalId, portals, activeUserId } = useSelector(state => state.rootReducer)
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
        const saved = form.getFieldsValue()
        console.log("baocun", saved);

    }

    const formChange = (changedValues, allValues) => {
        console.log({ changedValues, allValues });
        if (changedValues.portal_img) {
            setCount(count + 1)
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
        const default_portal = {
            "portal_id": -1,
            "user_id": activeUserId,
            "portal_title": "",
            "portal_status": 1,
            "portal_img": null,
            "comment_time": null,
            "comment_members": null,
            "footer_btn": null,
            "events": [],
            "update_time": null,
            "insert_time": null
        }

        if (activePortalId) {
            if (activePortalId === -1) {
                setIsNew(true)
                form.setFieldsValue(default_portal)
            } else {
                const _curPortal = portals?.find(p => p.portal_id === activePortalId)
                setIsNew(false)
                form.setFieldsValue(_curPortal || default_portal)
            }
            setTimeout(() => {
                getBase()
            }, 50);
        }

    }, [activePortalId])


    const curPortal = form.getFieldsValue()

    console.log("curPortal", curPortal);



    return <Modal
        title={isNew ? "新增门户" : curPortal.portal_title}
        width={1000}
        closable={false}
        maskClosable={false}
        visible={activePortalId}
        centered={true}
        okText={isNew ? "新增" : "保存"}
        onOk={save}
        onCancel={cancel}
    >
        <div className={"portal-edit-modal"}>
            <div className={"edit-left"}>
                <div ref={imgRef} className="img-div">
                    {
                        curPortal.portal_img ? <img src={`/riskserver/img/getImageFromServer/${curPortal.portal_img}`} /> : <div>请上传图片</div>
                    }
                    {
                        curPortal.events?.map((e, i) => <CircleEvent
                            key={`event-${i}`}
                            base={baseNum}
                            point={e.eventPoint}
                            radius={e.pointRadius}
                            lineWidth={e.lineswidth}
                            lineColor={e.linecolor}
                            title={e.eventTitle}
                            risklist={e.risklist}
                        />)
                    }
                </div>
            </div>
            <div className={"divide-line"} />
            <div className={"edit-right"}>
                <Form
                    form={form}
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
                        <Input />
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
                        <ItemImgUpload />
                    </Form.Item>
                </Form>
            </div>
        </div>
    </Modal>
}

const ItemImgUpload = ({ value, onChange }) => {
    const upFile = () => {
        if (!validFile()) {
            return false
        }
        uploadFile().then(img => {
            onChange(img)
        });
    }

    return <>
        <UploadFile onChange={upFile} />
        <span>{value}</span>
    </>
}