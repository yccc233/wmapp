#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

run_command() {
    local cmd=$1
    echo "Executing: $cmd"
    if ! eval $cmd; then
        echo -e "${RED}ERROR${NC}: Failed to execute command '$cmd'"
        exit 1
    fi
}

echo_colored() {
    local color=$1
    local msg=$2
    echo -e "${color}${msg}${NC}"
}

start_app() {
    echo_colored "${GREEN}" "Starting application components..."
    nohup npm run front >> wmapp.log 2>&1 &
    echo_colored "${GREEN}" "Frontend started (PID: $!)"
    nohup npm run server >> wmapp.log 2>&1 &
    echo_colored "${GREEN}" "Server started (PID: $!)"
    echo_colored "${GREEN}" "Application started. Check wmapp.log for logs."
}

# 先检查双参数组合
if [[ "$1" == "--install" && "$2" == "--build" ]]; then
    run_command "npm install"
    if run_command "npm run build"; then
        echo_colored "${GREEN}" "build project SUCCESS!"
    else
        exit 1
    fi
    start_app
# 再检查单参数
elif [[ "$1" == "--install" ]]; then
    run_command "npm install"
elif [[ "$1" == "--build" ]]; then
    if run_command "npm run build"; then
        echo_colored "${GREEN}" "build project SUCCESS!"
    else
        exit 1
    fi
# 无参数情况
elif [[ "$#" -eq 0 ]]; then
    start_app
else
    echo "Invalid arguments. Usage: sh start.sh [--install] [--build]"
    exit 1
fi