const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');

class Monitor {
  constructor(pet) {
    this.pet = pet;
    this.lastActivity = Date.now();
    this.watcher = null;
    this.idleCheckInterval = null;
  }

  start() {
    const cwd = process.cwd();
    
    this.watcher = chokidar.watch(cwd, {
      ignored: /(^|[\/\\])\..|(node_modules)/,
      persistent: true,
      ignoreInitial: true
    });

    this.watcher
      .on('change', () => this.onActivity('working'))
      .on('add', () => this.onActivity('working'))
      .on('unlink', () => this.onActivity('working'));

    this.startIdleCheck();
    
    this.monitorShellHistory();
  }

  onActivity(state = 'working') {
    this.lastActivity = Date.now();
    this.pet.setState(state);
  }

  startIdleCheck() {
    this.idleCheckInterval = setInterval(() => {
      const idleTime = Date.now() - this.lastActivity;
      if (idleTime > 5000 && this.pet.state !== 'idle') {
        this.pet.setState('idle');
      }
    }, 1000);
  }

  monitorShellHistory() {
    const home = require('os').homedir();
    const historyFiles = [
      path.join(home, '.bash_history'),
      path.join(home, '.zsh_history')
    ];

    historyFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const histWatcher = chokidar.watch(file, { persistent: true });
        histWatcher.on('change', () => this.onActivity('working'));
      }
    });
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
    }
    if (this.idleCheckInterval) {
      clearInterval(this.idleCheckInterval);
    }
  }
}

module.exports = Monitor;