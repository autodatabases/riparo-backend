#!/bin/bash

#start server
(cd /home/ec2-user/app-backend && nvm install)
(cd /home/ec2-user/app-backend && pm2 start --name app-backend npm -- start)
