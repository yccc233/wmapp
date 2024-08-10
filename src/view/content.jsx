import CtnMain from "@/src/view/ctnMain"

export default function Content({ portal }) {

    return <div className="flex1 content">
        <div className="left-content" style={{ width: 360 }}>

        </div>
        <div className="right-content">
            <CtnMain portal={portal} />
        </div>
    </div>
}