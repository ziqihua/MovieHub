# CIS5500_Project

- Project repository for CIS 5500 [Database management] at University of Pennsylvania

## How to run the project
- Go to src/server
    - Change the credentials in the config.json file. The database is called "project"
    - run `npm install` to install the necessary packages
    - run `npm start` to start the backend server. 
    - The backend can then be tested on http://localhost:8080 (or the port number you specificied in config.json under "server_port")
- Go to src/client
    - run `npm install` to install the necessary packages
    - run `npm start` to start the front end
    - The front end webpage should be automatically launched on your default web browser. Alternatively, go to http://localhost:3000 on the same machine
