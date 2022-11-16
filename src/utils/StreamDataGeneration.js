const n3 = require('n3');
const vocabularies = require('./Vocabularies');
const { DataFactory } = n3;
const { namedNode } = DataFactory;
const store = new n3.Store()
const { RoxiPrefix, RDFType, sosa, saref, sioc, rdfs } = vocabularies

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


async function generateObservationEvent(eventNumber) {
    let randomRoom = roomList[Math.floor(Math.random() * roomList.length)];
    let randomPerson = eventPeople[Math.floor(Math.random() * eventPeople.length)];

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
                namedNode(RoxiPrefix + "Post/" + eventNumber),
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
                            namedNode(RoxiPrefix + "sensorRFID" + "Blue")
                        ),
                        store.addQuad(
                            namedNode(RoxiPrefix + "sensorRFID" + "Blue"),
                            namedNode(sosa + "isHostedBy"),
                            namedNode(RoxiPrefix + "Blue")
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
                    namedNode(
                        namedNode(RoxiPrefix + "sensorRFID" + "Red"),
                        namedNode(saref + "isPropertyOf"),
                        namedNode(RoxiPrefix + "Rex")   
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
        namedNode(RoxiPrefix + "contactTracingPost" + eventNumber),
        namedNode(RoxiPrefix + "detectedWith"),
        namedNode(RoxiPrefix + coupleMap.get(person))
    )
    return store;
}

module.exports = { generateObservationEvent, generateCovidEvent, generateTracingEvent }