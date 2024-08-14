import CtnMain from "@/src/view/ctnMain"
import SuffixPortal from "@/src/view/suffixPortal.jsx";
import Statics from "@/src/view/statics.jsx";

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