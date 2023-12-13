const rspEngine = require('./utils/RSPEngine')
const fs = require('fs');

/*
Configuring The Roxi Reasoner
*/

let query = fs.readFileSync('src/query.rq', 'utf-8').toString();
let rules = fs.readFileSync('src/rules.n3', 'utf-8').toString();

let windowWidth = 60;
let windowSlide = 15;

let numberOfObservationsToBeGenerated = 100;
let timeOutTime = 1000;

rspEngine.startStreaming(windowWidth, windowSlide, rules, query,numberOfObservationsToBeGenerated, timeOutTime);




