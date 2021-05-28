#!/bin/bash

# change permissions
sudo chown -R ec2-user /home/ec2-user/app-backend

# install dependencies
(cd /home/ec2-user/app-backend && nvm install)
(cd /home/ec2-user/app-backend && npm install)
