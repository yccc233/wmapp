import Logo from "@/src/components/Logo.jsx";
import UserAvatar from "@/src/components/UserAvatar.jsx";
import CustomTabs from "@/src/topview/viewer/customTabs.jsx";
import {useState} from "react";
import GroupInfoDisplay from "./groupInfoDisplay.jsx";

export default function Index() {

    const [currentGroupId, setCurrentGroupId] = useState(-1);

    return <>
        <div className="top-container" style={{height: 72}}>
            <Logo/>
            <CustomTabs groupId={currentGroupId} setGroupId={setCurrentGroupId}/>
            <UserAvatar style={{width: 120}}/>
        </div>
        <div  className={"middle-divider"}/>
        <GroupInfoDisplay groupId={currentGroupId}/>
    </>;
}