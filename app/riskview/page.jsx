"use client"
import Viewer from "@/src/view"
import "@/styles/viewer.scss"
import {getCookie} from "@/src/utils.jsx";
import {useRouter} from "next/navigation.js"

export default function Page() {
    const router = useRouter();


    const userId = getCookie("userid");

    if (!userId) {
        router.replace('/riskview/login');
        return null;
    }

    return <Viewer/>;
}
