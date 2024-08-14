import {AlertOutlined, BugOutlined, CodeSandboxOutlined} from "@ant-design/icons"
import {useState} from "react"
import {Button, Modal, Popover, Rate, Space, Table} from "antd";

export default function SuffixPortal({portal}) {
    const [showStatusRisk, setShowStatusRisk] = useState(false)
    const [showStatusSafety, setShowStatusSafety] = useState(false)
    const [showStatusQuality, setShowStatusQuality] = useState(false)

    return <>
        <Space className={"suffix-portal"} direction="vertical" size={"large"}>
            <button className={"suffix-btn"} onClick={() => setShowStatusRisk(true)}>
                <CodeSandboxOutlined className={"mr10"}/>
                状态风险
            </button>
            <button className={"suffix-btn"} onClick={() => setShowStatusSafety(true)}>
                <AlertOutlined className={"mr10"}/>
                安全风险
            </button>
            <button className={"suffix-btn"} onClick={() => setShowStatusQuality(true)}>
                <BugOutlined className={"mr10"}/>
                质量风险
            </button>
        </Space>
        <StatusRiskModal
            data={portal.events?.flatMap(e => e.risk_list)}
            visible={showStatusRisk}
            onCancel={() => setShowStatusRisk(false)}
        />
        <StatusSafetyModal
            data={[]}
            visible={showStatusSafety}
            onCancel={() => setShowStatusSafety(false)}
        />
        <StatusQualtityModal
            data={[]}
            visible={showStatusQuality}
            onCancel={() => setShowStatusQuality(false)}
        />
    </>
}


const StatusRiskModal = ({data, visible, onCancel}) => {

    const columns = [{
        title: '分类', dataIndex: 'group', key: 'group', width: 120,
        filters: (function () {
            const names = Array.from(new Set(data.map(e => e.group).filter(e => e).join("、").split("、"))).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN', {sensitivity: 'base'}))
            return names.map(n => ({text: n, value: n}))
        })(),
        onFilter: (value, record) => record.group.indexOf(value) > -1,
    }, {
        title: '可能失效点', dataIndex: 'title', key: 'title',
    }, {
        title: '责任人', dataIndex: 'dutier', key: 'dutier', width: 200,
        filters: (function () {
            const names = Array.from(new Set(data.map(e => e.dutier).filter(e => e).join("、").split("、"))).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN', {sensitivity: 'base'}))
            return names.map(n => ({text: n, value: n}))
        })(),
        onFilter: (value, record) => record.dutier.indexOf(value) > -1,
    }, {
        title: '风险等级',
        dataIndex: 'level',
        key: 'level',
        width: 180,
        sorter: (a, b) => a.level - b.level,
        render: (_, record) => <Rate disabled={true} value={record.level}/>
    }, {
        title: '详情', dataIndex: 'id', key: 'id', width: 100, render: (_, record) => {
            // 全部风险点信息
            const _columns = [{
                title: '可能失效点', dataIndex: 'title', key: 'title',
            }, {
                title: '分类', dataIndex: 'group', key: 'group',
            }, {
                title: '责任人', dataIndex: 'dutier', key: 'dutier',
            }, {
                title: '造成后果/历史事故',
                dataIndex: 'consequence',
                key: 'consequence',
                render: t => {
                    // 使用正则表达式匹配时间，允许月份和日期为一位数
                    const regex = /(\d{4})?(\.)?(\d{2})\.(\d{2})/g;
                    // 使用正则表达式分割字符串，但保留分隔符（时间字符串）
                    const matches = Array.from(new Set(t.match(regex))) || []; // 找出所有匹配的时间字符串
                    let target = t;
                    matches.forEach(m => {
                        target = target.replace(new RegExp(m, 'g'), `<span style="color: red;">${m}</span>`)
                    })
                    return <pre className="long-text-pre" dangerouslySetInnerHTML={{__html: target}}/>
                },
            }, {
                title: '点检要求/预防措施',
                dataIndex: 'measure',
                key: 'measure',
                render: t => <pre className={"long-text-pre"}>{t}</pre>
            }, {
                title: '风险等级',
                dataIndex: 'level',
                key: 'level',
                render: (_, record) => <Rate disabled={true} value={record.level}/>
            }]

            return <Popover trigger={["click"]} content={<div>
                <Table
                    columns={_columns}
                    dataSource={[record]}
                    pagination={false}
                />
            </div>}>
                <Button size={"small"} type={"link"}>详情</Button>
            </Popover>
        }
    }]

    return <Modal
        open={visible}
        title={"状态风险"}
        width={1000}
        centered
        footer={null}
        onCancel={onCancel}
    >
        <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            scroll={{
                y: window.innerHeight - 150
            }}
        />
    </Modal>
}

const StatusSafetyModal = ({data, visible, onCancel}) => {
    const columns = [{
        title: '标题', dataIndex: 'title', key: 'title',
    }, {
        title: '后果', dataIndex: 'consequence', key: 'consequence',
    }, {
        title: '措施', dataIndex: 'measure', key: 'measure',
    }, {
        title: '责任人', dataIndex: 'dutier', key: 'dutier',
    }, {
        title: '风险等级', dataIndex: 'level', key: 'level', render: t => <Rate disabled={true} value={t}/>
    }]

    return <Modal
        open={visible}
        title={"安全风险"}
        width={1000}
        centered
        footer={null}
        onCancel={onCancel}
    >
        <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            scroll={{
                y: window.innerHeight - 150
            }}
        />
    </Modal>
}


const StatusQualtityModal = ({data, visible, onCancel}) => {
    const columns = [{
        title: '标题', dataIndex: 'title', key: 'title',
    }, {
        title: '后果', dataIndex: 'consequence', key: 'consequence',
    }, {
        title: '措施', dataIndex: 'measure', key: 'measure',
    }, {
        title: '责任人', dataIndex: 'dutier', key: 'dutier',
    }, {
        title: '风险等级', dataIndex: 'level', key: 'level', render: t => <Rate disabled={true} value={t}/>
    }]

    return <Modal
        open={visible}
        title={"质量风险"}
        width={1000}
        centered
        footer={null}
        onCancel={onCancel}
    >
        <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            scroll={{
                y: window.innerHeight - 150
            }}
        />
    </Modal>
}