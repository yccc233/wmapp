"use client"
import {useEffect} from "react"

export default function Page() {

    useEffect(() => {
        if (typeof window === "object" && window.location) {
            window.location.href = '/wmapp/appstore';
        }
    }, []);

    return <div>
        正在跳转页面
    </div>;
}
