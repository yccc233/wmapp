import moment from "moment"
import { timeFormat, dateFormat } from "@/src/config"
import { useEffect, useState } from "react"

export default function Time({ style }) {

    const [time, setTime] = useState("--:--:--")
    const [date, setDate] = useState("--/--/--")
    const [week, setWeek] = useState("星期-")

    useEffect(() => {
        const interval = setInterval(() => {
            const now = moment();
            setTime(now.format(timeFormat));
            setDate(now.format(dateFormat));
            let dayOfWeek = now.weekday()
            let weekdayName = ""
            switch (dayOfWeek) {
                case 0: weekdayName = "星期日"
                    break
                case 1: weekdayName = "星期一"
                    break
                case 2: weekdayName = "星期二"
                    break
                case 3: weekdayName = "星期三"
                    break
                case 4: weekdayName = "星期四"
                    break
                case 5: weekdayName = "星期五"
                    break
                case 6: weekdayName = "星期六"
                    break
                default: weekdayName = "星期-"
                    break
            }
            setWeek(weekdayName);
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    return <div className={"time"} style={style}>
        <div className="hms">{time}</div>
        <div className="flex fs12">
            <div className="flex1">{date}</div>
            <div>{week}</div>
        </div>
    </div>
}