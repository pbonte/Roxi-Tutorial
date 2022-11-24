const n3 = require('n3');
const { DataFactory } = n3;
const { namedNode } = DataFactory;
const store = new n3.Store()
const { RoxiPrefix, RDFType, sosa, saref, sioc, rdfs } = require('./Vocabularies');
const { populateMap } = require('./HelperFunctions');
const people = ['Bob', 'John', 'Alice', 'Elena', 'Carl', 'David']
const roomList = ['Red', 'Blue'];
const typeEventList = ['RFID', 'Facebook'];

let personEventMap = new Map();
let coupleMap = new Map();

async function generateObservationEvent(eventNumber) {
    let randomRoom = roomList[Math.floor(Math.random() * roomList.length)];
    let randomPerson = people[Math.floor(Math.random() * people.length)];
    let randomEvent = typeEventList[Math.floor(Math.random() * typeEventList.length)];

    populateMap(randomPerson, randomEvent, personEventMap)

    let eventType = personEventMap.get(randomPerson);
    switch (eventType) {
        case 'Facebook':
            store.addQuad(
                namedNode(RoxiPrefix + "Post/" + eventNumber),
                namedNode(RDFType),
                namedNode(RoxiPrefix + "FacebookPost")
            )
            store.addQuad(
                namedNode(RoxiPrefix + "FacebookPost"),
                namedNode(rdfs + "subClassOf"),
                namedNode(sioc + "Post")
            )
            store.addQuad(
                namedNode(RoxiPrefix + randomPerson),
                namedNode(rdfs + "type"),
                namedNode(sioc + "User")
            )
            store.addQuad(
                namedNode(RoxiPrefix + "Post/" + eventNumber),
                namedNode(sioc + "has_creator"),
                namedNode(RoxiPrefix + randomPerson)
            )
            store.addQuad(
                namedNode(RoxiPrefix + randomPerson),
                namedNode(RoxiPrefix + "hasCheckIn"),
                namedNode(RoxiPrefix + randomRoom)
            )
            break;
        case 'RFID':
            switch (randomRoom) {
                case 'Blue':
                    store.addQuad(
                        namedNode(RoxiPrefix + "observation/" + eventNumber),
                        namedNode(RDFType),
                        namedNode(sosa + "Observation")
                    ),
                        store.addQuad(
                            namedNode(RoxiPrefix + "observation/" + eventNumber),
                            namedNode(sosa + "hasFeatureOfInterest"),
                            namedNode(RoxiPrefix + randomPerson)
                        ),
                        store.addQuad(
                            namedNode(RoxiPrefix + "observation/" + eventNumber),
                            namedNode(sosa + "madeBySensor"),
                            namedNode(RoxiPrefix + "sensorRFID" + "-Blue")
                        )
                    break;
                case 'Red':
                    store.addQuad(
                        namedNode(RoxiPrefix + "observation/" + eventNumber),
                        namedNode(RDFType),
                        namedNode(saref + "Measurement")
                    )
                    store.addQuad(
                        namedNode(RoxiPrefix + "observation/" + eventNumber),
                        namedNode(saref + "relatesToProperty"),
                        namedNode(RoxiPrefix + "sensorRFID" + "Red")
                    )
                    store.addQuad(
                        namedNode(RoxiPrefix + "observation/" + eventNumber),
                        namedNode(saref + "isMeasurementOf"),
                        namedNode(RoxiPrefix + "Red")
                    )
                    store.addQuad(
                        namedNode(RoxiPrefix + randomPerson),
                        namedNode(RoxiPrefix + "isIn"),
                        namedNode(RoxiPrefix + "Red")
                    )
                    break;
                default:
                    break;
            }
            break;
        default:
            console.log('There has been an error, the type of event is not defined.');
            break;
    }
    return store;
}

async function generateCovidEvent(eventNumber) {
    let randomPerson = people[Math.floor(Math.random() * people.length)];
    store.addQuad(
        namedNode(RoxiPrefix + "observation/" + eventNumber),
        namedNode(RDFType),
        namedNode(RoxiPrefix + "CovidTestResult")
    )
    store.addQuad(
        namedNode(RoxiPrefix + "observation/" + eventNumber),
        namedNode(RoxiPrefix + "who"),
        namedNode(RoxiPrefix + randomPerson),
    )
    store.addQuad(
        namedNode(RoxiPrefix + randomPerson),
        namedNode(RoxiPrefix + "hasResult"),
        namedNode(RoxiPrefix + "positive")
    )
    return store;
}

async function generateTracingEvent(eventNumber) {
    let person = people[Math.floor(Math.random() * people.length)];
    let personTwo = people[Math.floor(Math.random() * people.length)]

    populateMap(person, personTwo, coupleMap);

    store.addQuad(
        namedNode(RoxiPrefix + "contactTracingPost/" + eventNumber),
        namedNode(rdfs + "subClassOf"),
        namedNode(sioc + "Post")
    )
    store.addQuad(
        namedNode(RoxiPrefix + "contactTracingPost/" + eventNumber),
        namedNode(sioc + "has_creator"),
        namedNode(RoxiPrefix + person)
    )
    store.addQuad(
        namedNode(RoxiPrefix + person),
        namedNode(RDFType),
        namedNode(sioc + "User")
    )
    store.addQuad(
        namedNode(RoxiPrefix + coupleMap.get(person)),
        namedNode(RoxiPrefix + "detectedWith"),
        namedNode(RoxiPrefix + person)
    )
    return store;

}

module.exports = { generateObservationEvent, generateCovidEvent, generateTracingEvent }