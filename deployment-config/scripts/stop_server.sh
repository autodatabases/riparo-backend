#!/bin/bash

#stop server
pm2 stop all || true
pm2 delete app-backend || true

