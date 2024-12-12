export default function Logo({style}) {
    return <div className="logo" style={style}>
        <div className={"vhcenter"}>
            <img src={"/img/logo.png"} width={64}/>
        </div>
        <div className={"vhcenter"}>
            <div className={"app-name"}>Baosteel</div>
        </div>
    </div>
}