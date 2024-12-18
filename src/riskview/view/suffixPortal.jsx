import {AlertOutlined, BugOutlined, CodeSandboxOutlined} from "@ant-design/icons"
import {Space} from "antd";
import {useDispatch} from "react-redux";
import {setPortalDetail} from "@/src/store/riskview/viewReducer.jsx";
import {getRiskListFromPortal} from "@/src/components/RiskModal.jsx";

export default function SuffixPortal({portal}) {

    const dispatch = useDispatch()

    const showModal = (type) => {
        if (type === "status") {
            const risks = getRiskListFromPortal(portal)
            dispatch(setPortalDetail({title: "状态风险", visible: true, risks: risks}))
        } else if (type === "safe") {
            dispatch(setPortalDetail({title: "安全风险", visible: true, risks: []}))
        } else {
            dispatch(setPortalDetail({title: "质量风险", visible: true, risks: []}))
        }
    }

    return <>
        <Space className={"suffix-portal"} direction="vertical" size={"large"}>
            <button className={"suffix-btn"} onClick={() => showModal("status")}>
                <CodeSandboxOutlined className={"mr10"}/>
                状态风险
            </button>
            <button className={"suffix-btn ml10"} onClick={() => showModal("safe")}>
                <AlertOutlined className={"mr10"}/>
                安全风险
            </button>
            <button className={"suffix-btn ml20"} onClick={() => showModal("qa")}>
                <BugOutlined className={"mr10"}/>
                质量风险
            </button>
        </Space>
    </>
}
