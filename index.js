const chalk = require('chalk');

class ConsolePet {
  constructor() {
    this.state = 'idle';
    this.frameIndex = 0;
    this.lastActivity = Date.now();
    this.updateInterval = null;
    
    this.animations = {
      idle: [
        `  ∧＿∧\n ( ˘ω˘ )zzZ`,
        `  ∧＿∧\n ( -ω- )Zzz`
      ],
      working: [
        `  ∧∧∧  ⌨️\n (•̀ᴗ•́)و  *tap tap*`,
        `  ∧∧∧\n (•̀ω•́)  *typing...*`
      ],
      success: [
        `  ∧＿∧\n (◠‿◠) ✓\n  done!`,
        `  ∧＿∧\n (◕‿‿◕) ✨\n  nice!`
      ],
      error: [
        `  ∧＿∧\n (╥﹏╥)  oh no...`,
        `  ∧＿∧\n (✖╭╮✖)  *hides*\n    ||`
      ],
      thinking: [
        `  ∧＿∧\n (・ω・?)  ◯`,
        `  ∧＿∧\n (・ω・)   ◐`,
        `  ∧＿∧\n (・ω・)   ◓`
      ]
    };
  }

  start() {
    this.hookConsole();
    
    this.startIdleCheck();
    
    this.hookProcessEvents();
    
    this.startAnimation();
    
    this.setState('idle');
  }

  hookConsole() {
    const originalLog = console.log;
    const originalError = console.error;
    const self = this;

    console.log = function(...args) {
      self.lastActivity = Date.now();
      self.setState('working');
      originalLog.apply(console, args);
    };

    console.error = function(...args) {
      self.lastActivity = Date.now();
      self.setState('error');
      originalError.apply(console, args);
      setTimeout(() => self.setState('idle'), 3000);
    };
  }

  hookProcessEvents() {
    process.on('uncaughtException', (err) => {
      this.setState('error');
      console.error(err);
      process.exit(1);
    });
  }
  
  showSuccess() {
    this.setState('success');
    this.render();
  }
  
  showError() {
    this.setState('error');
    this.render();
  }

  startIdleCheck() {
    setInterval(() => {
      const idleTime = Date.now() - this.lastActivity;
      if (idleTime > 5000 && this.state !== 'idle') {
        this.setState('idle');
      }
    }, 1000);
  }

  startAnimation() {
    this.updateInterval = setInterval(() => {
      this.frameIndex = (this.frameIndex + 1) % this.animations[this.state].length;
      this.render();
    }, 800);
  }

  setState(newState) {
    if (this.state !== newState) {
      this.state = newState;
      this.frameIndex = 0;
    }
  }

  render() {
    // Clear previous lines
    process.stdout.write('\x1b[2K\x1b[1A\x1b[2K\x1b[1A\x1b[2K\x1b[1A\x1b[2K');
    
    const frame = this.animations[this.state][this.frameIndex];
    
    switch(this.state) {
      case 'success':
        coloredFrame = chalk.green(frame);
        break;
      case 'error':
        coloredFrame = chalk.red(frame);
        break;
      case 'working':
        coloredFrame = chalk.cyan(frame);
        break;
      case 'thinking':
        coloredFrame = chalk.yellow(frame);
        break;
      default:
        coloredFrame = chalk.gray(frame);
    }
    

    console.log('\n' + coloredFrame + '\n');
  }
op() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}


const pet = new ConsolePet();

module.exports = {
  stop: () => pet.stop(),
  setState: (state) => pet.setState(state),
  showSuccess: () => pet.showSuccess(),
  showError: () => pet.showError()
};


if (require.main === module) {
}