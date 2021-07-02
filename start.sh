#!/bin/bash
#==========================================#
# Start the MongoDB, Frontend, and Backend #
#==========================================#
mongod --dbpath ./backend/db &
node ./backend/src/index.js &
cd ./frontend/ && export PORT=5000 && npm start
