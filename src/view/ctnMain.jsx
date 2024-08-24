'use client'
import {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {setPortalDetail} from "@/src/store/viewReducer.jsx";

export default function CtnMain({portal}) {

    const [baseNum, setBaseNum] = useState([0, 0])
    const [imageOk, setImageOk] = useState(false)
    const imgRef = useRef()

    const events = portal.events || []

    const getBase = () => {
        const height = imgRef.current.clientHeight
        const width = imgRef.current.clientWidth
        setBaseNum([width, height])
    }

    const imageLoaded = () => {
        setImageOk(true)
    }

    useEffect(() => {
        getBase()
        setTimeout(() => {
            getBase()
        }, 50)
    }, [portal, imageOk])

    useEffect(() => {
        if (typeof window === "object") {
            // 为window对象的resize事件添加事件监听器
            window.addEventListener('resize', getBase)
            return () => window.removeEventListener('resize', getBase)
        }
    }, [])

    return <div className="content-main">
        <div ref={imgRef} className="img-div">
            <img onLoad={imageLoaded} src={`/riskserver/img/getImageFromServer/${portal.portal_img}`}/>
            {imageOk && events.map((e, i) => <CircleEvent
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
export const CircleEvent = ({type, base, point, radius, lineWidth, lineColor, title, risklist}) => {

    const dispatch = useDispatch()

    if (!base || !point) {
        return null
    }

    const minBase = base[0] < base[1] ? base[0] : base[1]
    const r = minBase * radius / 100

    const left = base[0] * point[0] / 100 - r
    const bottom = base[1] * point[1] / 100 - r

    const lWidth = r * lineWidth / 100

    const showRisk = () => {
        const rList = []
        risklist.forEach(r => {
            rList.push({
                ...r,
                event: title
            })
        })
        dispatch(setPortalDetail({title: `${title} 风险`, visible: true, risks: rList}))
    }

    return <>
        <div
            className={type === "word" ? "word-event" : "circle-event"}
            style={type === "word" ? {
                left, bottom, fontSize: lWidth.toFixed() + 'px', color: lineColor
            } : {
                left, bottom, width: r * 2, height: r * 2, borderWidth: lWidth, borderColor: lineColor
            }}
            onClick={showRisk}
        >
            {type === "word" ? title : null}
        </div>
    </>
}