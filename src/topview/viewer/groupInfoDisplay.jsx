import {DatePicker, Space, Table} from "antd";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {makePost} from "@/src/utils.jsx";
import {InfoCircleFilled} from "@ant-design/icons";

export default function GroupInfoDisplay({groupId}) {
    const [filterCondition, setFilterCondition] = useState({
        month: "2025-01" || dayjs().format("YYYY-MM"),
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
            width: 60
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
                        {record['items'][col.label_name_en]['remark'] ? <InfoCircleFilled/> : null}
                    </>
                }
            }))
        ];
    };

    useEffect(() => {
        makePost("/topview/getLabelNames").then(res1 => {
            if (res1.data) {
                setColumns(genBaseColumns(res1.data));
                makePost("/topview/getGroupAvgScore", {groupId: groupId, month: filterCondition.month}).then(res2 => {
                    setMemberData(res2.data);
                    setTableData(res2.data);
                });
            }
        });
        makePost("/topview/getClassesByGroupId", {groupId: groupId}).then(res => {
            if (res.data) {
                setClassList(res.data);
            }
        });
    }, [groupId]);


    const finalColumns = columns.map(col => {
        if (col.key === 'class_name') {
            col.filters = classList.map(cl => ({
                text: cl.class_name,
                value: cl.class_name,
            }));
            col.onFilter = (value, record) => record.class_name.indexOf(value) === 0

        }
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
                                onChange={(_, dateString) => setFilterCondition({
                                    ...filterCondition,
                                    month: dateString
                                })}/>
                </div>
                {/*<div className={"conditions"}>*/}
                {/*    <span className={"cond-title"}>班：</span>*/}
                {/*    <Select style={{width: 100}} value={filterCondition.class}*/}
                {/*            onChange={v => setFilterCondition({...filterCondition, class: v})}>*/}
                {/*        <Select.Option value={-1}>全部</Select.Option>*/}
                {/*        {classList.map((item, ind) => (*/}
                {/*            <Select.Option key={`class-list-${ind}`}*/}
                {/*                           value={item.class_id}>{item.class_name}</Select.Option>*/}
                {/*        ))}*/}
                {/*    </Select>*/}
                {/*</div>*/}
            </Space>
            <Table
                size={"small"}
                rowKey="person_id"
                columns={finalColumns}
                dataSource={tableData}
                pagination={{
                    pageSize: 100,
                }}
                scroll={{
                    x: 1000 || columns.reduce((l, n) => n.width ? l + n.width : l, 0),
                    y: window.innerHeight - 280
                }}
            />
        </div>
        <div className={"other-info"}>

        </div>
    </div>;
}