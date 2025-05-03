import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {Button, DatePicker, Modal, Space} from "antd";
import {UserSwitchOutlined} from "@ant-design/icons";


export default function ManagePersonModal({visible, classId, close}) {


    useEffect(() => {
        if (visible) {

        }
    }, [visible, classId]);

    return <Modal
        open={visible}
        onCancel={close}
        width={1000}
        closable={false}
        footer={null}
        title={"成员管理"}
        wrapClassName={"topview-manage-m-person-modal"}
    >
        <div className={"topview-manage-m-person"}>


        </div>
    </Modal>;
}