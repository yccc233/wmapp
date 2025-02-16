"use client"
import {LogoutOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {setUserInfo} from "@/src/store/user/userReducer.jsx";
import {useDispatch, useSelector} from "react-redux";
import {Avatar, Button, Space, Tag, Tooltip} from "antd";
import {getCookie, makePost} from "@/src/utils.jsx";
import {customAvatarCount} from "@/src/config.jsx";

export default function Index() {
    const roleMap = {
        "ROOT": "管理员",
        "USER": "普通用户"
    };
    const bgMap = [{
        "--bg1": "#5c4bd1",
        "--bg2": "#987fef"
    }, {
        "--bg1": "#4eaea8",
        "--bg2": "#7fd6c1"
    }];
    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.userReducer);
    const [appList, setAppList] = useState([]);
    const [avatarPath, setAvatarPath] = useState(null);


    useEffect(() => {
        makePost("/um/getUserInfo").then(res => {
            if (res.data) {
                dispatch(setUserInfo(res.data));
            }
        });

        makePost("/um/getUserAppList").then(res => {
            setAppList(res.data);
        });
        // 设置头像
        const userid = getCookie("userid");
        const avatar = `/img/avatar/avatar-${userid % customAvatarCount + 1}.png`;
        setAvatarPath(avatar);
    }, []);

    const isManage = userInfo.role === "ROOT";

    return <div className={"app-store"}>
        <div className={"role-display"}>
            <div className={"vhcenter flex-column"}>
                <Avatar size={64} src={avatarPath}/>
                <div className={"mt5 v_center"}>
                    {
                        userInfo.role ? <Tooltip title={"登出"} placement={"bottom"}>
                            <LogoutOutlined className={"mr5 pointer"}
                                            onClick={() => window.location.href = "/wmapp/login"}/>
                        </Tooltip> : null
                    }
                    {roleMap[userInfo.role]}
                </div>
            </div>
            <div className={"title-name"}>
                <span className={"app-plat"}>应用台</span>
                <span className={"welcome"}>欢迎回来~</span>
            </div>
        </div>
        <div className={"app-list"}>
            {
                appList.map((item, ind) => (
                    <div key={`app-${ind}`} className={"app-item"}>
                        <div className={"avatar"}>
                            <Avatar size={72} src={`/img/icon/icon-${ind + 1}.svg`}/>
                            {
                                userInfo.role === "ROOT" ?
                                    <div className={"v_center"}>
                                        <Tag color={"gold"} className={"tag"}>管理</Tag>
                                    </div> : null
                            }
                        </div>
                        <div className={"info"}>
                            <div className={"title"} style={bgMap[ind % bgMap.length]}>{item.name}</div>
                            <div className={"flex1"}>
                                <span className={"desc"}>{item.description}</span>
                            </div>
                            <Space>
                                <Button
                                    ghost type={"primary"} className={"go-btn"}
                                    onClick={() => window.location.href = item.url}
                                >
                                    进入应用
                                </Button>
                            </Space>
                        </div>
                    </div>
                ))
            }
        </div>
    </div>;
}