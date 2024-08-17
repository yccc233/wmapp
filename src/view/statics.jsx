'use client'
import {useEffect, useRef, useState} from "react";
import {Statistic} from "antd";
import CountUp from 'react-countup';
import {StarFilled, StopFilled} from "@ant-design/icons"
import {useDispatch} from "react-redux";
import {setPortalDetail} from "@/src/store/viewReducer.jsx";
import {getRiskListFromPortal} from "@/src/components/RiskModal.jsx";

export default function Statics({portal = {}}) {

    const portalRef = useRef()
    portalRef.current = portal

    const echart2Ref = useRef(null)
    const echart4Ref = useRef(null)
    const chartInstanceRef2 = useRef(null)
    const chartInstanceRef4 = useRef(null)

    const dispatch = useDispatch()

    let eventsLength = portal.events?.length || 0
    let risksLength = 0
    let dutier = []
    let group = []
    let level = []
    let dutiersLength = 0
    let dutierDetail = {}
    let groupsLength = 0
    let levelDetail = {}

    if (portal.events) {
        portal.events.forEach(ev => {
            risksLength += ev.risk_list?.length || 0
            ev.risk_list?.forEach(r => {
                dutier = dutier.concat(r.dutier.split("、"))
                group.push(r.group)
                level.push(r.level)
            })
        })
    }

    dutiersLength = Array.from(new Set(dutier)).length
    groupsLength = Array.from(new Set(group)).length

    level.forEach(l => {
        levelDetail[l] = levelDetail[l] ? levelDetail[l] + 1 : 1
    })
    dutier.forEach(d => {
        dutierDetail[d] = dutierDetail[d] ? dutierDetail[d] + 1 : 1;
    })
    dutierDetail.sort = Object.entries(dutierDetail).sort((a, b) => b[1] - a[1])


    const divRef = useRef()
    const [size, setSize] = useState(0)

    const getSize = () => {
        const width = divRef.current.clientWidth
        setSize(width / 2 - 10)
        return width / 2 - 10
    }

    useEffect(() => {
        if (size > 0 && echart2Ref.current) {
            const types = {}
            group.forEach(g => {
                if (types[g]) {
                    types[g].value++
                } else {
                    types[g] = {
                        name: g, value: 1
                    }
                }
            })
            if (!chartInstanceRef2.current) {
                chartInstanceRef2.current = echarts.init(echart2Ref.current);
                chartInstanceRef2.current.on('click', function (params) {
                    const risks = getRiskListFromPortal(portalRef.current, {
                        filterName: "group",
                        filterValue: params.name
                    })
                    dispatch(setPortalDetail({title: `${params.name} 风险`, visible: true, risks: risks}))
                })
            }
            const option2 = {
                tooltip: {
                    trigger: 'item'
                },
                series: [{
                    name: '分类统计',
                    type: 'pie',
                    radius: ['45%', '75%'],
                    avoidLabelOverlap: false,
                    padAngle: 5,
                    itemStyle: {
                        borderRadius: 8
                    },
                    label: {
                        show: true, // 设置为 true 以显示标签
                        position: 'inner', color: '#f1f1f1', // 设置标签字体颜色
                        fontSize: 16, // 可以根据需要调整字体大小
                        formatter: '{b}' // 格式化标签内容，{b} 是名称，{c} 是数值，{d}% 是百分比
                    },
                    emphasis: {
                        label: {
                            show: true, color: '#05fafa', // 设置标签字体颜色
                            fontSize: 24, fontWeight: 'bold'
                        }
                    },
                    data: Object.values(types)
                }]
            }
            chartInstanceRef2.current.setOption(option2)
        }
        if (size > 0 && echart4Ref.current) {
            if (!chartInstanceRef4.current) {
                chartInstanceRef4.current = echarts.init(echart4Ref.current);
                chartInstanceRef4.current.on('click', function (params) {
                    let risks = getRiskListFromPortal(portalRef.current)
                    risks = risks.filter(r => r.event.indexOf(params.name) > -1)
                    dispatch(setPortalDetail({title: `${params.name} 风险`, visible: true, risks: risks}))
                })
            }

            const eventsTitle = []
            portal?.events.forEach(e => {
                const e_r = {title: e.event_title, risksLength: e.risk_list?.length}
                eventsTitle.push(e_r)
            })
            eventsTitle.sort((a, b) => b.risksLength - a.risksLength)

            const option4 = {
                polar: {
                    radius: [20, '75%']
                },
                radiusAxis: {
                    max: eventsTitle[0]?.risksLength || 1,
                    splitNumber: ((eventsTitle[0]?.risksLength || 2) / 2).toFixed(),
                    splitLine: {
                        lineStyle: {
                            color: "#333",
                        }
                    }
                },
                angleAxis: {
                    show: false,
                    type: 'category',
                    data: eventsTitle.map(e => e.title),
                    startAngle: 90
                },
                tooltip: {},
                series: {
                    type: 'bar',
                    data: eventsTitle.map(e => e.risksLength),
                    coordinateSystem: 'polar',
                },
                animation: true
            }
            chartInstanceRef4.current.setOption(option4);
        }
    }, [size, portal])

    useEffect(() => {
        getSize()
        setTimeout(getSize, 50)
        if (typeof window === "object") {
            window.addEventListener('resize', getSize)
            return () => window.removeEventListener('resize', getSize)
        }
    }, [])

    return <div className={"statics"} ref={divRef}>
        <div className={"flex1 flex"} style={{justifyContent: "space-between"}}>
            <div className={"item item-1"} style={{width: size, height: size}}>
                <div className={"item-box"}>
                    <div className={"title"}>失效点</div>
                    <div className={"number"}>
                        <Statistic
                            valueStyle={{fontSize: 14}}
                            value={eventsLength}
                            formatter={value => <>
                                <CountUp end={value} separator=","/>
                                <span className={"ml3"}>处</span>
                            </>}
                        />
                    </div>
                </div>
                <div className={"item-box"}>
                    <div className={"title"}>风险数</div>
                    <div className={"number"}>
                        <Statistic
                            valueStyle={{fontSize: 14}}
                            value={risksLength}
                            formatter={value => <>
                                <CountUp end={value} separator=","/>
                                <span className={"ml3"}>个</span>
                            </>}
                        />
                    </div>
                </div>
                <div className={"item-box"}>
                    <div className={"title"}>分类数</div>
                    <div className={"number"}>
                        <Statistic
                            valueStyle={{fontSize: 14}}
                            value={groupsLength}
                            formatter={value => <>
                                <CountUp end={value} separator=","/>
                                <span className={"ml3"}>个</span>
                            </>}
                        />
                    </div>
                </div>
                <div className={"item-box"}>
                    <div className={"title"}>责任人数</div>
                    <div className={"number"}>
                        <Statistic
                            valueStyle={{fontSize: 14}}
                            value={dutiersLength}
                            formatter={value => <>
                                <CountUp end={value} separator=","/>
                                <span className={"ml3"}>个</span>
                            </>}
                        />
                    </div>
                </div>
            </div>
            <div className={"item item-3"} style={{width: size, height: size}}>
                <div className={"h_center"} style={{justifyContent: "space-between"}}>
                    <span>
                        {Array.from({length: 5}).map((_, ind) => (
                            <StarFilled key={`star-${5}-${ind}`} className={"mr1"}
                                        style={{color: levelDetail[5] ? "#fadb14" : "#aaa"}}/>
                        ))}
                    </span>
                    <Statistic
                        valueStyle={{fontSize: 16, color: "#f1f1f1"}}
                        value={levelDetail[5] || 0}
                        formatter={value => <>
                            <CountUp end={value} separator=","/>
                            <span className={"ml3"}>个</span>
                        </>}
                    />
                </div>
                <div className={"h_center"} style={{justifyContent: "space-between"}}>
                    <span>
                          {Array.from({length: 4}).map((_, ind) => (
                              <StarFilled key={`star-${4}-${ind}`} className={"mr1"}
                                          style={{color: levelDetail[4] ? "#fadb14" : "#aaa"}}/>
                          ))}
                    </span>
                    <Statistic
                        valueStyle={{fontSize: 16, color: "#f1f1f1"}}
                        value={levelDetail[4] || 0}
                        formatter={value => <>
                            <CountUp end={value} separator=","/>
                            <span className={"ml3"}>个</span>
                        </>}
                    />
                </div>
                <div className={"h_center"} style={{justifyContent: "space-between"}}>
                    <span>
                           {Array.from({length: 3}).map((_, ind) => (
                               <StarFilled key={`star-${3}-${ind}`} className={"mr1"}
                                           style={{color: levelDetail[3] ? "#fadb14" : "#aaa"}}/>
                           ))}
                    </span>
                    <Statistic
                        valueStyle={{fontSize: 16, color: "#f1f1f1"}}
                        value={levelDetail[3] || 0}
                        formatter={value => <>
                            <CountUp end={value} separator=","/>
                            <span className={"ml3"}>个</span>
                        </>}
                    />
                </div>
                <div className={"h_center"} style={{justifyContent: "space-between"}}>
                    <span>
                         {Array.from({length: 2}).map((_, ind) => (
                             <StarFilled key={`star-${2}-${ind}`} className={"mr1"}
                                         style={{color: levelDetail[2] ? "#fadb14" : "#aaa"}}/>
                         ))}
                    </span>
                    <Statistic
                        valueStyle={{fontSize: 16, color: "#f1f1f1"}}
                        value={levelDetail[2] || 0}
                        formatter={value => <>
                            <CountUp end={value} separator=","/>
                            <span className={"ml3"}>个</span>
                        </>}
                    />
                </div>
                <div className={"h_center"} style={{justifyContent: "space-between"}}>
                    <span>
                         <StarFilled style={{color: levelDetail[1] ? "#fadb14" : "#aaa"}}/>
                    </span>
                    <Statistic
                        valueStyle={{fontSize: 16, color: "#f1f1f1"}}
                        value={levelDetail[1] || 0}
                        formatter={value => <>
                            <CountUp end={value} separator=","/>
                            <span className={"ml3"}>个</span>
                        </>}
                    />
                </div>
                <div className={"h_center"} style={{justifyContent: "space-between"}}>
                    <span>
                        <StopFilled style={{fontSize: 13, color: levelDetail[0] ? "#fadb14" : "#aaa"}}/>
                    </span>
                    <Statistic
                        valueStyle={{fontSize: 16, color: "#f1f1f1"}}
                        value={levelDetail[0] || 0}
                        formatter={value => <>
                            <CountUp end={value} separator=","/>
                            <span className={"ml3"}>个</span>
                        </>}
                    />
                </div>
            </div>
        </div>
        <div className={"flex1 flex"} style={{justifyContent: "space-between"}}>
            <div className={"item item-2"} style={{width: size, height: size}}>
                <div
                    ref={echart2Ref}
                    style={{width: size, height: size}}
                    id={"statics-item-2"}
                />
            </div>
            <div className={"item item-4"} style={{width: size, height: size}}>
                <div
                    ref={echart4Ref}
                    style={{width: size, height: size}}
                    id={"statics-item-4"}
                />
            </div>
        </div>
    </div>
}