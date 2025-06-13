import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { Badge, Button, DatePicker, Input, InputNumber, message, Popover, Space, Table, Tag } from "antd";
import { EditOutlined, ReloadOutlined, SearchOutlined, UserSwitchOutlined } from "@ant-design/icons";
import ManagePersonModal from "@/src/topview/rootManage/managePersonModal.jsx";
import { getRandomTagColorFromString, makePost } from "@/src/utils.jsx";
import { formatNumber } from "@/server/common/utils.js";
import "dayjs/locale/zh-cn";
import { TextAreaRemark } from "@/src/topview/components.jsx";

export default function Manage({ groupId, classId }) {

    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
    const [managePersonFlag, setManagePersonFlag] = useState(false);

    const [columns, setColumns] = useState([]);
    const [tableData, setTableData] = useState([]);

    const [kws, setKws] = useState("");

    const postIngProcessFlagRef = useRef(false);

    const monthChange = (_, vStr) => {
        setMonth(vStr);
    };

    const itemRemarkChange = (record, label, remark) => {
        if (postIngProcessFlagRef.current) {
            message.info("请稍后再试");
        } else {
            postIngProcessFlagRef.current = true;
            message.loading({ key: "update-message", content: "正在更新" });
            makePost("/topView/updateRemarkInPersonMonth", { month: month, personId: record.person_id, labelId: label.label_id, remark: remark })
                .then(res => {
                    if (res.code === 0) {
                        record["items"][label.label_name_en]["remark"] = remark;
                        setTableData(prev => [...prev]);
                        message.success({ key: "update-message", content: "更新完成" });
                    } else {
                        message.error({ key: "update-message", content: "更新失败" });
                    }
                })
                .catch(e => {
                    console.error(e);
                    message.error({ key: "update-message", content: "更新异常" });
                })
                .finally(() => {
                    postIngProcessFlagRef.current = false;
                });
        }
    };

    const calcAvgAndTotal = (record) => {
        const scores = Object.values(record.items).map(item => item.score);
        record.total_score = scores.reduce((score, current) => score + current, 0);
        record.avg_score = formatNumber(record.total_score / Object.values(record.items).length);
    };

    const itemScoreChange = async (record, label, scoreDelta) => {
        if (postIngProcessFlagRef.current) {
            message.info("请稍后再试");
        } else {
            postIngProcessFlagRef.current = true;
            message.loading({ key: "update-message", content: "正在更新" });
            const score = record["items"][label.label_name_en]["score"];
            // 兜底，分数不超过100且不低于0
            if (score + scoreDelta > 100) {
                scoreDelta = 100 - score;
            }
            if (score + scoreDelta < 0) {
                scoreDelta = -score;
            }
            makePost("/topView/updateScoreInPersonMonth", { month: month, personId: record.person_id, labelId: label.label_id, scoreDelta: scoreDelta })
                .then(res => {
                    if (res.code === 0) {
                        let transScore = record["items"][label.label_name_en]["score"];
                        transScore = transScore + scoreDelta;
                        if (0 <= transScore && transScore <= 100) {
                            record["items"][label.label_name_en]["score"] = transScore;
                            calcAvgAndTotal(record);
                            setTableData(prev => [...prev]);
                        }
                        message.success({ key: "update-message", content: "更新完成" });
                    } else {
                        message.error({ key: "update-message", content: "更新失败" });
                    }
                })
                .catch(e => {
                    console.error(e);
                    message.error({ key: "update-message", content: "更新异常" });
                })
                .finally(() => {
                    postIngProcessFlagRef.current = false;
                });

        }
    };

    const genBaseColumns = (cols) => {
        return [{
            title: "序号",
            dataIndex: "index",
            key: "index",
            fixed: "left",
            showSorterTooltip: false,
            width: 80
        }, {
            title: "段",
            dataIndex: "flag_info",
            key: "flag_info",
            fixed: "left",
            sorter: (a, b) => a.flag_info.localeCompare(b.flag_info),
            width: 100
        }, {
            title: "姓名",
            dataIndex: "person_name",
            key: "person_name",
            fixed: "left",
            showSorterTooltip: false,
            sorter: (a, b) => a.person_name.localeCompare(b.person_name),
            width: 130,
            render: (_, record) => (
                <Space>
                    {record.person_name}
                    {record.label_info && <Tag color={getRandomTagColorFromString(record.label_info)}>{record.label_info}</Tag>}
                </Space>
            )
        }, {
            title: "平均",
            dataIndex: "avg_score",
            key: "avg_score",
            fixed: "left",
            sorter: (a, b) => a.avg_score - b.avg_score,
            showSorterTooltip: false,
            width: 100
        }, {
            title: "总分",
            dataIndex: "total_score",
            key: "total_score",
            fixed: "left",
            sorter: (a, b) => a.total_score - b.total_score,
            showSorterTooltip: false,
            width: 100
        },
            ...cols.map(col => ({
                title: col.label_name,
                dataIndex: col.label_name_en,
                key: col.label_name_en,
                width: 250,
                sorter: (a, b) => a["items"][col.label_name_en]["score"] - b["items"][col.label_name_en]["score"],
                showSorterTooltip: false,
                render: (_, record) => {
                    const unique = `${col.label_name_en}-${record["person_id"]}`;
                    const remark = record["items"][col.label_name_en]["remark"];
                    const score = record["items"][col.label_name_en]["score"];

                    return <Space className={"score-func-space"}>
                        <span className={"ded-score-btn"} style={score < 1 ? { "cursor": "not-allowed", "background": "#ccc" } : null}
                              onClick={() => score >= 1 && itemScoreChange(record, col, -5)}>-5</span>
                        <span className={"ded-score-btn"} style={score < 1 ? { "cursor": "not-allowed", "background": "#ccc" } : null}
                              onClick={() => score >= 1 && itemScoreChange(record, col, -1)}>-1</span>
                        <InputNumber style={{ width: 48 }} size={"small"} value={score} max={100} min={0} variant={"underlined"} controls={false} onBlur={e => itemScoreChange(record, col, e.target.value - score)}/>
                        <span className={"ded-score-btn"} style={score > 99 ? { "cursor": "not-allowed", "background": "#ccc" } : null}
                              onClick={() => score <= 99 && itemScoreChange(record, col, 1)}>+1</span>
                        <span className={"ded-score-btn"} style={score > 99 ? { "cursor": "not-allowed", "background": "#ccc" } : null}
                              onClick={() => score <= 99 && itemScoreChange(record, col, 5)}>+5</span>
                        <Popover
                            trigger="click"
                            zIndex={1024}
                            placement={"bottomLeft"}
                            destroyTooltipOnHide
                            onOpenChange={open => open && setTimeout(() => {
                                const inputDom = document.getElementById(`id-input-remark-${unique}`);
                                inputDom?.focus();
                            }, 100)}
                            content={<TextAreaRemark unique={unique} defaultValue={remark} onCommit={value => value !== remark && itemRemarkChange(record, col, value)}/>}
                        >
                            <Badge dot={!!remark}>
                                <EditOutlined className={"pointer"} style={{ color: remark ? "#1890ff" : "#aaa" }}/>
                            </Badge>
                        </Popover>
                    </Space>;
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
        makePost("/topview/getClassAvgScoreInMonth", { classIdList: [classId], month: month })
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

    let showedTableData = tableData;

    if (kws && showedTableData) {
        showedTableData = showedTableData.filter(td => td.person_name.indexOf(kws) > -1);
    }

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
                <Input
                    size={"large"}
                    prefix={<SearchOutlined/>}
                    style={{ width: 200 }}
                    allowClear
                    placeholder={"输入人名进行检索"}
                    onPressEnter={e => setKws(e.target.value)}
                    onChange={e => !e.target.value && setKws("")}
                />
                <Button size={"large"} type={"link"} icon={<ReloadOutlined className={"mr5"}/>} onClick={refresh}>
                    刷新
                </Button>
            </Space>
            <div>
                <ManagePersonModal
                    visible={managePersonFlag}
                    classId={classId}
                    close={() => setManagePersonFlag(false)}
                />
                <Button type={"primary"} ghost style={{ borderStyle: "dashed" }}
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
                dataSource={showedTableData}
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
