const dataGeneration = require('./utils/StreamDataGeneration')
const roxi = require('roxi-js');
const fs = require('fs');
const { sleep } = require('./utils/HelperFunctions');

let bindingCounter = 0;
let eventTimestamp = 0;
let counterValue = 0;

/*
Configuring The Roxi Reasoner
*/

let query = `
PREFIX : <http://pbonte.github.io/roxi/> 
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
PREFIX sosa: <http://www.w3.org/ns/sosa/> 
PREFIX saref: <https://saref.etsi.org/core/> 
PREFIX sioc: <http://www.w3.org/Submission/sioc-spec/> 
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 


# Run the ?s ?p ?o query to see all the values returned from the stream

select ?s ?p ?o where {
    ?s ?p ?o
}
`;
let rules = `
@prefix : <http://pbonte.github.io/roxi/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix sosa: <http://www.w3.org/ns/sosa/> .
@prefix saref: <https://saref.etsi.org/core/> .
@prefix sioc: <http://www.w3.org/Submission/sioc-spec/> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

`;
let abox =`
@prefix : <http://pbonte.github.io/roxi/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix sosa: <http://www.w3.org/ns/sosa/> .
@prefix saref: <https://saref.etsi.org/core/> .
@prefix sioc: <http://www.w3.org/Submission/sioc-spec/> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

:sensorRFID-Blue sosa:hasLocation :Blue
:sensorRFID-Red saref:isPropertyOf :Red
 `;
let windowWidth = 60;
let windowSlide = 15;
let numberOfObservationsToBeGenerated = 100;
let streamingEngine = roxi.JSRSPEngine.new(windowWidth, windowSlide, rules, abox, query, rsp_callback);

function startStreaming() {
    if (streamingEngine != null) {
        executeRSP()
    }
    else {
        streamingEngine = roxi.JSRSPEngine.new(windowWidth, windowSlide, rules, abox, query, rsp_callback);
        executeRSP()
    }
}


async function executeRSP() {
    let eventNumber = 0;
    while (counterValue < numberOfObservationsToBeGenerated) {
        let observationEvent = await dataGeneration.generateObservationEvent(eventNumber);
        await sleep(1000);
        addToRSP(observationEvent);
        eventNumber = eventNumber + 1;
        let randomValue = Math.floor(Math.random() * 11);
        if (randomValue >= 5) {
            let covidEvent = await dataGeneration.generateCovidEvent(eventNumber);
            await sleep(1000);
            addToRSP(covidEvent);
            eventNumber = eventNumber + 1;
        }
        else {
            let tracingEvent = await dataGeneration.generateTracingEvent(eventNumber);
            await sleep(1000);
            addToRSP(tracingEvent);
            eventNumber = eventNumber + 1;
        }
        counterValue = counterValue + 1;
    }
}

async function rsp_callback(bindings) {
    console.log('------------------------------------------------------');
    console.log(`Variable   ------------Value---------------  Timestamp`);
    for (const value of bindings) {
        console.log(`${value.getVar()}  ${value.getValue()} @ ${bindingCounter}`);
        bindingCounter = bindingCounter + 1;
    }
}

async function addToRSP(store) {
    for (const quad of store) {
        streamingEngine.add(`<${quad.subject.value}> <${quad.predicate.value}> <${quad.object.value}>`, eventTimestamp);
        eventTimestamp = eventTimestamp + 1;
    }
}

startStreaming()
