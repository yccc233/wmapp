import { message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";


/**
 *
 * @param readCallBack 最终返回一个对象数组
 */
export default function Uploader({ readCallBack }) {

    const handleData = (data) => {
        console.log("数据data", data);
        const startLineKeys = "时间范围";

        // if()

        // const definedProps =;


    };

    const handleFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: "array" });
                    // Process the workbook data here
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    resolve(jsonData);
                } catch (error) {
                    console.error("Error parsing Excel:", error);
                    reject(error);
                }
            };
            reader.onerror = (error) => {
                message.error("文件读取失败");
                reject(error);
            };
            reader.readAsArrayBuffer(file);
        });
    };

    return (
        <Upload.Dragger
            name={"file"}
            accept=".xlsx,.xls"
            multiple={false}
            showUploadList={false}
            beforeUpload={(file) => {
                handleFile(file).then(handleData).catch(console.error);
                return false; // Prevent default upload behavior
            }}
            onDrop={(e) => {
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    handleFile(files[0]).then(handleData).catch(console.error);
                }
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
    );
}