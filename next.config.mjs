/** @type {import("next").NextConfig} */
const nextConfig = {
    appName: "wmapp",
    // 服务名配置
    serverConfig: {
        serverName: "wmappserver",
        serverPort: 2999,
        loggerName: "wmapp",
        databasePath: "./server/database/wmapp.db",
        backUpTime: "21:56"
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
