async function sleep(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

function populatePersonEventMap(person, TypeOfEvent, Map) {
    return Map.set(person, TypeOfEvent);
}

function populateCoupleMap(personOne, personTwo, Map) {
    return Map.set(personOne, personTwo);
}
module.exports = { sleep, populateCoupleMap, populatePersonEventMap }

