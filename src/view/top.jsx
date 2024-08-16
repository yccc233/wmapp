'use client'
import Logo from "@/src/components/Logo";
import Time from "@/src/components/Time";
import UserAvatar from "@/src/components/UserAvatar";
import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentPortal } from "@/src/store/viewReducer";


export default function Top({ currentId, portals }) {

    const [tabs, setTabs] = useState(null);
    const dispatch = useDispatch()

    const changePortal = (nextId) => {
        const nextPortal = portals.find(p => p.portal_id === nextId)
        if (nextPortal) {
            dispatch(setCurrentPortal(nextPortal))
        }
    }

    useEffect(() => {
        if (portals?.length > 0) {
            const items = portals.map(p => ({
                key: p.portal_id,
                label: p.portal_title,
            }))
            setTabs(items)
        }
    }, [portals])

    return <div style={{ height: 80 }} className="flex view-top">
        <Logo />
        <div className="flex1 flex">
            <Tabs size="large" items={tabs} onChange={changePortal} />
        </div>
        <Time />
        <UserAvatar style={{ width: 120 }} />
    </div>
}