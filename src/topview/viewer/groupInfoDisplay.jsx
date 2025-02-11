import {DatePicker, Select, Space, Table, Tooltip} from "antd";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {makePost} from "@/src/utils.jsx";
import {ArrowDownOutlined, ArrowUpOutlined, MinusOutlined, PicLeftOutlined} from "@ant-design/icons";

export default function GroupInfoDisplay({groupId}) {
    const [filterCondition, setFilterCondition] = useState({
        month: "2025-01" || dayjs().format("YYYY-MM"),
        class: -1
    });
    const [classList, setClassList] = useState([]);
    const [memberData, setMemberData] = useState([]);
    const [tableData, setTableData] = useState([]);

    const [columns, setColumns] = useState([]);

    const genBaseColumns = (cols) => {
        return [{
            title: '排名',
            dataIndex: 'range',
            key: 'range',
            fixed: 'left',
            width: 60,
        }, {
            title: '班组',
            dataIndex: 'class_name',
            key: 'class_name',
            fixed: 'left',
            width: 100,
        }, {
            title: '姓名',
            dataIndex: 'person_name',
            key: 'person_name',
            fixed: 'left',
            width: 100,
        }, {
            title: '平均',
            dataIndex: 'avg_score',
            key: 'avg_score',
            fixed: 'left',
            sorter: (a, b) => a.avg_score - b.avg_score,
            showSorterTooltip: false,
            width: 100,
        }, {
            title: '总分',
            dataIndex: 'total_score',
            key: 'total_score',
            fixed: 'left',
            sorter: (a, b) => a.total_score - b.total_score,
            showSorterTooltip: false,
            width: 100,
        }, {
            title: '排名变动',
            dataIndex: 'range_float',
            key: 'range_float',
            fixed: 'left',
            width: 100,
            showSorterTooltip: false,

            sorter: (a, b) => a.range_float - b.range_float,
            render: text => {
                return <span title={"较上个月排名变动"}>
                    {text > 0 ? <ArrowUpOutlined className={"fwb mr5 success"}/> :
                        text < 0 ? <ArrowDownOutlined className={"fwb mr5 error"}/> :
                            <ArrowDownOutlined className={"fwb mr5"} style={{color: "transparent"}}/>}
                    {Math.abs(text)}
                        </span>;
            }
        },
            ...cols.map((col, ind) => ({
                title: col.label_name,
                dataIndex: col.label_name_en,
                key: col.label_name_en,
                width: 100,
                sorter: (a, b) => a['items'][col.label_name_en]['score'] - b['items'][col.label_name_en]['score'],
                showSorterTooltip: false,
                render: (_, record) => {
                    return <>
                        <span>{record['items'][col.label_name_en]['score']}</span>
                        {record['items'][col.label_name_en]['remark'] ?
                            <Tooltip title={record['items'][col.label_name_en]['remark']}>
                                <PicLeftOutlined style={{cursor: 'help', marginLeft: 10}}/>
                            </Tooltip> : null}
                    </>
                }
            }))
        ];
    };

    const getScore = (_groupId, _month) => {
        Promise.all([
            makePost("/topview/getGroupAvgScore", {groupId: _groupId, month: _month}),
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
                        } else {
                            item.range_float = "-";
                        }
                    });
                    setTableData(res1.data);
                    setMemberData(res1.data);
                }
            });
    };

    const monthChange = (_, dateString) => {
        setFilterCondition({
            ...filterCondition,
            month: dateString
        });
        getScore(groupId, dateString);
    };

    const classChange = (valueId) => {
        setFilterCondition({
            ...filterCondition,
            class: valueId
        });
        if (valueId === -1) {
            setTableData([...memberData]);
        } else {
            setTableData(memberData.filter(m => m.class_id === valueId));
        }
    };

    useEffect(() => {
        makePost("/topview/getLabelNames").then(res1 => {
            if (res1.data) {
                setColumns(genBaseColumns(res1.data));
                getScore(groupId, filterCondition.month);
            }
        });
        makePost("/topview/getClassesByGroupId", {groupId: groupId}).then(res => {
            if (res.data) {
                setClassList(res.data);
            }
        });
    }, [groupId]);


    const finalColumns = columns.map(col => {
        // if (col.key === 'class_name') {
        //     col.filters = classList.map(cl => ({
        //         text: cl.class_name,
        //         value: cl.class_name,
        //     }));
        //     col.onFilter = (value, record) => record.class_name.indexOf(value) === 0
        //
        // }
        return col;
    });

    return <div className="content-container">
        <div className={"members-info"}>
            <Space size={"large"}>
                <div className={"conditions"}>
                    <span className={"cond-title"}>统计时间：</span>
                    <DatePicker picker="month" disabledDate={current => current && current > dayjs().endOf('month')}
                                allowClear={false}
                                value={dayjs(filterCondition.month)}
                                onChange={monthChange}/>
                </div>
                <div className={"conditions"}>
                    <span className={"cond-title"}>班：</span>
                    <Select style={{width: 100}} value={filterCondition.class}
                            onChange={classChange}>
                        <Select.Option value={-1}>全部</Select.Option>
                        {classList.map((item, ind) => (
                            <Select.Option key={`class-list-${ind}`}
                                           value={item.class_id}>{item.class_name}</Select.Option>
                        ))}
                    </Select>
                </div>
            </Space>
            <div className={"introduce"}>
                下表统计了班组内成员所拥有的分数，表格支持筛选、过滤、排序等操作，扣除的分数在后面会有备注说明，可以修改统计时间和班组来进一步查看班组的成员情况。
            </div>
            <Table
                size={"small"}
                rowKey="person_id"
                columns={finalColumns}
                dataSource={tableData}
                pagination={false}
                scroll={{
                    x: 1000 || columns.reduce((l, n) => n.width ? l + n.width : l, 0),
                    y: window.innerHeight - 380
                }}
            />
        </div>
        <div className={"other-info"}>
            <div className={"board"}>
                统计班组排名（班组的平均分）
                排名 班组 人员数量 平均分
            </div>
            <div className={"board"}>
                班组排名的折线图，近半年的数据
            </div>
            <div className={"board"}>
                扣分大类，使用词云展示？
            </div>
        </div>
    </div>;
}