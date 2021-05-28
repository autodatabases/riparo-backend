#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

#start server
(cd /home/ec2-user/app-backend && nvm install)
(cd /home/ec2-user/app-backend && pm2 start --name app-backend npm -- start)
