# 🐱 Console Pets

Tiny ASCII animals that live in your terminal and react to your code!

## Installation
```bash
npm install -g console-pets
```

## Usage

### As a CLI wrapper
```bash
console-pets -- npm test
console-pets -- node app.js
```

### In your code
```javascript
require('console-pets').start();

// Your code here
console.log('Working...');
```

## Pet States

- 😴 **Idle** - Sleeping when no activity for 5+ seconds
- ⚡ **Working** - Typing when you log to console
- ✨ **Success** - Celebrating when process exits successfully
- ❌ **Error** - Hiding when errors occur
- 🤔 **Thinking** - Loading animation

## License

MIT