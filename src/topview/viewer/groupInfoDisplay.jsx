"use client";
import { DatePicker, Select, Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getRandomTagColorFromString, makePost } from "@/src/utils.jsx";
import { FallOutlined, RiseOutlined } from "@ant-design/icons";
import { DisplayCard1, DisplayCard2, DisplayCard3 } from "@/src/topview/viewer/displayCard.jsx";
import { ToolTipRemark } from "@/src/topview/components.jsx";
import { getMonthRange } from "@/src/topview/util.jsx";


const currentMonth = dayjs().format("YYYY-MM");

export default function GroupInfoDisplay({ groupId }) {
    const [loading, setLoading] = useState(true);
    const [filterCondition, setFilterCondition] = useState({
        monthRange: [currentMonth, currentMonth],
        class: -1,
        type: ""
    });
    const [classList, setClassList] = useState([]);
    const [typeList, setTypeList] = useState([]);
    const [memberData, setMemberData] = useState([]);
    const [tableData, setTableData] = useState([]);

    const [columns, setColumns] = useState([]);

    const [scrollY, setScrollY] = useState(200);

    const genBaseColumns = (cols) => {
        return [{
            title: "排名",
            dataIndex: "range",
            key: "range",
            fixed: "left",
            width: 60
        }, {
            title: "机组",
            dataIndex: "group_name",
            key: "group_name",
            fixed: "left",
            width: 65
        }, {
            title: "班组",
            dataIndex: "class_name",
            key: "class_name",
            fixed: "left",
            width: 100
        }, {
            title: "岗位",
            dataIndex: "flag_info",
            key: "flag_info",
            fixed: "left",
            width: 65
        }, {
            title: "姓名",
            dataIndex: "person_name",
            key: "person_name",
            fixed: "left",
            width: 100,
            render: (_, record) => (
                <Space>
                    {record.person_name}
                    {record.label_info && <Tag color={getRandomTagColorFromString(record.label_info, 7)}>{record.label_info}</Tag>}
                </Space>
            )
        }, {
            title: "平均",
            dataIndex: "avg_score",
            key: "avg_score",
            fixed: "left",
            sorter: (a, b) => a.avg_score - b.avg_score,
            showSorterTooltip: false,
            width: 80
        }, {
            title: "总分",
            dataIndex: "total_score",
            key: "total_score",
            fixed: "left",
            sorter: (a, b) => a.total_score - b.total_score,
            showSorterTooltip: false,
            width: 80
        }, {
            title: "排名变动",
            dataIndex: "range_float",
            key: "range_float",
            fixed: "left",
            width: 90,
            showSorterTooltip: false,
            sorter: (a, b) => a.range_float - b.range_float,
            render: text => {
                return <span title={"较上个月排名变动"}>
                    {text > 0 ? <RiseOutlined className={"fwb mr5 success"}/> :
                        text < 0 ? <FallOutlined className={"fwb mr5 error"}/> :
                            <FallOutlined className={"fwb mr5"} style={{ color: "transparent" }}/>}
                    {Math.abs(text) || "-"}
                        </span>;
            }
        },
            ...cols.map((col, ind) => ({
                title: col.label_name,
                dataIndex: col.label_name_en,
                key: col.label_name_en,
                width: 120,
                sorter: (a, b) => a["items"][col.label_name_en]["score"] - b["items"][col.label_name_en]["score"],
                showSorterTooltip: false,
                render: (_, record) => {
                    return <div className={"h_center"}>
                        <span>{record["items"][col.label_name_en]["score"]}</span>
                        {record["items"][col.label_name_en]["remark"] ? <ToolTipRemark remark={record["items"][col.label_name_en]["remark"]}/> : null}
                    </div>;
                }
            }))
        ];
    };

    const getScore = (_groupId, monthRange) => {
        setLoading(true);
        const months = getMonthRange(monthRange[0], monthRange[1]);
        if (months.length === 1) {
            const _month = months[0];
            Promise.all([
                makePost("/topview/getGroupAvgScore", { groupId: _groupId, month: _month }),
                makePost("/topview/getGroupAvgScore", {
                    groupId: _groupId,
                    month: dayjs(_month).subtract(1, "month").format("YYYY-MM")
                })
            ])
                .then(([res1, res2]) => {
                    if (res1.data && res2.data) {
                        res1.data.forEach(item => {
                            const lastMonthData = res2.data.find(d => d.person_id === item.person_id);
                            if (lastMonthData) {
                                item.range_float = lastMonthData.range - item.range;
                            }
                        });
                        if (filterCondition.type !== "" || filterCondition.class !== -1) {
                            setFilterCondition(prev => ({ ...prev, class: -1, type: "" }));
                        }
                        setTableData(res1.data);
                        setMemberData(res1.data);
                        const flagList = res1.data.map(d => d.flag_info).filter(d => d);
                        setTypeList(Array.from(new Set(flagList)));
                    }
                    setLoading(false);
                });
        } else {
            makePost("/topview/getGroupAvgScoreInMonthRange", { groupId: _groupId, startMonth: monthRange[0], endMonth: monthRange[1] })
                .then(res => {
                    if (res.data) {
                        if (filterCondition.type !== "" || filterCondition.class !== -1) {
                            setFilterCondition(prev => ({ ...prev, class: -1, type: "" }));
                        }
                        setTableData(res.data);
                        setMemberData(res.data);
                        const flagList = res.data.map(d => d.flag_info).filter(d => d);
                        setTypeList(Array.from(new Set(flagList)));
                    }
                    setLoading(false);
                });
        }

    };

    const monthChange = (_, dateRange) => {
        setFilterCondition({
            ...filterCondition,
            monthRange: dateRange
        });
        getScore(groupId, dateRange);
    };

    const setTableByConditions = (classValue, typeValue) => {
        setTableData(prev => {
            let tar = [...memberData];
            if (classValue !== -1) {
                tar = tar.filter(t => t.class_id === classValue);
            }
            if (typeValue !== "") {
                tar = tar.filter(t => t.flag_info === typeValue);
            }
            return tar;
        });
    };

    const classChange = (valueId) => {
        setFilterCondition({
            ...filterCondition,
            class: valueId
        });
        setTableByConditions(valueId, filterCondition.type);
    };

    const typeChange = (valueId) => {
        setFilterCondition({
            ...filterCondition,
            type: valueId
        });
        setTableByConditions(filterCondition.class, valueId);
    };

    useEffect(() => {
        makePost("/topview/getLabelNames").then(res1 => {
            if (res1.data) {
                setColumns(genBaseColumns(res1.data));
                getScore(groupId, filterCondition.monthRange);
            }
        });
        makePost("/topview/getClassesByGroupId", { groupId: groupId }).then(res => {
            if (res.data) {
                setClassList(res.data);
            }
        });
    }, [groupId]);

    useEffect(() => {
        setScrollY(typeof window !== "undefined" ? window.innerHeight - 380 : 200);
    }, []);

    const finalColumns = columns;

    return <div className="content-container">
        <div className={"members-info"}>
            <Space size={"large"}>
                <div className={"conditions"}>
                    <span className={"cond-title"}>时间：</span>
                    <DatePicker.RangePicker
                        picker="month"
                        style={{ width: 200 }}
                        // disabledDate={current => current && current > dayjs().endOf("month")}
                        allowClear={false}
                        value={[dayjs(filterCondition.monthRange[0]), dayjs(filterCondition.monthRange[1])]}
                        onChange={monthChange}
                    />
                </div>
                <div className={"conditions"}>
                    <span className={"cond-title"}>班：</span>
                    <Select style={{ width: 100 }} popupMatchSelectWidth={false} value={filterCondition.class}
                            onChange={classChange}>
                        <Select.Option value={-1}>全部</Select.Option>
                        {classList.map((item, ind) => (
                            <Select.Option key={`class-list-${ind}`}
                                           value={item.class_id}>{item.class_name}</Select.Option>
                        ))}
                    </Select>
                </div>
                <div className={"conditions"}>
                    <span className={"cond-title"}>段：</span>
                    <Select style={{ width: 100 }} popupMatchSelectWidth={false} value={filterCondition.type}
                            onChange={typeChange}>
                        <Select.Option value={""}>全部</Select.Option>
                        {typeList.map((item, ind) => (
                            <Select.Option key={`type-list-${ind}`}
                                           value={item}>{item}</Select.Option>
                        ))}
                    </Select>
                </div>
            </Space>
            <div className={"introduce"}>
                下表统计了班组内成员所拥有的分数，表格支持筛选、过滤、排序等操作，扣除的分数在后面会有备注说明，可以修改统计时间和班组来进一步查看班组的成员情况。
            </div>
            <Table
                className={"display-table"}
                size={"small"}
                loading={loading}
                rowKey="person_id"
                columns={finalColumns}
                dataSource={tableData}
                pagination={false}
                scroll={{
                    x: 1000 || columns.reduce((l, n) => n.width ? l + n.width : l, 0),
                    y: scrollY
                }}
            />
        </div>
        <div className={"other-info"}>
            <DisplayCard1 groupId={groupId} classList={classList} monthRange={filterCondition.monthRange}/>
            <DisplayCard2 groupId={groupId} classList={classList} month={currentMonth} monthRange={filterCondition.monthRange}/>
            <DisplayCard3 groupId={groupId} classList={classList} monthRange={filterCondition.monthRange}/>
        </div>
    </div>;
}