/** @type {import("next").NextConfig} */
const nextConfig = {
    appName: "wmapp",
    // 服务名配置
    serverConfig: {
        serverName: "wmappserver",
        serverPort: 2999,
        loggerName: "wmapp",                            // 日志文件的前缀名
        databasePath: "./server/database/wmapp.db",     // 数据库地址，相对于app.js
        backUpTime: [59, 23, 6],                        // 分钟，时钟，周几
        backUpMaxCount: 10                              // 备份数据库文件数量，超出限制的会删除最先备份的
    },
    // antd不参与编译，版本不兼容的bug
    transpilePackages: ["antd", "@ant-design", "rc-util", "rc-pagination", "rc-picker", "rc-notification", "rc-tooltip"],
    // 取消严格模式，禁止跑两遍
    reactStrictMode: false,
    // 路由重载
    async rewrites() {
        return [
            {
                source: "/wmappserver/:path*",
                destination: "http://127.0.0.1:2999/wmappserver/:path*"
            }
        ];
    }
};

export default nextConfig;
