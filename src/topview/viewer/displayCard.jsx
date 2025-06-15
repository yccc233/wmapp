import { useEffect, useRef, useState } from "react";
import { getRandomColor, makePost } from "@/src/utils.jsx";
import { Empty } from "antd";
import { TeamOutlined } from "@ant-design/icons";


export const DisplayCard1 = ({ classList, month }) => {

    const [displayData, setDisplayData] = useState([]);

    const getSort = (rankInd) => {
        if (rankInd < 4) {
            return <img width={36} src={`/img/topview/sort-${rankInd}.png`} alt={"排名"}/>;
        } else {
            return rankInd;
        }
    };

    useEffect(() => {
        if (classList.length > 0) {
            makePost("/topview/getChartData1", { classIdList: classList.map(c => c.class_id), month })
                .then(res => {
                    if (res.code === 0) {
                        let _displayData = res.data.slice(0, 3);
                        Array.from({ length: _displayData.length < 3 ? 3 - _displayData.length : 0 }).forEach(() => {
                            _displayData.push({});
                        });
                        setDisplayData(_displayData);
                    }
                });
        } else {
            setDisplayData([]);
        }
    }, [classList, month]);

    return <div className={"board"}>
        <div className={"title"}>班组排名</div>
        <div className={"display-1"}>
            <div className={"line line-top"}>
                <div className={"line-item"} style={{ width: 72, flex: "unset" }}>排名</div>
                <div className={"line-item"} style={{ width: 150, flex: "unset" }}>班组</div>
                <div className={"line-item"}>人员数</div>
                <div className={"line-item"}>平均分</div>
                <div className={"line-item"}>最高分</div>
                <div className={"line-item"}>最低分</div>
            </div>
            {
                displayData.map((item, ind) => {
                    return <div key={`display-1-${ind}`} className={"line"}>
                        {
                            item.class_name ? <>
                                <div className={"line-item"} style={{ width: 72, flex: "unset" }}>{getSort(ind + 1)}</div>
                                <div className={"line-item"} style={{ width: 150, flex: "unset" }}>{item.group_name} / {item.class_name}</div>
                                <div className={"line-item"}><TeamOutlined className={"mr2"}/>{item.persons_count}</div>
                                <div className={"line-item"}>{item.avg_score}</div>
                                <div className={"line-item"}>{item.max_score}</div>
                                <div className={"line-item"}>{item.min_score}</div>
                            </> : null
                        }
                    </div>;
                })
            }
        </div>
    </div>;
};


export const DisplayCard2 = ({ classList, month }) => {
    const domRef = useRef(null);
    const echartsRef = useRef(null);

    useEffect(() => {
        if (classList.length > 0) {
            makePost("/topview/getChartData2", { classIdList: classList.map(c => c.class_id), startMonth: month })
                .then(res => {
                    if (res.code === 0) {
                        if (!echartsRef.current) {
                            echartsRef.current = echarts.init(domRef.current);
                        }

                        const legendData = res.data.items.map(eachClass => eachClass.label_name);
                        // 配置 ECharts 选项
                        const option = {
                            grid: {
                                left: "5%",
                                right: "5%",
                                top: "20%",
                                bottom: "10%"
                            },
                            legend: {
                                data: legendData.length > 3 ? [] : legendData,
                                textStyle: {
                                    color: "white" // 设置图例文字颜色为白色
                                },
                                top: 0,
                                right: "4%"
                            },
                            tooltip: {
                                trigger: "axis", // 触发类型为坐标轴触发
                                axisPointer: {
                                    type: "cross", // 指示器类型为十字准星
                                    crossStyle: {
                                        color: "#999" // 十字准星颜色
                                    }
                                },
                                textStyle: {
                                    color: "white" // 设置 tooltip 文字颜色为白色
                                },
                                backgroundColor: "rgba(0, 0, 0, 0.7)" // 设置 tooltip 背景颜色
                            },
                            xAxis: {
                                type: "category",
                                data: res.data.months,
                                axisLabel: {
                                    color: "white" // 设置 X 轴标签字体颜色为白色
                                }
                            },
                            yAxis: {
                                type: "value",
                                min: res.data.minScore - 5,
                                max: res.data.maxScore < 95 ? res.data.maxScore + 5 : 100,
                                splitLine: {
                                    show: true,
                                    lineStyle: {
                                        color: "#004488"
                                    }
                                },
                                axisLabel: {
                                    color: "white" // 设置 X 轴标签字体颜色为白色
                                },
                                confine: true
                            },
                            series: res.data.items.map(eachClass => ({
                                type: "line",
                                name: eachClass.label_name,
                                data: eachClass.data.map(d => d.avg_score)
                            }))
                        };
                        // 使用刚指定的配置项和数据显示图表。
                        echartsRef.current.setOption(option);
                    }
                });
        }
    }, [classList, month]);

    return <div className={"board"}>
        <div className={"title"}>排名趋势</div>
        <div className={"display-2"}>
            <div ref={domRef} style={{ width: "100%", height: "100%" }}/>
        </div>
    </div>;
};


export const DisplayCard3 = ({ groupId, month }) => {

    const domRef = useRef(null);
    const echartsRef = useRef(null);

    const [empty, setEmpty] = useState(false);

    useEffect(() => {
        if (groupId) {
            makePost("/topview/getChartData3", { groupId: groupId, month: month })
                .then(res => {
                    if (res.code === 0) {
                        const values = res.data.map(d => ({
                            name: d.label_name,
                            value: d.dedScore
                        }));
                        if (!echartsRef.current) {
                            echartsRef.current = echarts.init(domRef.current);
                        }
                        const option = {
                            tooltip: {
                                show: true,
                                formatter: function (params) {
                                    return `共扣除 ${params.value} 分`;
                                }
                            },
                            grid: {
                                left: "5%",
                                right: "5%",
                                top: "5%",
                                bottom: "5%"
                            },
                            series: [
                                {
                                    type: "wordCloud",
                                    sizeRange: [14, 48],
                                    rotationRange: [0, 90],
                                    shape: "square",
                                    layoutAnimation: true,
                                    textStyle: {
                                        color: getRandomColor
                                    },
                                    emphasis: {
                                        focus: "self",
                                        textStyle: {
                                            textShadow: "0 0 3px 5px #eeeeee"
                                        }
                                    },
                                    data: values
                                }
                            ]
                        };
                        echartsRef.current.setOption(option);
                        setEmpty(values.length === 0);
                    }
                });
        }
    }, [groupId, month]);

    return <div className={"board"}>
        <div className={"title"}>扣分大类</div>
        <div className={"display-3"}>
            {
                empty ? <div className="full vhcenter" style={{ position: "absolute" }}>
                    <Empty
                        image="/img/topview/empty.svg"
                        description={<span className={"white"}>暂无数据</span>}
                    />
                </div> : null
            }
            <div ref={domRef} style={{ width: "100%", height: "100%" }}/>
        </div>
    </div>;
};

