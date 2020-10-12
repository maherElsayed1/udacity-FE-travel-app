var path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");

// start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static("dist"));

app.get("/", function (req, res) {
    res.sendFile('dist/index.html')
    //res.sendFile(path.resolve("src/client/views/index.html"));
});

let projectData = {};

app.post('/postData', function (req, res) {
    projectData['travelFrom'] = req.body.to;
    projectData['travelTo'] = req.body.from;
    projectData['travelDate'] = req.body.date;
    projectData['temp'] = req.body.temp;
    projectData['weatherDesc'] = req.body.weatherDesc;
    projectData['destinationImage'] = req.body.cityImage;

    res.send(projectData);
});

module.exports = app;