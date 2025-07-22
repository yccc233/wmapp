import { Button, Modal, Upload, message } from "antd";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";


export default function ExcelImportModal({ visible, close }) {

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
        <Upload.Dragger
            name={"file"}
            action={"https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"}
            onChange={(info) => {
                const { status } = info.file;
                if (status !== "uploading") {
                    console.log(info.file, info.fileList);
                }
                if (status === "done") {
                    message.success(`${info.file.name} file uploaded successfully.`);
                } else if (status === "error") {
                    message.error(`${info.file.name} file upload failed.`);
                }
            }}
            onDrop={(e) => {
                console.log("Dropped files", e.dataTransfer.files);
            }}
        >
            <p className="ant-upload-drag-icon">
                <InboxOutlined/>
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域</p>
            <p className="ant-upload-hint">
                仅支持excel文件类型上传，上传完成后选择需要导入分数的记录，点击完成后即可录入分数
            </p>
            <p className="ant-upload-hint">
                注意不可重复导入，扣除分数会进行累加！
            </p>
        </Upload.Dragger>

    </Modal>;
}