#!/usr/bin/env node

const { spawn } = require("child_process");
const pet = require("../index.js");

pet.start();

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: console-pets -- <your-command>");
  console.log("Example: console-pets -- npm test");
  process.exit(0);
}

const separatorIndex = args.indexOf("--");
if (separatorIndex === -1) {
  console.error("Please use -- before your command");
  console.error("Example: console-pets -- npm test");
  process.exit(1);
}

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
