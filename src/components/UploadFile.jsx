"use client"

import {message} from "antd"
import {makePost} from "@/src/utils.jsx";

export default function UploadFile() {
    return <input type="file" id="fileInputCom" accept=".png,.jpg,.jpeg" onChange={validFile}/>
}

export const validFile = () => {
    const fileInput = document.getElementById('fileInputCom')
    const file = fileInput.files[0]
    if (file) {
        if (file.size > 1024 * 1024) {
            message.error("上传的图片不要大于1MB")
            return false
        }
    }
    return true
}

export const getFileBlob = async () => {
    return new Promise((resolve, reject) => {
        const fileInput = document.getElementById('fileInputCom')
        const file = fileInput.files[0]
        if (file) {
            // 将文件转换为Blob对象
            // 读取文件并转换为Base64格式
            const reader = new FileReader();
            reader.onload = function (e) {
                // 裁去data:image/png;base64,
                resolve(e.target.result.slice(22))
            };
            reader.readAsDataURL(file);
        } else {
            resolve(null);
        }
    })
}

export const uploadFile = async () => {
    return new Promise(async (resolve, reject) => {
        const blob = await getFileBlob();
        makePost("/img/upload", {source: blob})
            .then(res => {
                if (res.code === 0) {
                    const imgId = res.data;
                    resolve(imgId);
                } else {
                    reject(res.message)
                }

            })
            .catch(err => {
                reject(err);
            })
    })
}