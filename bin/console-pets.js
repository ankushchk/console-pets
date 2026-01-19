const { spawn, execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");
const chalk = require("chalk");
const pet = require("../index.js");

const args = process.argv.slice(2);

if (args.length === 0) {
  showUsage();
  process.exit(0);
}

function showUsage() {
  console.log("Usage:");
  console.log("  console-pets start          - Start the background pet daemon");
  console.log("  console-pets stop           - Stop the background pet daemon");
  console.log("  console-pets status         - Check daemon status");
  console.log("  console-pets watch          - Watch the pet live in your terminal");
  console.log("  console-pets -- <command>   - Run a command with the pet watching");
  console.log("\nExample:");
  console.log("  console-pets -- npm test");
}

const command = args[0];

const PID_FILE = path.join(os.homedir(), ".console-pets.pid");

if (command === "start") {
  // Check if already running
  if (fs.existsSync(PID_FILE)) {
    const pid = fs.readFileSync(PID_FILE, "utf8").trim();
    try {
      // Check if process is actually running
      process.kill(parseInt(pid), 0);
      console.log(`Console Pet daemon is already running (PID: ${pid}).`);
      process.exit(0);
    } catch (e) {
      // Process not running, clean up stale PID file
      fs.unlinkSync(PID_FILE);
    }
  }

  const daemonPath = path.join(__dirname, "../daemon.js");
  const logPath = path.join(os.homedir(), ".console-pets.log");
  const out = fs.openSync(logPath, "a");
  const err = fs.openSync(logPath, "a");

  const child = spawn(process.execPath, [daemonPath], {
    detached: true,
    stdio: ["ignore", out, err],
  });

  child.unref();
  console.log("Console Pet daemon started in background.");
  process.exit(0);
} else if (command === "stop") {
  if (fs.existsSync(PID_FILE)) {
    const pid = fs.readFileSync(PID_FILE, "utf8").trim();
    try {
      process.kill(parseInt(pid), "SIGTERM");
      console.log("Console Pet daemon stopped.");
    } catch (e) {
      console.log("Console Pet daemon was not running, but a stale PID file existed. Cleaned up.");
    }
    try { fs.unlinkSync(PID_FILE); } catch (e) {}
  } else {
    console.log("Console Pet daemon is not running.");
  }
  process.exit(0);
} else if (command === "status") {
  const statePath = path.join(os.homedir(), ".console-pets-state");
  let isRunning = false;
  
  if (fs.existsSync(PID_FILE)) {
    const pid = fs.readFileSync(PID_FILE, "utf8").trim();
    try {
      process.kill(parseInt(pid), 0);
      isRunning = true;
    } catch (e) {}
  }

  if (isRunning && fs.existsSync(statePath)) {
    const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
    console.log(`Console Pet is running. State: ${state.state}`);
  } else {
    console.log("Console Pet daemon is not running.");
  }
  process.exit(0);
} else if (command === "watch") {
  const statePath = path.join(process.env.HOME, ".console-pets-state");
  console.log(chalk.yellow("Watching Console Pet... (Press Ctrl+C to exit)\n"));
  
  // Ensure daemon is running
  if (!fs.existsSync(PID_FILE)) {
    console.log(chalk.gray("Daemon not running, starting it now..."));
    execSync(`node "${path.join(__dirname, "console-pets.js")}" start`);
  }

  let lastFrame = "";
  
  // Clear screen and hide cursor
  process.stdout.write("\x1b[?25l");
  
  const update = () => {
    if (fs.existsSync(statePath)) {
      try {
        const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
        if (state.frame !== lastFrame) {
          // Move up 3 lines and clear
          if (lastFrame !== "") {
            process.stdout.write("\x1b[3A\x1b[J");
          }
          console.log(state.frame + "\n");
          lastFrame = state.frame;
        }
      } catch (e) {}
    }
  };

  const interval = setInterval(update, 100);

  process.on("SIGINT", () => {
    clearInterval(interval);
    process.stdout.write("\x1b[?25h"); // Show cursor
    console.log("\nStopped watching.");
    process.exit(0);
  });
  
  update();
  return; // Keep running
}

const separatorIndex = args.indexOf("--");
if (separatorIndex === -1) {
  showUsage();
  process.exit(1);
}

pet.start();

const commandParts = args.slice(separatorIndex + 1);
const cmd = commandParts[0];
const cmdArgs = commandParts.slice(1);

const child = spawn(cmd, cmdArgs, {
  stdio: "inherit",
});

child.on("exit", (code) => {
  if (code === 0) {
    pet.showSuccess();
    setTimeout(() => {
      pet.stop();
      process.exit(0);
    }, 2000);
  } else {
    pet.showError();
    setTimeout(() => {
      pet.stop();
      process.exit(code);
    }, 2000);
  }
});
