#!/usr/bin/env bash

# 确保脚本在 bash 环境中运行
if [ -z "$BASH_VERSION" ]; then
    exec bash "$0" "$@"
    exit $?
fi

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

run_command() {
    local cmd=$1
    echo "Executing: $cmd"
    if ! eval "$cmd"; then
        echo -e "${RED}ERROR${NC}: Failed to execute command '$cmd'"
        return 1
    fi
    return 0
}

echo_colored() {
    local color=$1
    local msg=$2
    echo -e "${color}${msg}${NC}"
}

# 检查应用是否正在运行
is_app_running() {
    # 同时检查前端和后端进程
    local frontend_running=0
    local backend_running=0
    
    if pgrep -f "npm run start" > /dev/null; then
        frontend_running=1
    fi
    
    if pgrep -f "npm run server" > /dev/null; then
        backend_running=1
    fi
    
    # 使用兼容的 test 语法替代 [[ ]]
    if [ "$frontend_running" -eq 1 ] && [ "$backend_running" -eq 1 ]; then
        return 0  # 两个都在运行
    elif [ "$frontend_running" -eq 1 ] || [ "$backend_running" -eq 1 ]; then
        return 2  # 只有一个在运行
    else
        return 1  # 都没运行
    fi
}

# 获取当前运行的应用PID
get_running_pids() {
    local pids=""
    pids+=$(pgrep -f "npm run start")
    pids+=" "
    pids+=$(pgrep -f "npm run server")
    echo "$pids"
}

# 停止正在运行的进程
stop_running_processes() {
    local pids
    pids=$(get_running_pids)
    
    if [ -z "$pids" ]; then
        echo_colored "${YELLOW}" "No running processes found."
        return 0
    fi
    
    echo_colored "${YELLOW}" "Stopping running processes (PIDs: $pids)..."
    
    # 先尝试正常停止
    kill $pids 2>/dev/null
    
    # 等待进程结束
    local wait_time=5
    while [ $wait_time -gt 0 ]; do
        if ! is_app_running; then
            echo_colored "${GREEN}" "Processes stopped successfully."
            return 0
        fi
        sleep 1
        wait_time=$((wait_time - 1))
    done
    
    # 强制终止
    kill -9 $pids 2>/dev/null
    sleep 1
    
    if ! is_app_running; then
        echo_colored "${GREEN}" "Processes force-stopped successfully."
    else
        echo_colored "${RED}" "Failed to stop some processes."
        return 1
    fi
}

# 清除Next.js缓存
clear_next_cache() {
    if [ -d ".next" ]; then
        echo_colored "${YELLOW}" "Clearing Next.js cache..."
        if run_command "rm -rf .next"; then
            echo_colored "${GREEN}" "Next.js cache cleared successfully!"
        else
            echo_colored "${RED}" "Failed to clear Next.js cache!"
            return 1
        fi
    else
        echo_colored "${YELLOW}" "Next.js cache directory (.next) not found. Skipping..."
    fi
    return 0
}

start_app() {
    is_app_running
    local running_status=$?
    
    case $running_status in
        0)
            echo_colored "${YELLOW}" "Application is already running. PID: $(get_running_pids)"
            return 0
            ;;
        2)
            echo_colored "${YELLOW}" "Application is partially running. Restarting..."
            if ! stop_running_processes; then
                echo_colored "${RED}" "Failed to stop running processes. Aborting start."
                return 1
            fi
            ;;
    esac

    echo_colored "${GREEN}" "Starting application components..."
    
    # 启动前端
    nohup npm run start >> wmapp.log 2>&1 &
    local front_pid=$!
    echo_colored "${GREEN}" "Frontend started (PID: $front_pid)"
    
    # 启动后端
    nohup npm run server >> wmapp.log 2>&1 &
    local server_pid=$!
    echo_colored "${GREEN}" "Server started (PID: $server_pid)"
    
    echo_colored "${GREEN}" "Application started. Check wmapp.log for logs."
}

# 显示帮助信息
show_help() {
    echo "Usage: $(basename "$0") [OPTIONS]"
    echo "Options:"
    echo "  --install       Install dependencies"
    echo "  --build         Build the project"
    echo "  --clear-cache   Clear Next.js cache"
    echo "  --start         Start the application"
    echo "  --stop          Stop running processes"
    echo "  --restart       Restart the application"
    echo ""
    echo "Examples:"
    echo "  $(basename "$0") --clear-cache      # Clear cache only"
    echo "  $(basename "$0") --install --start  # Install and start"
    echo "  $(basename "$0") --restart          # Restart the application"
}

# 主逻辑
main() {
    local install=false
    local build=false
    local clear_cache=false
    local start_app_flag=false
    local stop_app_flag=false
    local restart_app_flag=false
    
    # 检查是否没有提供任何参数
    if [ $# -eq 0 ]; then
        show_help
        exit 1
    fi

    # 解析参数
    while [ $# -gt 0 ]; do
        case $1 in
            --install)
                install=true
                shift
                ;;
            --build)
                build=true
                shift
                ;;
            --clear-cache)
                clear_cache=true
                shift
                ;;
            --start)
                start_app_flag=true
                shift
                ;;
            --stop)
                stop_app_flag=true
                shift
                ;;
            --restart)
                restart_app_flag=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                echo "Invalid argument: $1"
                show_help
                exit 1
                ;;
        esac
    done

    # 执行停止操作
    if [ "$stop_app_flag" = true ]; then
        stop_running_processes
    fi

    # 执行安装操作
    if [ "$install" = true ]; then
        run_command "npm install" || exit 1
    fi

    # 执行清除缓存操作
    if [ "$clear_cache" = true ]; then
        clear_next_cache || exit 1
    fi

    # 执行构建操作
    if [ "$build" = true ]; then
        if run_command "npm run build"; then
            echo_colored "${GREEN}" "Project built successfully!"
        else
            exit 1
        fi
    fi

    # 执行重启操作
    if [ "$restart_app_flag" = true ]; then
        if stop_running_processes; then
            start_app
        else
            echo_colored "${RED}" "Failed to stop processes. Aborting restart."
            exit 1
        fi
    # 执行启动操作
    elif [ "$start_app_flag" = true ]; then
        start_app
    fi
}

# 执行主函数
main "$@"