export default function Logo({style}) {
    return <div className="logo" style={style} onClick={() => window.location.href = "/wmapp/appstore"}>
        <div className={"vhcenter"}>
            <img src={"/img/logo.png"} width={64}/>
        </div>
        <div className={"vhcenter"}>
            <div className={"app-name"}>Baosteel</div>
        </div>
    </div>
}