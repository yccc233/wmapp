import { Modal, Table } from "antd";
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
            {
                events.map((e, i) => <CircleEvent
                    key={`event-${i}`}
                    base={baseNum}
                    point={e.event_point}
                    radius={e.point_radius}
                    lineWidth={e.lines_width}
                    lineColor={e.line_color}
                    title={e.event_title}
                    risklist={e.risk_list}
                />)
            }
        </div>
    </div>
}


/**
 * 计算的方式：base表示以第一象限为坐标的位置，单位是像素；point是x，y对应的比例 百分比算，radius也是百分比，lineWidth以r为基数，以base最小的为基数
 */
export const CircleEvent = ({ base, point, radius, lineWidth, lineColor, title, risklist }) => {
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
        title: '标题',
        dataIndex: 'title',
        key: 'title',
    }, {
        title: '责任人',
        dataIndex: 'dutier',
        key: 'dutier',
    }, {
        title: '后果',
        dataIndex: 'consequence',
        key: 'consequence',
    }, {
        title: '措施',
        dataIndex: 'measure',
        key: 'measure',
    }, {
        title: '风险等级',
        dataIndex: 'level',
        key: 'level',
    }]


    return <>
        <div
            className="circle-event"
            style={{ left, bottom, width: r * 2, height: r * 2, borderWidth: lWidth, borderColor: lineColor }}
            onClick={() => setVis(true)}
        />
        <Modal
            title={title}
            visible={vis}
            width={1200}
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