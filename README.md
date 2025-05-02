## Set Up Backend Server ##
Either run the Java backend by using your IDE or by typing 

```
mvn install
netstat -ano | findstr :8080
taskkill /PID 20732 /F
mvn exec:exec
```
in the back-end folder. This will start the Java server at http://localhost:8080.

## Set Up Frontend Server ##
In the front-end folder, run

```
npm install
npm start
```

This will start the front-end server at http://localhost:3000. You can update the front-end code as the server is running in the development mode (i.e., npm start). It will automatically recompile and reload.

> Note: it's essential to have both the frontend and backend servers running simultaneously. If you need to work on the front end without disrupting the back end, consider opening another terminal window while keeping the previous one running.
