import Logo from "@/src/components/Logo";
import Time from "@/src/components/Time";
import UserAvatar from "@/src/components/UserAvatar";


export default function Top() {
    return <div style={{ height: 80 }} className="flex">
        <Logo />
        <div className="flex1"></div>
        <Time />
        <UserAvatar style={{ width: 120 }} />
    </div>
}