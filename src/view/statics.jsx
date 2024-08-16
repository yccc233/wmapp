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
                    const risks = getRiskListFromPortal(portalRef.current, {
                        filterName: "dutier",
                        filterValue: params.name,
                        isEqual: false
                    })
                    dispatch(setPortalDetail({title: `${params.name} 主责项`, visible: true, risks: risks}))
                })
            }
            const option4 = {
                series: [{
                    type: 'wordCloud',
                    /*要绘制的“云”的形状。可以是为回调函数，或一个关键字。
                    可用的形状有(circle)圆形(默认)、(cardioid)心形，(diamond)菱形，(triangle-forward)三角形向前，(triangle)三角形，(pentagon)五边形和(star)星形。*/
                    shape: 'circle',
                    //保持maskImage的宽高比或1:1的形状，他的选项是支持从echarts-wordcloud@2.1.0
                    // keepAspect: false,
                    //一个轮廓图像，其白色区域将被排除在绘制文本之外
                    //意思就是可以通过图片，来自定义词云的形状
                    // maskImage: maskImage,
                    //设置显示区域的位置以及大小
                    left: 'center',
                    top: 'center',
                    right: null,
                    bottom: null,
                    width: '90%',
                    height: '90%',
                    //数据中的值将映射到的文本大小范围。默认大小为最小12px，最大36px。
                    sizeRange: [12, 36],
                    //文本旋转范围和步进度。文本将通过rotationStep:45在[- 90,90]范围内随机旋转
                    rotationRange: [-90, 90],
                    rotationStep: 45,
                    //以像素为单位的网格大小，用于标记画布的可用性
                    //网格尺寸越大，单词之间的间距越大。
                    gridSize: 8,
                    //设置为true，允许文字部分在画布外绘制。
                    //允许绘制大于画布大小的单词
                    //从echarts-wordcloud@2.1.0开始支持此选项
                    drawOutOfBound: false,
                    //如果字体太大而无法显示文本，
                    //是否收缩文本。如果将其设置为false，则文本将不渲染。如果设置为true，则文本将被缩小。
                    //从echarts-wordcloud@2.1.0开始支持此选项
                    shrinkToFit: false,
                    // 执行布局动画。当有大量的单词时，关闭它会导致UI阻塞。
                    layoutAnimation: true,
                    //全局文本样式
                    textStyle: {
                        fontFamily: 'sans-serif',
                        fontWeight: 'bold',
                        // Color可以是一个回调函数或一个颜色字符串
                        color: function () {
                            // Random color
                            return 'rgb(' + [
                                Math.round(Math.random() * 200) + 55,
                                Math.round(Math.random() * 200) + 55,
                                Math.round(Math.random() * 200) + 55
                            ].join(',') + ')'
                        }
                    },
                    emphasis: {
                        focus: 'self',
                        textStyle: {
                            textShadowBlur: 10,
                            textShadowColor: '#333'
                        }
                    },
                    //数据是一个数组。每个数组项必须具有名称和值属性。
                    data: dutierDetail.sort.map(d => ({
                        name: d[0],
                        value: d[1],
                    }))
                }]
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