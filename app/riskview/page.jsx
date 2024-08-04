"use client"
import Viewer from "@/src/view"
import "@/styles/viewer.scss"
import {getCookie} from "@/src/utils.jsx";

export default function Page() {

    const userId = getCookie("userid");

    if (!userId) {
        if (window && window.location) {
            window.location.href = '/riskview/login';
        }
        return null;
    }

    return <Viewer/>;
}
