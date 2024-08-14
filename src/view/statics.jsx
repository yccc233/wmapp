import {useEffect, useRef, useState} from "react";
import {Rate, Statistic} from "antd";
import CountUp from 'react-countup';
import * as echarts from 'echarts';
import {StarFilled, StopFilled} from "@ant-design/icons"


export default function Statics({portal = {}}) {

    const echart2Ref = useRef(null);

    console.log(portal)
    let eventsLength = portal.events?.length || 0
    let risksLength = 0
    let dutier = []
    let group = []
    let level = []
    let dutiersLength = 0
    let dytierDetail = {}
    let groupsLength = 0
    let levelDetail = {}

    if (portal.events) {
        portal.events.forEach(ev => {
            risksLength += ev.risk_list?.length || 0
            ev.risk_list?.forEach(r => {
                dutier.push(r.dutier)
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

    const divRef = useRef()
    const [size, setSize] = useState(0)

    const getSize = () => {
        const width = divRef.current.clientWidth
        setSize(width / 2 - 10)
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
            const chartInstance = echarts.init(echart2Ref.current);
            const option = {
                tooltip: {
                    trigger: 'item'
                }, series: [{
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
            chartInstance.setOption(option);
        }
    }, [size, portal])

    useEffect(() => {
        setTimeout(getSize, 50)
        window.addEventListener('resize', getSize)
        return () => window.removeEventListener('resize', getSize)
    }, [])

    console.log("tongji", {eventsLength, risksLength, dutiersLength, groupsLength, levelDetail, level})
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
            <div className={"item item-2"} style={{width: size, height: size}}>
                <div
                    ref={echart2Ref}
                    style={{width: size, height: size}}
                    id={"statics-item-2"}
                />
            </div>
        </div>
        <div className={"flex1 flex"} style={{justifyContent: "space-between"}}>
            <div className={"item item-3"} style={{width: size, height: size}}>
                <div className={"h_center"} style={{justifyContent: "space-between"}}>
                    <span>
                        {Array.from({length: 5}).map((_, ind) => (
                            <StarFilled key={`star-${5}-${ind}`} className={"mr2"}
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
                              <StarFilled key={`star-${4}-${ind}`} className={"mr2"}
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
                               <StarFilled key={`star-${3}-${ind}`} className={"mr2"}
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
                             <StarFilled key={`star-${2}-${ind}`} className={"mr2"}
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
            <div className={"item"} style={{width: size, height: size}}>

            </div>
        </div>
    </div>
}