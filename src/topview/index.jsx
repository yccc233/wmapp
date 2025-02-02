import {useEffect, useState} from "react";
import {makePost} from "@/src/utils.jsx";
import {setUserInfo} from "@/src/store/user/userReducer.jsx";
import {useDispatch} from "react-redux";
import Viewer from "./viewer";
import Manage from "./manage";

export default function Index() {
    const dispatch = useDispatch();
    const [myRole, setMyRole] = useState(null);

    useEffect(() => {
        makePost("/um/getUserInfo").then(res => {
            if (res.data) {
                dispatch(setUserInfo(res.data));
                setMyRole(res.data.role);
            }
        });
    }, []);

    return <div className={"top-view"}>
        {myRole === "USER" ? <Viewer/> : null}
        {myRole === "ROOT" ? <Manage/> : null}
    </div>;
}