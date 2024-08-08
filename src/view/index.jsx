import Top from "@/src/view/top";
import Content from "@/src/view/content";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setCurrentPortal, setPortals } from "@/src/store/viewReducer"

export default function Index() {

    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();
    const { portals, currentPortal } = useSelector(state => state.viewReducer)

    useEffect(() => {
        if (loading) {
            //get sss test
            const myConfigsFromServer = [{
                "portalId": "2",
                "portalTitle": "出口段",
                "portalStaus": 1,
                "portalImg": "MRMLZNGNYVRTWZZFSPKS",
                "commentTime": "2024-07-18",
                "commentMemebers": "a,v,d,d",
                "events": [
                    {
                        "eventTitle": "钢卷小车",
                        "eventPoint": [
                            20,
                            30
                        ],
                        "pointRadius": 10,
                        "lineswidth": 10,
                        "linecolor": "#ff0000",
                        "risklist": [
                            {
                                "title": "XXX故障",
                                "img": "LKDLUNBOQGZMBMDCPUEG",
                                "level": 3,
                                "dutier": "胖子",
                                "consequence": "可能造成停机",
                                "measure": "整体更换（周期）"
                            }
                        ]
                    },
                    {
                        "eventTitle": "钢卷da车",
                        "eventPoint": [
                            68,
                            35
                        ],
                        "pointRadius": 15,
                        "lineswidth": 12,
                        "linecolor": "#ff0000",
                        "risklist": [
                            {
                                "title": "XXX故障",
                                "img": "LKDLUNBOQGZMBMDCPUEG",
                                "level": 3,
                                "dutier": "胖子",
                                "consequence": "可能造成停机",
                                "measure": "整体更换（周期）"
                            }
                        ]
                    }
                ]
            }, {
                "portalId": "4",
                "portalTitle": "测试123",
                "portalStaus": 1,
                "portalImg": "7687699",
                "commentTime": "2024-07-18",
                "commentMemebers": "a,v,d,d",
                "events": [
                    {
                        "eventTitle": "钢卷小车",
                        "eventPoint": [
                            12,
                            16
                        ],
                        "pointRadius": 2.4,
                        "lineswidth": 5,
                        "linecolor": "#ff0000",
                        "risklist": [
                            {
                                "title": "XXX故障",
                                "img": "345345",
                                "level": 3,
                                "dutier": "胖子",
                                "consequence": "可能造成停机",
                                "measure": "整体更换（周期）"
                            }
                        ]
                    }
                ]
            }, {
                "portalId": "6",
                "portalTitle": "测试adasd",
                "portalStaus": 1,
                "portalImg": "7687699",
                "commentTime": "2024-07-18",
                "commentMemebers": "a,v,d,d",
                "events": [
                    {
                        "eventTitle": "钢卷小车",
                        "eventPoint": [
                            12,
                            16
                        ],
                        "pointRadius": 2.4,
                        "lineswidth": 5,
                        "linecolor": "#ff0000",
                        "risklist": [
                            {
                                "title": "XXX故障",
                                "img": "345345",
                                "level": 3,
                                "dutier": "胖子",
                                "consequence": "可能造成停机",
                                "measure": "整体更换（周期）"
                            }
                        ]
                    }
                ]
            }]
            dispatch(setPortals(myConfigsFromServer))
            dispatch(setCurrentPortal(myConfigsFromServer[0]))
            setLoading(false)
        }
    }, [])

    return <div className={"viewer"}>
        <Top currentId={currentPortal?.portalId} portals={portals} />
        <div style={{ borderBottom: "1px solid #eee", margin: "0px 120px 0px 80px" }} />
        {
            currentPortal ? <Content portal={currentPortal} /> :
                <div className="flex1 content">

                </div>
        }
    </div>
}