const chalk = require('chalk');

class Pet {
  constructor() {
    this.state = 'idle';
    this.frameIndex = 0;
    
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

  setState(newState) {
    if (this.state !== newState) {
      this.state = newState;
      this.frameIndex = 0;
    }
  }

  nextFrame() {
    this.frameIndex = (this.frameIndex + 1) % this.animations[this.state].length;
  }

  getCurrentFrame() {
    const frame = this.animations[this.state][this.frameIndex];
    
    switch(this.state) {
      case 'success':
        return chalk.green(frame);
      case 'error':
        return chalk.red(frame);
      case 'working':
        return chalk.cyan(frame);
      case 'thinking':
        return chalk.yellow(frame);
      default:
        return chalk.gray(frame);
    }
  }
}

module.exports = Pet;