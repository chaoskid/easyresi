#!/bin/bash

# Detect OS
OS="$(uname -s)"

case "${OS}" in
    Linux*) os_type="Linux";;
    Darwin*) os_type="Mac";;
    CYGWIN*|MINGW*|MSYS*) os_type="Windows";;
    *) os_type="UNKNOWN";;
esac

echo "Detected OS: $os_type"

# Running backend and frontend
if [ "$os_type" = "Mac" ]; then
    # For macOS, use osascript to open a new terminal and run the backend commands
    echo "Starting backend in a new terminal..."
    osascript <<EOF
    tell application "Terminal"
        do script "cd '$(pwd)/backend'; source env/bin/activate; python app.py"
    end tell
EOF

    # Start frontend in the current terminal
    echo "Starting frontend..."
    cd frontend
    npm run start

elif [ "$os_type" = "Linux" ]; then
    # For Linux systems
    echo "Starting backend in a new terminal..."
    gnome-terminal -- bash -c "cd backend && source env/bin/activate && python app.py; exec bash"

    # Start frontend in the current terminal
    echo "Starting frontend..."
    cd frontend
    npm run start

elif [ "$os_type" = "Windows" ]; then
    # For Windows systems
    echo "Starting backend in a new terminal..."
    start cmd /k "cd backend && call env\Scripts\activate && python app.py"

    # Start frontend
    echo "Starting frontend..."
    cd frontend
    npm run start

else
    echo "Unsupported OS: $OS"
    exit 1
fi
