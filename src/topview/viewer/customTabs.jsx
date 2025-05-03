import {useEffect, useState} from "react";
import {makePost} from "@/src/utils.jsx";
import {Dropdown, Space} from "antd";
import {CaretDownOutlined, CheckOutlined} from "@ant-design/icons";


export default function CustomTabs({groupId, setGroupId}) {
    const [tabList, setTabList] = useState([]);

    const getIsActiveClass = (topId) => {
        if (topId === -1) {
            return groupId === -1 ? "active pointer" : "pointer";
        } else {
            const parentTab = tabList.find(t => t.group_id === topId);
            return parentTab.group_id === groupId || (parentTab.children && parentTab.children.find(t => t.group_id === groupId))
                ? "active pointer" : "pointer";
        }
    };

    const clickMenu = ({key}) => {
        setGroupId(Number(key));
    };

    useEffect(() => {
        makePost("/topview/getAllMyGroups").then(res => {
            if (res.data) {
                setTabList(res.data);
            }
        });
    }, []);

    return <div className={"flex1 h_center"} style={{marginLeft: 50}}>
        <Space className="h_center" size={"large"}>
            <div className={getIsActiveClass(-1)} onClick={() => setGroupId(-1)}>
                全部
            </div>
            {
                tabList.map((tabItem, index) => {
                    return tabItem.children?.length > 0 ?
                        <Dropdown
                            key={`top-tab-item-${index}`}
                            menu={{
                                onClick: clickMenu,
                                items: tabItem.children.map(child => ({
                                    key: child.group_id,
                                    label: <>
                                        {child.group_name}
                                        {
                                            groupId === child.group_id ?
                                                <CheckOutlined className={"ml5"}/> : null
                                        }
                                    </>
                                }))
                            }}

                        >
                            <div className={getIsActiveClass(tabItem.group_id)}>
                                {tabItem.group_name}
                                <CaretDownOutlined/>
                            </div>
                        </Dropdown>
                        : <div key={`top-tab-item-${index}`} className={getIsActiveClass(tabItem.group_id)}
                               onClick={() => setGroupId(tabItem.group_id)}>
                            {tabItem.group_name}
                        </div>
                })
            }
        </Space>
    </div>;
}