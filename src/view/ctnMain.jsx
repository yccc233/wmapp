import { Image, Modal, Table } from "antd";
import { useEffect, useRef, useState } from "react";


export default function CtnMain({ portal }) {


    const [baseNum, setBaseNum] = useState([0, 0])

    const imgRef = useRef()

    console.log("portal", portal);
    const events = portal.events || []


    const getBase = () => {
        const height = imgRef.current.clientHeight
        const width = imgRef.current.clientWidth
        setBaseNum([width, height])
    }

    useEffect(() => {
        setTimeout(() => {
            getBase()
        }, 10)
        // 为window对象的resize事件添加事件监听器  
        window.addEventListener('resize', getBase)
        return () => window.removeEventListener('resize', getBase)
    }, [])


    return <div className="content-main">

        <div ref={imgRef} className="img-div">
            <img
                onresize={e => console.log("sasas")
                }
                src={`/riskserver/img/getImageFromServer/${portal.portalImg}`}
            />
            {
                events.map((e, i) => <CircleEvent
                    key={`event-${i}`}
                    base={baseNum}
                    point={e.eventPoint}
                    radius={e.pointRadius}
                    lineWidth={e.lineswidth}
                    lineColor={e.linecolor}
                    title={e.eventTitle}
                    risklist={e.risklist}
                />)
            }
        </div>
    </div>
}


/**
 * 计算的方式：base表示以第一象限为坐标的位置，单位是像素；point是x，y对应的比例 百分比算，radius也是百分比，lineWidth以r为基数，以base最小的为基数
 */
const CircleEvent = ({ base = [], point, radius, lineWidth, lineColor, title, risklist }) => {

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
        title: '图片',
        dataIndex: 'img',
        key: 'img',
        render: txt => <Image width={50} height={50} src={`/riskserver/img/getImageFromServer/${txt}`} />
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

    const [vis, setVis] = useState(false)

    console.log("ppp", { p: [left, bottom], minBase, r, lWidth, risklist });

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