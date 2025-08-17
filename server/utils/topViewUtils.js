const getMonthRange = (startMonth, endMonth) => {
    // 解析起始和结束月份
    const [startYear, startMonthNum] = startMonth.split("-").map(Number);
    const [endYear, endMonthNum] = endMonth.split("-").map(Number);
    // 计算总月数差
    const startDate = new Date(startYear, startMonthNum - 1);
    const endDate = new Date(endYear, endMonthNum - 1);
    const monthCount = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth());
    // 生成月份数组
    const months = [];
    for (let i = 0; i <= monthCount; i++) {
        const year = startYear + Math.floor((startMonthNum - 1 + i) / 12);
        const month = ((startMonthNum - 1 + i) % 12) + 1;
        months.push(`${year}-${month.toString().padStart(2, "0")}`);
    }
    return months;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getMonthRange
};