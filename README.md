# 🐱 Console Pets

Tiny ASCII animals that live in your terminal and react to your code!

## Installation
```bash
npm install -g console-pets
```

## Usage

### As a Background Daemon (Recommended)
This mode lets a pet live in your terminal and react to your activity across all sessions. It starts automatically!

**Add to your shell:**

**For Zsh (Mac default):** Add this to your `~/.zshrc`:
```bash
source /path/to/your/console-pets/shell-prompt.sh
```

**For Bash:** Add this to your `~/.bashrc`:
```bash
source /path/to/your/console-pets/shell-prompt.sh
```

That's it! Every time you open a terminal, the pet will check if it needs to wake up and start watching your work.

### As a CLI wrapper
```bash
console-pets -- npm test
console-pets -- node app.js
```

### Live Watch Mode
See your pet move in real-time in any terminal window:
```bash
console-pets watch
```

## How it works

Console Pets works in three parts:

1.  **The Brain (daemon.js)**: A lightweight background process that monitors your activity.
2.  **The Eye (monitor.js)**: Watches for file changes in your project and keyboard activity in your shell.
3.  **The Display (shell-prompt.sh)**: A tiny script that reads the pet's current state and injects it into your terminal prompt.

## Features

- **Idle** - Sleeping when no activity for 5+ seconds
- **Working** - Typing when you code or run commands
- **Success** - Celebrating when process exits successfully
- **Error** - Hiding when errors occur
- **Thinking** - Loading animation

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.