import { setCurrentPortal, setPortals } from "@/src/store/viewReducer";
import { makePost } from "@/src/utils";
import Content from "@/src/view/content";
import Top from "@/src/view/top";
import { Result } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RiskModalCom from "@/src/components/RiskModal.jsx";

export default function Index() {

    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();
    const { portals, currentPortal } = useSelector(state => state.viewReducer)

    useEffect(() => {
        if (loading) {
            makePost("/view/getUserPortals")
                .then(res => {
                    if (res.code === 0) {
                        dispatch(setPortals(res.data))
                        dispatch(setCurrentPortal(res.data[0]))
                        setLoading(false)
                    }
                })
        }
    }, [])

    return <div className={"viewer"}>
        <Top currentId={currentPortal?.portalId} portals={portals} />
        <div style={{ borderBottom: "1px solid #eee", margin: "0px 120px 0px 80px" }} />
        {
            loading ? <div className="flex1 content vhcenter">
                <SyncOutlined className={"mr5"} spin />正在加载...
            </div> :
                portals.length === 0 ? <div className="flex1 content vhcenter">
                    <Result
                        status="404"
                        title="没有门户数据"
                        subTitle="请联系管理员添加门户配置"
                    />
                </div> : <Content portal={currentPortal} />
        }
        <RiskModalCom/>
    </div>
}