const roxi = require('roxi-js');
const n3 = require('n3');
const { DataFactory } = n3;
const fs = require('fs');
const { namedNode } = DataFactory;
const store = new n3.Store()

const RoxiPrefix = "http://pbonte.github.io/roxi/";
const RDFType = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";

let query = fs.readFileSync('src/query.rq', 'utf-8').toString();
let rules = fs.readFileSync('src/rules.n3', 'utf-8').toString();

const eventPeople = ['Bob', 'John', 'Alice', 'Elena'];
const people = ['Bob', 'John', 'Alice', 'Elena', 'Carl', 'David']
const roomList = ['Red', 'Blue'];
const names = {
    Carl: 'Carl',
    Bob: 'Bob',
    John: 'John',
    Alice: 'Alice',
    David: 'David',
    Elena: 'Elena'
}
const rooms = {
    Red: 'Red',
    Blue: 'Blue'
}
const events = {
    Facebook: 'Facebook',
    RFID: 'RFID',
    Contact: 'Contact',
    COVID: 'COVID'
}
const isWithPerson = ['Carl', 'David'];

let personEventMap = new Map();
personEventMap.set(names.Alice, events.RFID);
personEventMap.set(names.John, events.RFID);
personEventMap.set(names.Bob, events.Facebook);
personEventMap.set(names.Elena, events.Facebook);

let coupleMap = new Map();
coupleMap.set('Carl', 'Bob');
coupleMap.set('David', 'Elena');

async function executeRSP() {
    let abox = ""
    let width = 1000;
    let slide = 200;
    let streamingEngine = roxi.JSRSPEngine.new(width, slide, rules, abox, query, rsp_callback);
    let eventTimestamp = 0;
    let value = 0;
    let eventNumber = 0;
    while (value < 100) {
        let observationEvent = await generateObservationEvent(eventNumber);
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
            let covidEvent = await generateCovidEvent(eventNumber);
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
            let tracingEvent = await generateTracingEvent(eventNumber);
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


async function generateObservationEvent(eventNumber) {
    let randomRoom = roomList[Math.floor(Math.random() * roomList.length)];
    let randomPerson = eventPeople[Math.floor(Math.random() * eventPeople.length)];

    let eventType = personEventMap.get(randomPerson);
    switch (eventType) {
        case 'Facebook':
            store.addQuad(
                namedNode(RoxiPrefix + "observation/" + eventNumber),
                namedNode(RDFType),
                namedNode(RoxiPrefix + "FacebookUpdate")
            );
            store.addQuad(
                namedNode(RoxiPrefix + "observation/" + eventNumber),
                namedNode(RoxiPrefix + "where"),
                namedNode(RoxiPrefix + randomRoom)
            )
            store.addQuad(
                namedNode(RoxiPrefix + "observation/" + eventNumber),
                namedNode(RoxiPrefix + "who"),
                namedNode(RoxiPrefix + randomPerson)
            )
            store.addQuad(
                namedNode(RoxiPrefix + randomPerson),
                namedNode(RoxiPrefix + "isIn"),
                namedNode(RoxiPrefix + randomRoom)
            )
            break;
        case 'RFID':
            store.addQuad(
                namedNode(RoxiPrefix + "observation/" + eventNumber),
                namedNode(RDFType),
                namedNode(RoxiPrefix + "RFIDObservation")
            );
            store.addQuad(
                namedNode(RoxiPrefix + "observation/" + eventNumber),
                namedNode(RoxiPrefix + "where"),
                namedNode(RoxiPrefix + randomRoom)
            )
            store.addQuad(
                namedNode(RoxiPrefix + "observation/" + eventNumber),
                namedNode(RoxiPrefix + "who"),
                namedNode(RoxiPrefix + randomPerson)
            )
            store.addQuad(
                namedNode(RoxiPrefix + randomPerson),
                namedNode(RoxiPrefix + "isIn"),
                namedNode(RoxiPrefix + randomRoom)
            )
            break;
        default:
            console.log('There has been an error, the type of event is not defined.');
            break;
    }

    return store;
}

async function generateCovidEvent(eventNumber) {
    const randomPerson = people[Math.floor(Math.random() * people.length)];
    store.addQuad(
        namedNode(RoxiPrefix + "observation/" + eventNumber),
        namedNode(RDFType),
        namedNode(RoxiPrefix + "TestResult")
    )
    store.addQuad(
        namedNode(RoxiPrefix + "observation/" + eventNumber),
        namedNode(RoxiPrefix + "who"),
        namedNode(RoxiPrefix + randomPerson),
    )
    store.addQuad(
        namedNode(RoxiPrefix + "observation/" + eventNumber),
        namedNode(RoxiPrefix + "hasResult"),
        namedNode(RoxiPrefix + "positive")
    )
    return store;
}

async function generateTracingEvent(eventNumber) {
    let person = isWithPerson[Math.floor(Math.random() * isWithPerson.length)];
    store.addQuad(
        namedNode(RoxiPrefix + "observation/" + eventNumber),
        namedNode(RDFType),
        namedNode(RoxiPrefix + "ContactTracing")
    )
    store.addQuad(
        namedNode(RoxiPrefix + "observation/" + eventNumber),
        namedNode(RoxiPrefix + "who"),
        namedNode(RoxiPrefix + person)
    )
    store.addQuad(
        namedNode(RoxiPrefix + person),
        namedNode(RoxiPrefix + "isWith"),
        namedNode(RoxiPrefix + coupleMap.get(person))
    )
    return store;
}

executeRSP()