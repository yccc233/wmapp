export const makePost = (url, params) => {
    // 将数据对象转换为JSON字符串
    const jsonData = JSON.stringify({userId: Number(getCookie("userid")), ...params});
    // 设置请求头，包括内容类型为JSON
    const headers = {
        'Content-Type': 'application/json',
    };
    // 使用fetch API发送POST请求
    return fetch(`/wmappserver${url}`, {
        method: 'POST',
        headers: headers,
        body: jsonData,
    })
        .then(response => {
            // 检查响应状态，如果是200-299之间的状态码，则认为是成功的
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // 解析JSON响应
        })
        .catch(error => {
            throw error; // 重新抛出错误以便在调用处处理
        });
};


export const setCookieKey = (key, value) => {
    const date = new Date();
    date.setTime(date.getTime() + (16 * 60 * 60 * 1000)); // 8H
    const expires = `; expires=${date.toUTCString()}`;
    document.cookie = `${key}=${encodeURIComponent(value)}${expires}; path=/`;
};

export const getCookie = (key) => {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const cKey = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        if (cKey === key) {
            return decodeURIComponent(cookie.substr(eqPos + 1));
        }
    }
    return null;
}

// 生成随机颜色的函数
export const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const getRandomColorFromString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
};

export const getRandomTagColorFromString = (str) => {
    const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
};


export const formatNumber = (num, digits = 1) => {
    if (Number.isInteger(num)) {
        return num;
    }
    return Number(num.toFixed(digits));
}
