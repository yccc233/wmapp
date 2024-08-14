#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

run_command() {
    local cmd=$1
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

if [[ "$#" -eq 0 ]]; then
    run_command "npm run prod"
elif [[ "$1" == "--build" ]]; then
    if run_command "npm run build"; then
        echo_colored "${GREEN}" "build project SUCCESS!"
    else
        echo -e "${RED}build project ERROR!${NC}"
        exit 1
    fi
    run_command "npm run prod"
elif [[ "$1" == "--install" && "$2" == "--build" ]]; then
    run_command "npm install"
    if run_command "npm run build"; then
        echo_colored "${GREEN}" "build project SUCCESS!"
    else
        echo -e "${RED}build project ERROR!${NC}"
        exit 1
    fi
    run_command "npm run prod"
else
    echo "Invalid arguments. Usage: sh start.sh [--install] [--build]"
    exit 1
fi