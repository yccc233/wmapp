import { useEffect, useRef, useState } from "react";
import { getRandomColor, makePost } from "@/src/utils.jsx";
import { Checkbox, Divider, Empty, Modal } from "antd";
import { TeamOutlined } from "@ant-design/icons";


export const DisplayCard1 = ({ classList, monthRange }) => {

    const [displayData, setDisplayData] = useState([]);

    const getSort = (rankInd) => {
        if (rankInd < 5) {
            return <img style={{ width: 24, height: 30 }} src={`/img/topview/sort-new-${rankInd}.png`} alt={""}/>;
        } else {
            return rankInd;
        }
    };

    useEffect(() => {
        if (classList.length > 0) {
            makePost("/topview/getChartData1", { classIdList: classList.map(c => c.class_id), monthRange: monthRange })
                .then(res => {
                    if (res.code === 0) {
                        let _displayData = res.data.slice(0, 4);
                        Array.from({ length: _displayData.length < 4 ? 4 - _displayData.length : 0 }).forEach(() => {
                            _displayData.push({});
                        });
                        setDisplayData(_displayData);
                    }
                });
        } else {
            setDisplayData([]);
        }
    }, [classList, monthRange]);

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
    const [showModal, setShowModal] = useState(false);
    const [classInfoList, setClassInfoList] = useState([]);
    const [tempSelected, setTempSelected] = useState([]);
    const [finalSelected, setFinalSelected] = useState([]);

    useEffect(() => {
        makePost("/topview/getClassesInfoByIdList", { classIdList: classList.map(c => c.class_id) })
            .then(res => {
                if (res.code === 0) {
                    res.data.forEach(item => {
                        item.display_name = item.related_group ? `${item.related_group.group_name}/${item.class_name}` : item.class_name;
                    });
                    setClassInfoList(res.data);
                    setTempSelected(res.data);
                    setFinalSelected(res.data);
                }
            });
    }, [classList]);

    // 销毁函数：在依赖变化或组件卸载时调用
    const destroyChart = () => {
        if (echartsRef.current) {
            echartsRef.current.dispose(); // 销毁实例
            echartsRef.current = null; // 清空引用
        }
    };

    useEffect(() => {
        if (finalSelected.length > 0) {
            makePost("/topview/getChartData2", {
                classIdList: finalSelected.map(c => c.class_id),
                startMonth: month,
                length: 12
            }).then(res => {
                if (res.code === 0) {
                    destroyChart();
                    echartsRef.current = echarts.init(domRef.current);
                    const legendData = res.data.items.map(item => item.label_name);
                    const option = {
                        grid: { left: "8%", right: "5%", top: "20%", bottom: "10%" },
                        legend: {
                            data: legendData.length > 5 ? [] : legendData,
                            textStyle: { color: "white" },
                            top: 0,
                            right: "4%"
                        },
                        tooltip: {
                            trigger: "axis",
                            axisPointer: { type: "cross", crossStyle: { color: "#999" } },
                            textStyle: { color: "white" },
                            backgroundColor: "rgba(0, 0, 0, 0.7)"
                        },
                        xAxis: {
                            type: "category",
                            data: res.data.months,
                            axisLabel: { color: "white" }
                        },
                        yAxis: {
                            type: "value",
                            min: res.data.minScore - 0.5,
                            max: res.data.maxScore + 0.5,
                            splitLine: { show: true, lineStyle: { color: "#004488" } },
                            axisLabel: {
                                color: "white",
                                formatter: function (value) {
                                    return Number.isInteger(value) ? value : value.toFixed(1);
                                }
                            },
                            confine: true
                        },
                        series: res.data.items.map(item => ({
                            type: "line",
                            name: item.label_name,
                            data: item.data.map(d => d.avg_score)
                        }))
                    };
                    echartsRef.current.setOption(option);
                }
            });
        } else {
            destroyChart();
        }
        return () => {
            destroyChart();
        };
    }, [finalSelected, month]);

    const handleCheckboxChange = (checkedValues) => {
        setTempSelected(classInfoList.filter(c => checkedValues.includes(c.class_id)));
    };

    const handleSelectAll = (checked) => {
        setTempSelected(checked ? [...classInfoList] : []);
    };

    const handleOk = () => {
        setFinalSelected(tempSelected);
        setShowModal(false);
    };

    return <div className={"board"}>
        <div className={"title"}>
            排名趋势
            <span className={"func"} onClick={() => setShowModal(true)}>已展示{finalSelected.length}个</span>
            <Modal
                open={showModal}
                centered
                title={"展示配置"}
                destroyOnClose
                onOk={handleOk}
                onCancel={() => setShowModal(false)}
            >
                <div>
                    <Checkbox
                        indeterminate={tempSelected.length > 0 && tempSelected.length < classInfoList.length}
                        checked={tempSelected.length === classInfoList.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                    >
                        全选
                    </Checkbox>
                </div>
                <Divider style={{ margin: "10px 0" }}/>
                <Checkbox.Group
                    value={tempSelected.map(c => c.class_id)}
                    onChange={handleCheckboxChange}
                    style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}
                >
                    {classInfoList.map(c => (
                        <div key={c.class_id} style={{ margin: "4px 0" }}>
                            <Checkbox value={c.class_id}>{c.display_name}</Checkbox>
                        </div>
                    ))}
                </Checkbox.Group>
            </Modal>
        </div>
        <div className={"display-2"}>
            <div ref={domRef} style={{ width: "100%", height: "100%" }}/>
        </div>
    </div>;
};

export const DisplayCard3 = ({ groupId, monthRange }) => {

    const domRef = useRef(null);
    const echartsRef = useRef(null);

    const [empty, setEmpty] = useState(false);

    useEffect(() => {
        if (groupId) {
            makePost("/topview/getChartData3", { groupId: groupId, monthRange: monthRange })
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
    }, [groupId, monthRange]);

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

