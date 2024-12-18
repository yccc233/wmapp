"use client"
import UploadFile, {uploadFile} from "@/src/components/UploadFile.jsx";
import {Button} from "antd";

export default function Index() {
    const up = async () => {
        uploadFile();
    }

    return <div className={"root-manage"}>
        <UploadFile/>
        <Button onClick={up}>上传</Button>
    </div>
}