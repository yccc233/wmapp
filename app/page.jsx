"use client"
import {useRouter} from "next/navigation.js"
import {useEffect} from "react";


export default function Page() {
    const router = useRouter();

    useEffect(() => {
        if (router) {
            router.replace('/riskview');
        }
    }, []);


    return <div>
        正在重定向至/riskview
    </div>
}
