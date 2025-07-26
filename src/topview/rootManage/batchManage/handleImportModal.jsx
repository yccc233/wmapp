import { Button, Modal, Upload, message, Tabs, Table, Space, Tag } from "antd";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";
import Uploader from "@/src/topview/rootManage/batchManage/uploader.jsx";
import { makePost } from "@/src/utils.jsx";
import moment from "moment";
import { dateFormat, monthFormat } from "@/src/riskview/config.jsx";
import { useState } from "react";


export default function HandleImportModal({ visible, close }) {

    return <Modal
        width={1320}
        closable={false}
        footer={null}
        title={<div style={{ display: "flex", alignContent: "center", justifyContent: "space-between" }}>
            <span>批量处理</span>
        </div>}
        destroyOnClose
        centered
        wrapClassName={"topview-manage-excel-import-modal"}
        open={visible}
        onCancel={close}
    >
        <Tabs>
            <Tabs.TabPane key="30001" tab="厂办查处">
                <ExcelManage labelId={"30001"} labelName={"厂办查处"}/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="压力" key="2">
                {/* Content for Pressure tab */}
            </Tabs.TabPane>
            <Tabs.TabPane tab="性能" key="3">
                {/* Content for Performance tab */}
            </Tabs.TabPane>
        </Tabs>
    </Modal>;
}





const ExcelManage = (props) => {
    const {
        labelId, labelName,
        fieldData = "违章时间", fieldScore = "分值", fieldRemark = "违章情况",
        fieldViolationName = "违章人员姓名", fieldCheckName = "检查人员姓名"
    } = props;

    const columns = [
        {
            title: "序号",
            dataIndex: "label",
            key: "label",
            width: 50,
            align: "center",
            render: (_, __, index) => index + 1
        },
        {
            title: "违章日期",
            dataIndex: "date",
            key: "date",
            width: 140
        },
        {
            title: "相关人",
            dataIndex: "name",
            key: "name",
            width: 200,
            render: (text, record) => `${text} (${record.person.related_group?.group_name}${record.person.related_class?.class_name})`
        },
        {
            title: "标签类型",
            dataIndex: "label",
            key: "label",
            width: 120,
            render: (label) => label?.labelName || "未知"
        },
        {
            title: "分值变化",
            dataIndex: "deltaScore",
            key: "deltaScore",
            width: 100,
            render: (score) => score > 0 ? `+${score}` : score
        },
        {
            title: "备注说明",
            dataIndex: "remark",
            key: "remark",
            ellipsis: true
        }
    ];

    const [tableData, setTableData] = useState([]);
    const [postWaiting, setPostWaiting] = useState(false);
    const [execFlag, setExecFlag] = useState(false);

    const dataHandle = async (arrayData) => {
        const postRes = await makePost("/topview/getAllPersons");
        const systemPersonList = postRes.data;
        const sysPersonMap = {}, displayData = [];
        // 在这里处理每个人，目前这种处理有可能有重名风险，目前只匹配人名
        for (const person of systemPersonList) {
            sysPersonMap[person.person_name] = person;
        }
        // 在这里处理每个记录
        for (const record of arrayData) {
            // 找到违章人员
            const violationPersonName = record[fieldViolationName];
            if (sysPersonMap[violationPersonName]) {
                displayData.push({
                    person: sysPersonMap[violationPersonName],
                    label: { labelName, labelId },
                    date: record[fieldData],
                    month: moment(record[fieldData]).format(monthFormat),
                    name: violationPersonName,
                    deltaScore: 0 - Number(record[fieldScore]) * 2,
                    remark: record[fieldRemark]
                });
            }
            // 找到检查人员
            if (fieldCheckName && sysPersonMap[record[fieldCheckName]]) {
                displayData.push({
                    person: sysPersonMap[record[fieldCheckName]],
                    label: { labelName, labelId },
                    date: record[fieldData],
                    month: moment(record[fieldData]).format(monthFormat),
                    name: record[fieldCheckName],
                    deltaScore: Number(record[fieldScore]),
                    remark: `检查加分，检查项：\n${record[fieldRemark]}`
                });
            }
        }
        setTableData(displayData);
    };

    const importData = () => {
        setPostWaiting(true);
        // 做关键值映射，确保唯一和合并
        const recordsMap = {};
        for (const oneItem of tableData) {
            const personId = oneItem.person.person_id;
            const month = oneItem.month;
            const labelId = oneItem.label.labelId;
            const mapKey = `${personId}-${month}-${labelId}`;
            if (recordsMap[mapKey]) {
                recordsMap[mapKey].scoreDelta = recordsMap[mapKey].scoreDelta + oneItem.deltaScore;
                recordsMap[mapKey].remark.push(oneItem.remark);
            } else {
                recordsMap[mapKey] = {
                    month: month,
                    personId: personId,
                    labelId: labelId,
                    scoreDelta: oneItem.deltaScore,
                    remark: [oneItem.remark]
                };
            }
        }
        const records = Object.values(recordsMap).map(r => ({ ...r, remark: r.remark.join("\n\n") }));
        makePost("/topview/updateBatchInfoInPersonMonth", { records })
            .then(res => {
                setPostWaiting(false);
                setExecFlag(true);
                message.success("导入成功！")
                console.log("导出异常结果：", res.data);
            });
    };

    return <div className={"manage-excel-import-tab"}>
        <div className={"import-notice-field"}>
            需要注意字段名称和内容：
            {fieldData && <Tag color="blue">{fieldData}</Tag>}
            {fieldScore && <Tag color="green">{fieldScore}</Tag>}
            {fieldRemark && <Tag color="orange">{fieldRemark}</Tag>}
            {fieldViolationName && <Tag color="red">{fieldViolationName}</Tag>}
            {fieldCheckName && <Tag color="purple">{fieldCheckName}</Tag>}
        </div>
        {
            labelId ? <Uploader readCallBack={dataHandle}/> : null
        }
        <div className={"mt10"}>
            <Table
                size={"small"}
                bordered={true}
                columns={columns}
                dataSource={tableData}
                scroll={{ y: 400 }}
                pagination={false}
            />
        </div>
        <div className={"import-funcs"}>
            <Button type={"primary"} loading={postWaiting} disabled={execFlag || tableData.length === 0} onClick={importData}>执行导入</Button>
        </div>
    </div>;
};