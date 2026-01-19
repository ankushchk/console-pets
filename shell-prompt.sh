#!/bin/bash

# Configuration
# Find the directory where THIS script is located
PET_PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]:-$0}" )" && pwd )"
STATE_FILE="$HOME/.console-pets-state"
PID_FILE="$HOME/.console-pets.pid"

# Function to start daemon if not running
ensure_daemon() {
  # Fast path: check if PID file exists
  if [ ! -f "$PID_FILE" ]; then
    (node "$PET_PROJECT_DIR/bin/console-pets.js" start > /dev/null 2>&1 &)
  else
    # Check if the process is actually running (Mac/Linux compatible)
    local pid=$(cat "$PID_FILE")
    if ! kill -0 "$pid" > /dev/null 2>&1; then
      (node "$PET_PROJECT_DIR/bin/console-pets.js" start > /dev/null 2>&1 &)
    fi
  fi
}

# Function to show pet in prompt
show_pet() {
  # Only check daemon status occasionally to save performance (e.g. every 10 prompt loads)
  # using a simple environment variable counter
  PET_CHECK_COUNTER=$(( (PET_CHECK_COUNTER + 1) % 10 ))
  if [ "$PET_CHECK_COUNTER" -eq 1 ] || [ ! -f "$PID_FILE" ]; then
    ensure_daemon
  fi
  
  if [ -f "$STATE_FILE" ]; then
    # Use perl or python for faster JSON parsing if available, or just grep/sed for speed
    # But since node is already a dependency, we use it sparingly
    # Optimization: Only run node if the state file actually changed
    local current_mtime=$(stat -f "%m" "$STATE_FILE" 2>/dev/null || stat -c "%Y" "$STATE_FILE" 2>/dev/null)
    if [ "$current_mtime" != "$LAST_PET_MTIME" ]; then
        LAST_PET_MTIME=$current_mtime
        PET_FRAME=$(node -e "
        const fs = require('fs');
        try {
            const state = JSON.parse(fs.readFileSync('$STATE_FILE', 'utf8'));
            console.log(state.frame);
        } catch(e) {}
        ")
    fi
    echo -e "$PET_FRAME"
  fi
}

# For Zsh (common on Mac)
if [ -n "$ZSH_VERSION" ]; then
  # Only add if not already in precmd_functions
  if [[ ! " ${precmd_functions[*]} " =~ " show_pet " ]]; then
    precmd_functions+=(show_pet)
  fi
fi

# For Bash
if [ -n "$BASH_VERSION" ]; then
  # This is a bit more complex for bash, but we'll stick to a simple PS1 update
  if [[ ! "$PS1" =~ "show_pet" ]]; then
    export PS1="\$(show_pet)\n$PS1"
  fi
fi