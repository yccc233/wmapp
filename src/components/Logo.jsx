export default function Logo({style}) {
    return <div className="logo" style={style}>
        <div className={"vhcenter"}>
            <img src={"/img/logo.png"} width={80}/>
        </div>
        <div>
            <div className={"vhcenter"}>
                <div className={"app-name"}>探风</div>
                <div className={"flex1 h_center"}>
                    <div className={"app-beta"}>beta</div>
                </div>
            </div>
            <div className={"app-desc"}>
                TAN FENG VIEW PAGE
            </div>
        </div>
    </div>
}