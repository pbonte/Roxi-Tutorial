const dataGeneration = require('./utils/StreamDataGeneration')
const roxi = require('roxi-js');
const fs = require('fs');

let query = fs.readFileSync('src/query.rq', 'utf-8').toString();
let rules = fs.readFileSync('src/rules.n3', 'utf-8').toString();

async function executeRSP() {
    let abox = ""
    let width = 100;
    let slide = 20;
    let streamingEngine = roxi.JSRSPEngine.new(width, slide, rules, abox, query, rsp_callback);
    let eventTimestamp = 0;
    let value = 0;
    let eventNumber = 0;
    while (value < 100) {
        let observationEvent = await dataGeneration.generateObservationEvent(eventNumber);
        eventNumber = eventNumber + 1;
        for (const quad of observationEvent) {
            let subject = quad.subject.value;
            let predicate = quad.predicate.value;
            let object = quad.object.value

            let triple = (`<${subject}> <${predicate}> <${object}> . `)
            streamingEngine.add(triple, eventTimestamp)
            eventTimestamp = eventTimestamp + 1;

        }
        let randomValue = Math.floor(Math.random() * 11);
        if (randomValue >= 5) {
            let covidEvent = await dataGeneration.generateCovidEvent(eventNumber);
            eventNumber = eventNumber + 1;
            for (const quad of covidEvent) {
                let subject = quad.subject.value;
                let predicate = quad.predicate.value;
                let object = quad.object.value

                let triple = (`<${subject}> <${predicate}> <${object}> . `)
                streamingEngine.add(triple, eventTimestamp);
                eventTimestamp = eventTimestamp + 1;
            }
        }
        else {
            let tracingEvent = await dataGeneration.generateTracingEvent(eventNumber);
            eventNumber = eventNumber + 1;
            for (const quad of tracingEvent) {
                let subject = quad.subject.value;
                let predicate = quad.predicate.value;
                let object = quad.object.value

                let triple = (`<${subject}> <${predicate}> <${object}> . `)
                streamingEngine.add(triple, eventTimestamp);
                eventTimestamp = eventTimestamp + 1;
            }
        }
    }
    value = value + 1;
}

async function rsp_callback(bindings) {

    for (const value of bindings) {
        console.log(value.toString());
    }
}

executeRSP()