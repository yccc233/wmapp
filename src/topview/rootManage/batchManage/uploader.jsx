import { message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { useState } from "react";


/**
 * @param startLineKey          开始处理的关键字
 * @param readCallBack          最终返回一个对象数组
 */
export default function Uploader({ startLineKey = "时间范围", readCallBack }) {

    const [fileInfo, setFileInfo] = useState(null);

    const handleData = (data) => {
        let startLineFlag = false, fieldProps = null;
        const results = [];

        for (let i = 0; i < data.length; i++) {
            const lineArray = data[i];
            if (lineArray.length === 0) {
                continue;
            }
            if (startLineFlag) {
                const item = {};
                for (let j = 0; j < fieldProps.length; j++) {
                    item[fieldProps[j]] = (lineArray[j] || "").toString().trim();
                }
                results.push(item);
            } else {
                const lineContent = lineArray.join(".");
                if (lineContent.indexOf(startLineKey) > -1) {
                    startLineFlag = true;
                    fieldProps = data[++i];
                }
            }
        }
        setFileInfo(prev => ({ ...prev, counts: results.length }));
        typeof readCallBack === "function" && readCallBack(results);
    };

    const handleFile = (file) => {
        setFileInfo({ file: file, fileName: file.name });
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: "array" });
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
                return false;
            }}
            onDrop={(e) => {
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    handleFile(files[0]).then(handleData).catch(console.error);
                }
            }}
        >
            <p className="ant-upload-text">点击或拖拽文件到此区域</p>
            <p className="ant-upload-hint">
                仅支持excel文件类型上传，注意不可重复导入，扣除分数会进行累加！
            </p>
            <p className="ant-upload-hint">
                {
                    fileInfo ?
                        <span>
                            上传文件“<span style={{ color: "#1890ff", fontWeight: "bold" }}>{fileInfo.fileName}</span>”
                        </span>
                        : <span>暂无上传文件</span>
                }
            </p>
        </Upload.Dragger>
    );
}