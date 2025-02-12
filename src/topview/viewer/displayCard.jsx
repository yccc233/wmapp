import {useEffect, useState} from 'react'

export const DisplayCard1 = ({month}) => {

    useEffect(() => {

    }, [month]);

    return <div className={"board"}>
        统计班组排名（班组的平均分）
        排名 班组 人员数量 平均分
    </div>;
};

export const DisplayCard2 = ({month}) => {

    return <div className={"board"}>
        班组排名的折线图，近半年的数据
    </div>;
};

export const DisplayCard3 = ({month}) => {

    return <div className={"board"}>
        扣分大类，使用词云展示？
    </div>;
};

