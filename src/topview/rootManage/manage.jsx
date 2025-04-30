import {useEffect, useRef, useState} from "react";
import dayjs from "dayjs";
import {Badge, Button, DatePicker, Input, InputNumber, message, Popover, Space, Table} from "antd";
import {AlignCenterOutlined, ReloadOutlined, UserSwitchOutlined} from "@ant-design/icons";
import ManagePerson from "@/src/topview/rootManage/managePerson.jsx";
import {makePost} from "@/src/utils.jsx";
import {formatNumber, getRandomId} from "@/server/common/utils.js";
import 'dayjs/locale/zh-cn';

export default function Manage({groupId, classId}) {

    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
    const [managePersonFlag, setManagePersonFlag] = useState(false);

    const [columns, setColumns] = useState([]);
    const [tableData, setTableData] = useState([]);

    const postIngProcessFlagRef = useRef(false);

    const monthChange = (_, vStr) => {
        setMonth(vStr);
    };

    const itemRemarkChange = async (record, labelName, remark) => {
        if (postIngProcessFlagRef.current) {
            message.info("请稍后再试");
        } else {
            postIngProcessFlagRef.current = true;
            //     POST
            record["items"][labelName]["remark"] = remark;
            setTableData(prev => [...prev]);
            postIngProcessFlagRef.current = false;
        }
    };

    const calcAvgAndTotal = (record) => {
        const scores = Object.values(record.items).map(item => item.score);
        record.total_score = scores.reduce((score, current) => score + current, 0);
        record.avg_score = formatNumber(record.total_score / Object.values(record.items).length);
    };

    const itemScoreChange = async (record, labelName, scoreFloat) => {
        if (postIngProcessFlagRef.current) {
            message.info("请稍后再试");
        } else {
            postIngProcessFlagRef.current = true;
            //     POST
            let transScore = record["items"][labelName]["score"];
            transScore = transScore + scoreFloat;
            if (0 <= transScore && transScore <= 100) {
                record["items"][labelName]["score"] = transScore;
                calcAvgAndTotal(record);
                setTableData(prev => [...prev]);
            }
            postIngProcessFlagRef.current = false;
        }
    };

    const genBaseColumns = (cols) => {
        return [{
            title: '姓名',
            dataIndex: 'person_name',
            key: 'person_name',
            fixed: 'left',
            showSorterTooltip: false,
            sorter: (a, b) => a.person_name.localeCompare(b.person_name),
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
            ...cols.map(col => ({
                title: col.label_name,
                dataIndex: col.label_name_en,
                key: col.label_name_en,
                width: 300,
                sorter: (a, b) => a['items'][col.label_name_en]['score'] - b['items'][col.label_name_en]['score'],
                showSorterTooltip: false,
                render: (_, record) => {
                    const unique = getRandomId(20);
                    return <Space className={"score-func-space"}>
                        <span className={"ded-score-btn"}
                              onClick={() => itemScoreChange(record, col.label_name_en, -5)}>-5</span>
                        <span className={"ded-score-btn"}
                              onClick={() => itemScoreChange(record, col.label_name_en, -1)}>-1</span>
                        <InputNumber size={"small"} value={record['items'][col.label_name_en]['score']}/>
                        <span className={"ded-score-btn"}
                              onClick={() => itemScoreChange(record, col.label_name_en, 1)}>+1</span>
                        <span className={"ded-score-btn"}
                              onClick={() => itemScoreChange(record, col.label_name_en, 5)}>+5</span>

                        <Popover
                            trigger="click"
                            zIndex={1024}
                            placement={"bottomLeft"}
                            onOpenChange={open => open && setTimeout(() => document.getElementById(`id-input-remark-${unique}`)?.focus(), 100)}
                            content={<Input.TextArea
                                id={`id-input-remark-${unique}`}
                                style={{width: 250}}
                                placeholder={"# 请输入备注"}
                                defultValue={record['items'][col.label_name_en]['remark']}
                                onBlur={e => itemRemarkChange(record, col.label_name_en, e.target.value)}
                            />}
                        >
                            <Badge dot={!!record['items'][col.label_name_en]['remark']}>
                                <AlignCenterOutlined className={"pointer"}/>
                            </Badge>
                        </Popover>
                    </Space>
                }
            }))
        ];
    };


    const refresh = () => {
        getPersonsAndScores(() => {
            message.success("刷新成功！");
        });
    };

    const getPersonsAndScores = (callback) => {
        setLoading(true);
        makePost("/topview/getClassAvgScoreInMonth", {classIdList: [classId], month: month})
            .then(res => {
                if (res.data) {
                    setTableData(res.data[classId]);
                    setLoading(false);
                    typeof callback === "function" && callback();
                }
            });
    };

    useEffect(() => {
        getPersonsAndScores();
    }, [groupId, classId, month]);

    useEffect(() => {
        makePost("/topview/getLabelNames").then(res => {
            if (res.data) {
                setColumns(genBaseColumns(res.data));
            }
        });
    }, []);

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

    return <div className={"manage-class"}>
        <div className={"func-s"}>
            <Space size={"large"}>
                <DatePicker
                    picker="month"
                    size={"large"}
                    allowClear={false}
                    value={dayjs(month)}
                    onChange={monthChange}
                />

                <Button size={"large"} type={"link"} icon={<ReloadOutlined className={"mr5"}/>} onClick={refresh}>
                    刷新
                </Button>
            </Space>
            <div>
                <ManagePerson
                    visible={managePersonFlag}
                    classId={classId}
                    close={() => setManagePersonFlag(false)}
                />
                <Button type={"primary"} ghost style={{borderStyle: "dashed"}}
                        icon={<UserSwitchOutlined className={"mr5"}/>} size={"large"}
                        onClick={() => setManagePersonFlag(!managePersonFlag)}>
                    管理成员
                </Button>
            </div>
        </div>
        <div className={"manage-table mt20"}>
            <Table
                loading={loading}
                rowKey="person_id"
                columns={finalColumns}
                dataSource={tableData}
                pagination={false}
                bordered={true}
                scroll={{
                    x: 1000 || columns.reduce((l, n) => n.width ? l + n.width : l, 0),
                    y: window.innerHeight - 230
                }}
            />
        </div>
    </div>;
}