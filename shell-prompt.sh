#!/bin/bash

# Function to show pet in prompt
show_pet() {
  if [ -f "$HOME/.console-pets-state" ]; then
    PET_FRAME=$(node -e "
      const fs = require('fs');
      try {
        const state = JSON.parse(fs.readFileSync('$HOME/.console-pets-state', 'utf8'));
        console.log(state.frame);
      } catch(e) {}
    ")
    echo -e "$PET_FRAME"
  fi
}

# Add to your PS1 (bash) or precmd (zsh)
# For bash:
export PS1="\$(show_pet)\n$PS1"

# For zsh, add to ~/.zshrc:
# precmd() { show_pet }