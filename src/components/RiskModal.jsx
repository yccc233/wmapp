'use client'
import {Button, Modal, Popover, Rate, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setPortalDetailVis} from "@/src/store/riskview/viewReducer.jsx";

export default function RiskModalCom() {
    const dispatch = useDispatch()
    const portalDetail = useSelector((state) => state.viewReducer.portalDetail)
    const {title, visible, risks} = portalDetail

    const columns = [{
        title: '过程/设备', dataIndex: 'event', key: 'event',
        filters: (function () {
            const names = Array.from(new Set(risks.map(e => e.event).filter(e => e))).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN', {sensitivity: 'base'}))
            return names.map(n => ({text: n, value: n}))
        })(),
        onFilter: (value, record) => record.event.indexOf(value) > -1,
    }, {
        title: '分类', dataIndex: 'group', key: 'group', width: 120,
        filters: (function () {
            const names = Array.from(new Set(risks.map(e => e.group).filter(e => e).join("、").split("、"))).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN', {sensitivity: 'base'}))
            return names.map(n => ({text: n, value: n}))
        })(),
        onFilter: (value, record) => record.group.indexOf(value) > -1,
    }, {
        title: '可能失效点', dataIndex: 'title', key: 'title',
    }, {
        title: '责任人', dataIndex: 'dutier', key: 'dutier', width: 200,
        filters: (function () {
            const names = Array.from(new Set(risks.map(e => e.dutier).filter(e => !!e).join("、").split("、"))).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN', {sensitivity: 'base'}))
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
                title: '过程/设备', dataIndex: 'event', key: 'event',
            }, {
                title: '分类', dataIndex: 'group', key: 'group',
            }, {
                title: '可能失效点', dataIndex: 'title', key: 'title',
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
                width: 180,
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

    const onCancel = () => {
        dispatch(setPortalDetailVis({visible: false}))
    }


    return <Modal
        open={visible}
        title={title}
        width={1000}
        centered
        destroyOnClose
        footer={null}
        onCancel={onCancel}
    >
        <Table
            columns={columns}
            dataSource={distinctRiskList(risks)}
            pagination={false}
            scroll={{
                y: typeof window === "object" ? window.innerHeight - 150 : 400
            }}
        />
    </Modal>
}

export const getRiskListFromPortal = (portal, filterConf = {}) => {
    const {filterName, filterValue, isEqual = true} = filterConf
    const riskList = []
    portal?.events.forEach(e => {
        e?.risk_list.forEach(r => {
            if (filterName && filterValue) {
                if (isEqual ? r[filterName] === filterValue : r[filterName].indexOf(filterValue) > -1) {
                    riskList.push({
                        ...r,
                        event: e.event_title
                    })
                }
            } else {
                riskList.push({
                    ...r,
                    event: e.event_title
                })
            }
        })
    })
    return riskList
}

export const distinctRiskList = (riskList) => {
    return riskList
}