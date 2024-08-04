"use client"
import {useEffect} from "react";


export default function Page() {

    useEffect(() => {
        if (window && window.location) {
            window.location.href = '/riskview';
        }
    }, []);


    return <div>
        正在跳转页面
    </div>
}
