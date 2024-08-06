"use client"
import { Avatar, Dropdown } from "antd";
import { CaretDownOutlined } from "@ant-design/icons"
import { getCookie } from "@/src/utils";
import { useEffect, useState } from "react"


export default function UserAvatar({ style }) {

    const [mySelf, setMySelf] = useState({
        username: null,
        avatar: null
    })

    useEffect(() => {
        const userid = getCookie("userid")
        const username = getCookie("username")
        const avatar = `/img/avatar/avatar-${userid % 7 + 1}.png`

        setMySelf({
            username: username,
            avatar: avatar
        });
    }, []);

    const logout = () => {
        window.location.href = "/riskview/login"
    }

    return <div className="user-avatar" style={style}>
        <div>
            <Avatar src={mySelf.avatar} size={46} />
        </div>
        <div>
            <Dropdown
                menu={{
                    items: [{
                        key: '1',
                        label: (
                            <a onClick={logout}>
                                登出
                            </a>
                        )
                    }]
                }}
                placement="bottom"
            >
                <span className="fs12">
                    {mySelf.username}
                    <CaretDownOutlined />
                </span>
            </Dropdown>
        </div>
    </div >
}