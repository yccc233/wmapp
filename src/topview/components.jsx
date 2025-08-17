import { useEffect, useState } from "react";
import { Input, Popover, Typography } from "antd";


const { Paragraph, Title } = Typography;


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
            placeholder={"# 请输入备注，多项之间用空行隔开"}
            autoSize={{ minRows: 3, maxRows: 20 }}
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={blur}
        />
        <div className={"gray fs11 h_center j-s-between"}>
            <span/>
            <span>已备注 {paragraphs.length} 项</span>
        </div>
    </div>;
};


export const ToolTipRemark = ({ remark }) => {
    const [paragraphs, setParagraphs] = useState([]);

    useEffect(() => {
        const _p = remark.split(/\n{2,}/).filter(v => v).map(eachItem => ({
            type: eachItem.startsWith("# ") ? "title" : "content",
            content: eachItem.startsWith("# ") ? eachItem.substring(2) : eachItem
        }));
        setParagraphs(_p);
    }, [remark]);

    return <Popover
        title={"备注"}
        trigger={"click"}
        content={<Typography style={{ maxWidth: 1000, maxHeight: "100vh", overflow: "auto" }}>
            {paragraphs.map((p, i) => {
                return p.type === "title" ? <Title key={`t-${i}`} level={3}>
                    {p.content}
                </Title> : <blockquote key={`b-${i}`}>
                    {p.content.split("\n").map((c, j) => <Paragraph key={`p-${j}`} style={{ marginBottom: 5 }}>{c}</Paragraph>)}
                </blockquote>;
            })}
        </Typography>}
    >
        <span className={"remark-flag"}>
            {paragraphs.filter(p => p.type === "content").length}
        </span>
    </Popover>;
};