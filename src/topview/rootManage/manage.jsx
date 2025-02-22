import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {Button, DatePicker, Input, InputNumber, Popover, Space, Table, Tooltip} from "antd";
import {
    AlignCenterOutlined,
    DoubleLeftOutlined, DoubleRightOutlined,
    FallOutlined, LeftOutlined,
    PicLeftOutlined,
    ReloadOutlined, RightOutlined,
    RiseOutlined,
    UserSwitchOutlined
} from "@ant-design/icons";
import ManagePerson from "@/src/topview/rootManage/managePerson.jsx";
import {makePost} from "@/src/utils.jsx";


export default function Manage({classId}) {

    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
    const [managePersonFlag, setManagePersonFlag] = useState(false);

    const [columns, setColumns] = useState([]);
    const [tableData, setTableData] = useState([]);

    const monthChange = (_, vStr) => {
        setMonth(vStr);
    };

    const itemScoreChange = () => {

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
                width: 200,
                sorter: (a, b) => a['items'][col.label_name_en]['score'] - b['items'][col.label_name_en]['score'],
                showSorterTooltip: false,
                render: (_, record) => {
                    return <Space>
                        <span>-5</span>
                        <span>-1</span>
                        <InputNumber size={"small"} value={record['items'][col.label_name_en]['score']}/>
                        <span>+1</span>
                        <span>+5</span>

                        <Popover
                            trigger={["click"]}
                            zIndex={1024}
                            arrow={false}
                            placement={"bottom"}
                            content={<Input.TextArea defultValue={record['items'][col.label_name_en]['remark']}/>}
                        >
                            <AlignCenterOutlined/>
                        </Popover>
                    </Space>
                }
            }))
        ];
    };

    useEffect(() => {
        setTimeout(() => {
            console.log(classId)
            setLoading(true);

            makePost("/topview/getClassAvgScoreInMonth", {classIdList: [classId], month: month})
                .then(res => {
                    if (res.data) {
                        setTableData(res.data[classId]);
                        setLoading(false);
                    }
                });

        }, 500)

    }, [classId, month]);

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
        {/*选定小组 选定月份 管理成员 退出登录*/}
        {/*成员表格 扣分 加分 备注*/}
        <div className={"func-s"}>
            <Space size={"large"}>
                <DatePicker
                    picker="month"
                    size={"large"}
                    allowClear={false}
                    value={dayjs(month)}
                    onChange={monthChange}
                />
                <Button size={"large"} type={"link"} icon={<ReloadOutlined className={"mr5"}/>}>
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
        <div className={"mt20"}>
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