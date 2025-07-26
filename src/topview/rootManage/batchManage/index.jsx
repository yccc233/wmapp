import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import HandleImportModal from "@/src/topview/rootManage/batchManage/handleImportModal.jsx";
import { useState } from "react";



export default function Index() {
    const [excelImportFlag, setExcelImportFlag] = useState(false);

    return <>
        <Button type={"primary"} ghost style={{ marginLeft: 100 }}
                icon={<UploadOutlined className={"mr5"}/>}
                onClick={() => setExcelImportFlag(!excelImportFlag)}>
            批量导入
        </Button>
        <HandleImportModal
            visible={excelImportFlag}
            close={() => setExcelImportFlag(false)}
        />
    </>;
}