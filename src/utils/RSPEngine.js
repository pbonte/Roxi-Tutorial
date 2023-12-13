const dataGeneration = require('./StreamDataGeneration')
const roxi = require('roxi-js');
const { sleep } = require('./HelperFunctions');

let bindingCounter = 0;
let eventTimestamp = 0;
let counterValue = 0;


let streamingEngine = null;


function startStreaming(windowWidth, windowSlide, rules, query, numberOfObservationsToBeGenerated, timeOut) {
    if (streamingEngine != null) {
        executeRSP(numberOfObservationsToBeGenerated, timeOut)
    }
    else {
        streamingEngine = roxi.JSRSPEngine.new(windowWidth, windowSlide, rules, "", query, rsp_callback);
        executeRSP(numberOfObservationsToBeGenerated, timeOut)
    }
}

async function executeRSP(numberOfObservationsToBeGenerated, timeOut) {
    let eventNumber = 0;
    while (counterValue < numberOfObservationsToBeGenerated) {
        let observationEvent = await dataGeneration.generateObservationEvent(eventNumber);
        await sleep(timeOut);
        addToRSP(observationEvent);
        eventNumber = eventNumber + 1;
        let randomValue = Math.floor(Math.random() * 11);
        if (randomValue >= 5) {
            let covidEvent = await dataGeneration.generateCovidEvent(eventNumber);
            await sleep(timeOut);
            addToRSP(covidEvent);
            eventNumber = eventNumber + 1;
        }
        else {
            let tracingEvent = await dataGeneration.generateTracingEvent(eventNumber);
            await sleep(timeOut);
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
module.exports = { startStreaming}

