import { Button, Modal, Upload, message, Tabs } from "antd";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";
import Uploader from "@/src/topview/rootManage/batchManage/uploader.jsx";


export default function HandleImportModal({ visible, close }) {

    return <Modal
        width={1000}
        closable={false}
        footer={null}
        title={<div style={{ display: "flex", alignContent: "center", justifyContent: "space-between" }}>
            <span>批量处理</span>
        </div>}
        destroyOnClose
        centered
        wrapClassName={"topview-manage-excel-import-modal"}
        open={visible}
        onCancel={close}
    >
        <Tabs>
            <Tabs.TabPane tab="厂办查处" key="1">
                <ExcelManage/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="压力" key="2">
                {/* Content for Pressure tab */}
            </Tabs.TabPane>
            <Tabs.TabPane tab="性能" key="3">
                {/* Content for Performance tab */}
            </Tabs.TabPane>
        </Tabs>
    </Modal>;
}


const ExcelManage = ({ dateField = "违章时间" }) => {
    const dataHandle = () => {

    };


    return <div>
        <Uploader/>
    </div>;
};