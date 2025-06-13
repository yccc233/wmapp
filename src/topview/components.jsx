import { useEffect, useState } from "react";
import { Badge, Input, Popover } from "antd";

export const TextAreaRemark = ({ unique, defaultValue, onCommit }) => {
    const [value, setValue] = useState(defaultValue || "");

    const blur = (e) => {
        onCommit(e.target.value.trim());
    };

    const paragraphs = value.split(/\n{2,}/).filter(v => v);

    return <div className={"flex-column"}>
        <Input.TextArea
            id={`id-input-remark-${unique}`}
            style={{ width: 250 }}
            placeholder={"# 请输入备注"}
            autoSize={{ minRows: 3, maxRows: 20 }}
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={blur}
        />
        <span className={"gray fs12 align-right"}>{paragraphs.length}个段落</span>
    </div>;
};


export const ToolTipRemark = ({ remark }) => {

    const [paragraphs, setParagraphs] = useState([]);


    useEffect(() => {
        const _p = remark.split(/\n{2,}/).filter(v => v);
        setParagraphs(_p);
    }, [remark]);


    return <Popover title={""}>
        <Badge color="#faad14" style={{ marginLeft: 6 }} size={"small"} count={paragraphs.length}/>
    </Popover>;
};