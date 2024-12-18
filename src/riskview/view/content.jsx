'use client'
import CtnMain from "@/src/riskview/view/ctnMain.jsx"
import SuffixPortal from "@/src/riskview/view/suffixPortal.jsx";
import Statics from "@/src/riskview/view/statics.jsx";

export default function Content({portal}) {

    return <div className="flex1 content">
        <div className="left-content" style={{width: 400}}>
            <Statics portal={portal}/>
            <SuffixPortal portal={portal}/>
        </div>
        <div className="right-content">
            <CtnMain portal={portal}/>
        </div>
    </div>
}