import React, { useEffect, useState } from "react";
import { Button, Checkbox, DatePicker, message, Modal, Row } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { makePost } from "@/src/utils.jsx";


export default function RevokeScore() {
    const [visible, setVisible] = useState(false);
    const [labelList, setLabelList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dateCheck, setDateCheck] = useState(dayjs());
    const [labelCheck, setLabelCheck] = useState([]);

    // 显示确认对话框
    const showModal = () => {
        setVisible(true);
    };

    // 关闭对话框
    const handleCancel = () => {
        setVisible(false);
    };

    const doRevoke = () => {
        setLoading(true);
        const month = dateCheck.format("YYYY-MM");
        makePost("/topview/revokeScoreInMonth", { month: month, labelIdList: labelCheck })
            .then(res => {
                message.success(`清除${res.data.effect}条数据`);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (visible && labelList?.length === 0) {
            makePost("/topview/getLabelNames")
                .then(res => {
                    setLabelList(res.data);
                });
        }
    }, [visible]);

    return (
        <>
            <Button
                className="ml20"
                type="primary"
                danger
                // style={{ display: "none" }}
                icon={<RedoOutlined/>}
                onClick={showModal}
            >
                撤销管理
            </Button>
            <Modal
                title="撤销分数管理"
                centered
                footer={false}
                open={visible}
                width={400}
                wrapClassName={"topview-manage-revoke-score-modal"}
                onCancel={handleCancel}
            >
                <div className={"mb20"}>
                    <DatePicker value={dateCheck} onChange={d => setDateCheck(d)} picker="month"/>
                </div>
                <div className={"mb20"}>
                    <Checkbox.Group style={{ flexDirection: "column" }} value={labelCheck} onChange={setLabelCheck}>
                        {
                            labelList.map(label => (
                                <Row key={`check-box-${label.label_name_en}`} className={"mb10"}>
                                    <Checkbox
                                        value={label.label_id}
                                    >{label.label_name}</Checkbox>
                                </Row>
                            ))
                        }
                    </Checkbox.Group>
                </div>
                <div>
                    <Button type={"primary"} danger
                            disabled={labelCheck.length === 0} loading={loading}
                            onClick={doRevoke}
                    >执行撤销</Button>
                </div>
            </Modal>
        </>
    );
}