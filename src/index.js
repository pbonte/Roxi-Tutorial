const dataGeneration = require('./utils/StreamDataGeneration')
const roxi = require('roxi-js');
const fs = require('fs');

let query = fs.readFileSync('src/query.rq', 'utf-8').toString();
let rules = fs.readFileSync('src/rules.n3', 'utf-8').toString();

let abox = ""
let width = 100;
let slide = 20;
let numberOfObservationsToBeGenerated = 100;
let streamingEngine = roxi.JSRSPEngine.new(width, slide, rules, abox, query, rsp_callback);
let eventTimestamp = 0;
let counterValue = 0;

async function executeRSP() {
    let eventNumber = 0;

    while (counterValue < numberOfObservationsToBeGenerated) {
        let observationEvent = await dataGeneration.generateObservationEvent(eventNumber);
        eventNumber = eventNumber + 1;
        addToRSP(observationEvent);
        let randomValue = Math.floor(Math.random() * 11);
        if (randomValue >= 5) {
            let covidEvent = await dataGeneration.generateCovidEvent(eventNumber);
            addToRSP(covidEvent);
            eventNumber = eventNumber + 1;
        }
        else {
            let tracingEvent = await dataGeneration.generateTracingEvent(eventNumber);
            addToRSP(tracingEvent);
            eventNumber = eventNumber + 1;
        }
        counterValue = counterValue + 1;
    }
}

async function rsp_callback(bindings) {
    for (const value of bindings) {
        console.log(value.toString());
    }
}

async function addToRSP(store) {
    for (const quad of store) {
        let subject = quad.subject.value;
        let predicate = quad.predicate.value;
        let object = quad.object.value;

        let triple = (`<${subject}> <${predicate}> <${object}> . `)
        streamingEngine.add(triple, eventTimestamp);
        eventTimestamp = eventTimestamp + 1;

    }
}

executeRSP()