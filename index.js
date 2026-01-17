const chalk = require("chalk");
const Pet = require("./pet");

class ConsolePet {
  constructor() {
    this.pet = new Pet();
    this.lastActivity = Date.now();
    this.updateInterval = null;
  }

  get state() {
    return this.pet.state;
  }

  start() {
    this.hookConsole();
    this.startIdleCheck();
    this.hookProcessEvents();
    this.startAnimation();
    this.pet.setState("idle");
  }

  hookConsole() {
    const originalLog = console.log;
    const originalError = console.error;
    const self = this;

    console.log = function (...args) {
      self.lastActivity = Date.now();
      self.pet.setState("working");
      originalLog.apply(console, args);
    };

    console.error = function (...args) {
      self.lastActivity = Date.now();
      self.pet.setState("error");
      originalError.apply(console, args);
      setTimeout(() => self.pet.setState("idle"), 3000);
    };
  }

  hookProcessEvents() {
    process.on("uncaughtException", (err) => {
      this.pet.setState("error");
      console.error(err);
      process.exit(1);
    });
  }

  showSuccess() {
    this.pet.setState("success");
    this.render();
  }

  showError() {
    this.pet.setState("error");
    this.render();
  }

  startIdleCheck() {
    setInterval(() => {
      const idleTime = Date.now() - this.lastActivity;
      if (idleTime > 5000 && this.pet.state !== "idle") {
        this.pet.setState("idle");
      }
    }, 1000);
  }

  startAnimation() {
    this.updateInterval = setInterval(() => {
      this.pet.nextFrame();
      this.render();
    }, 800);
  }

  setState(newState) {
    this.pet.setState(newState);
  }

  render() {
    // Only clear if we are in a TTY to avoid messing up logs
    if (process.stdout.isTTY) {
      process.stdout.write("\x1b[2K\x1b[1A\x1b[2K\x1b[1A\x1b[2K\x1b[1A\x1b[2K");
      const frame = this.pet.getCurrentFrame();
      process.stdout.write("\n" + frame + "\n");
    }
  }

  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}

const consolePet = new ConsolePet();

module.exports = {
  start: () => consolePet.start(),
  stop: () => consolePet.stop(),
  setState: (state) => consolePet.setState(state),
  showSuccess: () => consolePet.showSuccess(),
  showError: () => consolePet.showError(),
};

if (require.main === module) {
  consolePet.start();
}
