import React, { useState } from "react";
import { Button, Modal, message } from "antd";
import { RedoOutlined } from "@ant-design/icons";


export default function RevokeScore() {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    // 显示确认对话框
    const showModal = () => {
        setVisible(true);
    };

    // 关闭对话框
    const handleCancel = () => {
        setVisible(false);
    };


    return (
        <>
            <Button
                className="ml20"
                type="primary"
                danger
                style={{ display: "none" }}
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
                onCancel={handleCancel}
                confirmLoading={loading}
            >


            </Modal>
        </>
    );
}