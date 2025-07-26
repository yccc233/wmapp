import { Button } from "antd";
import { RedoOutlined } from "@ant-design/icons";


export default function RevokeScore() {

    return <>
        <Button className={"ml20"} type={"primary"} danger icon={<RedoOutlined/>}>撤销管理</Button>
    </>;
}