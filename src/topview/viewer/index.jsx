import Logo from "@/src/components/Logo.jsx";
import Time from "@/src/components/Time.jsx";
import UserAvatar from "@/src/components/UserAvatar.jsx";
import CustomTabs from "@/src/topview/viewer/customTabs.jsx";
import {useState} from "react";

export default function Index() {

    const [currentGroupId, setCurrentGroupId] = useState("-1");

    return <>
        <div className="top-container" style={{height: 72}}>
            <Logo/>
            <CustomTabs groupId={currentGroupId} setGroupId={setCurrentGroupId}/>
            <Time/>
            <UserAvatar style={{width: 120}}/>
        </div>
        <div className="content-container">
            {currentGroupId}
        </div>
    </>;
}