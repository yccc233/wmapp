import CtnMain from "@/src/view/ctnMain"
import { useSelector } from 'react-redux';


export default function Content() {

    const viewReducer = useSelector(state => state.viewReducer)

    return <div className="flex1 content">
        <div className="left-content" style={{ width: 200 }}>

        </div>
        <div className="right-content">
            <CtnMain />
        </div>
    </div>
}