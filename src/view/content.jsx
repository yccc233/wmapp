import CtnMain from "@/src/view/ctnMain"
import SuffixPortal from "@/src/view/suffixPortal.jsx";

export default function Content({portal}) {

    return <div className="flex1 content">
        <div className="left-content" style={{width: 350}}>
            <SuffixPortal portal={portal}/>
        </div>
        <div className="right-content">
            <CtnMain portal={portal}/>
        </div>
    </div>
}