import {useRef, useEffect, useState} from 'react'
import {makePost} from "@/src/utils.jsx";

export const DisplayCard1 = ({classList, month}) => {

    const [displayData, setDisplayData] = useState([]);

    useEffect(() => {
        if (classList.length > 0) {
            makePost("/topview/getChartData1", {classIdList: classList.map(c => c.class_id), month})
                .then(res => {
                    if (res.code === 0) {
                        let _displayData = res.data;
                        Array.from({length: _displayData.length < 3 ? 3 - _displayData.length : 0}).forEach(() => {
                            _displayData.push({});
                        });
                        setDisplayData(res.data);
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
                <div className={"line-item"}>排名</div>
                <div className={"line-item"}>班组</div>
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
                                <div className={"line-item"}>{ind + 1}</div>
                                <div className={"line-item"}>{item.class_name}</div>
                                <div className={"line-item"}>{item.persons_count}</div>
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


export const DisplayCard2 = ({classList, month}) => {
    const domRef = useRef(null);
    const echartsRef = useRef(null);

    useEffect(() => {
        if (classList.length > 0) {
            makePost("/topview/getChartData2", {classIdList: classList.map(c => c.class_id), startMonth: month})
                .then(res => {
                    if (res.code === 0) {
                        if (!echartsRef.current) {
                            echartsRef.current = echarts.init(domRef.current);
                        }
                        // 配置 ECharts 选项
                        const option = {
                            grid: {
                                left: '5%',
                                right: '5%',
                                top: '20%',
                                bottom: '10%'
                            },
                            legend: {
                                data: res.data.items.map(eachClass => eachClass.class_name),
                                textStyle: {
                                    color: 'white' // 设置图例文字颜色为白色
                                },
                                top: 0,
                                right: '4%'
                            },
                            tooltip: {
                                trigger: 'axis', // 触发类型为坐标轴触发
                                axisPointer: {
                                    type: 'cross', // 指示器类型为十字准星
                                    crossStyle: {
                                        color: '#999' // 十字准星颜色
                                    }
                                },
                                textStyle: {
                                    color: 'white' // 设置 tooltip 文字颜色为白色
                                },
                                backgroundColor: 'rgba(0, 0, 0, 0.7)' // 设置 tooltip 背景颜色
                            },
                            xAxis: {
                                type: 'category',
                                data: res.data.months,
                                axisLabel: {
                                    color: 'white' // 设置 X 轴标签字体颜色为白色
                                }
                            },
                            yAxis: {
                                type: 'value',
                                min: res.data.minScore - 5,
                                max: res.data.maxScore < 95 ? res.data.maxScore + 5 : 100,
                                splitLine: {
                                    show: true,
                                    lineStyle: {
                                        color: '#004488'
                                    }
                                },
                                axisLabel: {
                                    color: 'white' // 设置 X 轴标签字体颜色为白色
                                },
                                confine: true
                            },
                            series: res.data.items.map(eachClass => ({
                                type: 'line',
                                name: eachClass.class_name,
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
            <div ref={domRef} style={{width: '100%', height: '100%'}}/>
        </div>
    </div>;
};


export const DisplayCard3 = ({groupId, month}) => {

    const domRef = useRef(null);
    const echartsRef = useRef(null);

    useEffect(() => {
        if (groupId) {
            makePost("/topview/getChartData3", {groupId: groupId, month: month})
                .then(res => {
                    if (res.code === 0) {
                        const values = res.data.map(d => ({
                            name: d.label_name,
                            value: d.dedScore
                        }));
                        if (!echartsRef.current) {
                            echartsRef.current = echarts.init(domRef.current);
                        }
                        // 生成随机颜色的函数
                        function getRandomColor() {
                            const letters = '0123456789ABCDEF';
                            let color = '#';
                            for (let i = 0; i < 6; i++) {
                                color += letters[Math.floor(Math.random() * 16)];
                            }
                            return color;
                        }
                        const option = {
                            series: [
                                {
                                    type: 'wordCloud',
                                    // 词云图的大小范围
                                    sizeRange: [12, 60],
                                    // 词云图的旋转角度范围，这里不旋转
                                    rotationRange: [0, 0],
                                    // 词云图的形状，设置为方形
                                    shape: 'square',
                                    // 文字样式，颜色随机
                                    textStyle: {
                                        normal: {
                                            color: function () {
                                                return getRandomColor();
                                            }
                                        }
                                    },
                                    // 数据
                                    data: values
                                }
                            ]
                        }
                        echartsRef.current.setOption(option);
                    }
                });
        }
    }, [groupId, month]);

    return <div className={"board"}>
        <div className={"title"}>排名趋势</div>
        <div className={"display-3"}>
            <div ref={domRef} style={{width: '100%', height: '100%'}}/>
        </div>
    </div>;
};

