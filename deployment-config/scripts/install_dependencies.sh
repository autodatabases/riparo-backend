#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# change permissions
sudo chown -R ec2-user /home/ec2-user/app-backend

# install dependencies
(cd /home/ec2-user/app-backend && nvm install)
(cd /home/ec2-user/app-backend && npm install)
