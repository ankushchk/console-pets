const Pet = require("./pet");
const Monitor = require("./monitor");
const Display = require("./display");
const fs = require("fs");
const path = require("path");

const PID_FILE = path.join(process.env.HOME, ".console-pets.pid");

const pet = new Pet();
const monitor = new Monitor(pet);
const display = new Display(pet);

function start() {
  // Write PID file
  fs.writeFileSync(PID_FILE, process.pid.toString());
  
  monitor.start();
  display.start();
}

function stop() {
  monitor.stop();
  display.stop();
  
  // Clean up PID file
  try {
    if (fs.existsSync(PID_FILE)) {
      fs.unlinkSync(PID_FILE);
    }
  } catch (e) {}
  
  process.exit(0);
}

// Handle termination signals
process.on("SIGTERM", stop);
process.on("SIGINT", stop);

start();
