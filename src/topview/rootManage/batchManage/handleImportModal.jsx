import { Button, message, Modal, Table, Tabs, Tag } from "antd";
import Uploader from "@/src/topview/rootManage/batchManage/uploader.jsx";
import { makePost } from "@/src/utils.jsx";
import moment from "moment";
import { monthFormat } from "@/src/riskview/config.jsx";
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
                <ExcelManage
                    labelId={"30001"} labelName={"厂办查处"}
                    fieldDate={"违章时间"} fieldScore={"分值"} fieldRemark={"违章情况"}
                    fieldViolationName={"违章人员姓名"} fieldCheckName={"检查人员姓名"}
                />
            </Tabs.TabPane>
            <Tabs.TabPane key="3000230003" tab="工厂内查处">
                <ExcelManage
                    labelId={"30002"} labelName={"工场检查"}
                    labelIdPlus={"30003"} labelNamePlus={"班组长查违章"}
                    fieldDate={"违章时间"} fieldScore={"分值"} fieldRemark={"违章情况"}
                    fieldViolationName={"违章人员姓名"} fieldCheckName={"检查人员姓名"}
                />
            </Tabs.TabPane>
            <Tabs.TabPane key="30004" tab="安保系统使用">
                <ExcelManage
                    labelId={"30004"} labelName={"安保系统使用"}
                    fieldDate={"发现日期"} fieldScore={"匹配危险源"}
                    fieldCheckName={"发现人姓名"}
                />
            </Tabs.TabPane>
        </Tabs>
    </Modal>;
}





const ExcelManage = (props) => {
    const {
        labelId, labelName, labelIdPlus, labelNamePlus, fieldDate, fieldScore, fieldRemark, fieldViolationName, fieldCheckName
    } = props;

    const columns = [{
        title: "序号", dataIndex: "label", key: "label", width: 50, align: "center", render: (_, __, index) => index + 1
    }, {
        title: "违章日期", dataIndex: "date", key: "date", width: 140
    }, {
        title: "相关人", dataIndex: "name", key: "name", width: 200, render: (text, record) => `${text} (${record.person.related_group?.group_name}${record.person.related_class?.class_name})`
    }, {
        title: "标签类型", dataIndex: "label", key: "label", width: 120, render: (label) => label?.labelName || "未知"
    }, {
        title: "分值变化", dataIndex: "deltaScore", key: "deltaScore", width: 100, render: (score) => score > 0 ? `+${score}` : score
    }, {
        title: "备注说明", dataIndex: "remark", key: "remark", ellipsis: true
    }];

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

        if (labelId === "30004") {
            // 单独处理（比较特殊，不是通用的）
            // 找到不在人员名单里的，日期用第一个数据的日期
            const date = arrayData[0] && arrayData[0][fieldDate];
            const excelNameFlagMap = arrayData.reduce((t, p) => {
                t[p[fieldCheckName]] = p;
                return t;
            }, {});
            for (const person of systemPersonList) {
                if (!excelNameFlagMap[person.person_name]) {
                    displayData.push({
                        person: person, label: { labelName, labelId }, date: date, month: moment(date).format(monthFormat), name: person.person_name, deltaScore: -5, remark: "当月未进行隐患排查"
                    });
                }
            }
            // 找未匹配的
            for (const record of arrayData) {
                const pName = record[fieldCheckName];
                const person = sysPersonMap[pName];
                if (record[fieldScore] === "未匹配" && person) {
                    displayData.push({
                        person: person, label: { labelName, labelId }, date: record[fieldDate], month: moment(record[fieldDate]).format(monthFormat), name: pName, deltaScore: -3, remark: "未匹配危险源"
                    });
                }
            }
        } else {
            // 在这里处理每个记录
            for (const record of arrayData) {
                // 找到违章人员
                const violationPersonName = record[fieldViolationName];
                if (sysPersonMap[violationPersonName]) {
                    displayData.push({
                        person: sysPersonMap[violationPersonName], label: { labelName, labelId }, date: record[fieldDate], month: moment(record[fieldDate]).format(monthFormat), name: violationPersonName, deltaScore: 0 - Number(record[fieldScore]) * 2, remark: record[fieldRemark]
                    });
                }
                // 找到检查人员
                if (fieldCheckName && sysPersonMap[record[fieldCheckName]]) {
                    displayData.push({
                        person: sysPersonMap[record[fieldCheckName]], label: labelIdPlus && labelNamePlus ? { labelName: labelNamePlus, labelId: labelIdPlus } : { labelName, labelId }, date: record[fieldDate], month: moment(record[fieldDate]).format(monthFormat), name: record[fieldCheckName], deltaScore: Number(record[fieldScore]), remark: `检查加分，检查项：\n${record[fieldRemark]}`
                    });
                }
            }
        }
        console.log("处理结果", { arrayData, systemPersonList, sysPersonMap, displayData });
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
                    month: month, personId: personId, labelId: labelId, scoreDelta: oneItem.deltaScore, remark: [oneItem.remark]
                };
            }
        }
        const records = Object.values(recordsMap).map(r => ({ ...r, remark: r.remark.join("\n\n") }));
        makePost("/topview/updateBatchInfoInPersonMonth", { records })
            .then(res => {
                setPostWaiting(false);
                setExecFlag(true);
                message.success("导入成功！");
                console.log("导出异常结果：", res.data);
            });
    };

    return <div className={"manage-excel-import-tab"}>
        <div className={"import-notice-field"}>
            需要注意的表格中列字段：
            {fieldDate && <Tag color="blue">{fieldDate}</Tag>}
            {fieldScore && <Tag color="green">{fieldScore}</Tag>}
            {fieldRemark && <Tag color="orange">{fieldRemark}</Tag>}
            {fieldViolationName && <Tag color="red">{fieldViolationName}</Tag>}
            {fieldCheckName && <Tag color="purple">{fieldCheckName}</Tag>}
        </div>
        {labelId ? <Uploader readCallBack={dataHandle}/> : null}
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