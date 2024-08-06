import Top from "@/src/view/top";
import Content from "@/src/view/content";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setPortals } from "@/src/store/viewReducer"

export default function Index() {

    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();
    const viewReducer = useSelector(state => state.viewReducer)

    useEffect(() => {
        if (loading) {
            //get sss
            const myConfigsFromServer = [{
                title: "测试"
            }]
            dispatch(setPortals(myConfigsFromServer))
            setLoading(false)
        }
    }, [])

    console.log(viewReducer);


    return <div className={"viewer"}>
        <Top />
        <div style={{ borderBottom: "1px solid #eee", margin: "0px 120px 0px 80px" }} />
        {
            loading ? <div className="flex1 content">

            </div> : <Content />
        }
    </div>
}