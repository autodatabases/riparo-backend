#!/bin/bash

# Copy front files inside deployment-config
shopt -s extglob dotglob
(mv !(deployment-config) deployment-config/app-backend/)