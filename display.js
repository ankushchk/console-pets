const fs = require('fs');
const path = require('path');

class Display {
  constructor(pet) {
    this.pet = pet;
    this.socketPath = this.getSocketPath();
    this.updateInterval = null;
  }

  getSocketPath() {
    const home = process.env.HOME || process.env.USERPROFILE;
    return path.join(home, '.console-pets-state');
  }

  start() {
    this.writeState();
    
    this.updateInterval = setInterval(() => {
      this.pet.nextFrame();
      this.writeState();
    }, 800);
  }

  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    try {
      fs.unlinkSync(this.socketPath);
    } catch (e) {}
  }

  writeState() {
    const state = {
      frame: this.pet.getCurrentFrame(),
      state: this.pet.state,
      timestamp: Date.now()
    };
    
    try {
      fs.writeFileSync(this.socketPath, JSON.stringify(state));
    } catch (e) {
      // console.error("Failed to write state file:", e);
    }
  }
}

module.exports = Display;