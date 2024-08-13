import { Button, Modal, Popover, Rate, Table } from "antd";
import { useEffect, useRef, useState } from "react";

export default function CtnMain({ portal }) {

    const [baseNum, setBaseNum] = useState([0, 0])
    const imgRef = useRef()

    const events = portal.events || []

    const getBase = () => {
        const height = imgRef.current.clientHeight
        const width = imgRef.current.clientWidth
        setBaseNum([width, height])
    }

    useEffect(() => {
        setTimeout(() => {
            getBase()
        }, 50);
    }, [portal])

    useEffect(() => {
        // 为window对象的resize事件添加事件监听器  
        window.addEventListener('resize', getBase)
        return () => window.removeEventListener('resize', getBase)
    }, [])

    return <div className="content-main">
        <div ref={imgRef} className="img-div">
            <img src={`/riskserver/img/getImageFromServer/${portal.portal_img}`} />
            {events.map((e, i) => <CircleEvent
                key={`event-${i}`}
                base={baseNum}
                type={e.type}
                point={e.event_point}
                radius={e.point_radius}
                lineWidth={e.lines_width}
                lineColor={e.line_color}
                title={e.event_title}
                risklist={e.risk_list}
            />)}
        </div>
    </div>
}



/**
 * 计算的方式：base表示以第一象限为坐标的位置，单位是像素；point是x，y对应的比例 百分比算，radius也是百分比，lineWidth以r为基数，以base最小的为基数
 */
export const CircleEvent = ({ type, base, point, radius, lineWidth, lineColor, title, risklist }) => {
    const [vis, setVis] = useState(false)

    if (!base || !point) {
        return null
    }

    const minBase = base[0] < base[1] ? base[0] : base[1]
    const r = minBase * radius / 100

    const left = base[0] * point[0] / 100 - r
    const bottom = base[1] * point[1] / 100 - r

    const lWidth = r * lineWidth / 100


    const columns = [{
        title: '分类', dataIndex: 'group', key: 'group', width: 120,
    }, {
        title: '可能失效点', dataIndex: 'title', key: 'title',
    }, {
        title: '责任人', dataIndex: 'dutier', key: 'dutier', width: 200,
    }, {
        title: '风险等级',
        dataIndex: 'level',
        key: 'level',
        width: 180,
        render: (_, record) => <Rate disabled={true} value={record.level} />
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
                    return <pre className="long-text-pre" dangerouslySetInnerHTML={{ __html: target }} />
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
                render: (_, record) => <Rate disabled={true} value={record.level} />
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

    return <>
        <div
            className={type === "word" ? "word-event" : "circle-event"}
            style={type === "word" ? {
                left, bottom, fontSize: lWidth.toFixed() + 'px', color: lineColor
            } : {
                left, bottom, width: r * 2, height: r * 2, borderWidth: lWidth, borderColor: lineColor
            }}
            onClick={() => setVis(true)}
        >
            {type === "word" ? title : null}
        </div>

        <Modal
            title={title}
            open={vis}
            width={1000}
            centered
            footer={null}
            onCancel={() => setVis(false)}
        >
            <Table
                columns={columns}
                dataSource={risklist}
                pagination={false}
            />
        </Modal>
    </>
}