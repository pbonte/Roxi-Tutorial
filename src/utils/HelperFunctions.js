async function sleep(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

function populateMap(argumentOne, argumentTwo, Map) {
    return Map.set(argumentOne, argumentTwo);
}
module.exports = { sleep, populateMap}

