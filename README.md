# Roxi Tutorial

This repository contains a version of the RSP4J Tutorial, with [Roxi](https://github.com/pbonte/roxi) (by [Pieter Bonte](https://pbonte.github.io/))

We will use a covid scenario consisting of two-room (BlueRoom and RedRoom) and 4 types of streams:

- RFID observations that report the location of a person through RFID tags.
- Facebook check-in posts that also report the location of a person.
- Contact tracing posts that report the presence of two individuals together.
- Testing results posts that report the results of a corona test a certain individual took.
- Both rooms blue and red publish the observation events with different ontologies, i.e SOSA and SAREF respectively.

The people in each room will be moving around from one room to the other.

## Context

The standard setup of the COVID scenario,

![COVID Scenario](https://argahsuknesib.github.io/static-files/figures/roxi.png)

## How to Start?

Make sure to install [NodeJS](https://nodejs.org/en/), npm and git if not installed already.

Clone the repository from [here](https://github.com/pbonte/Roxi-Tutorial)

```
git clone https://github.com/pbonte/Roxi-Tutorial
cd Roxi-Tutorial
npm install
cd src
```

In `src/` folder we will have,

```
src
|- utils/
|- index.js
|- query.rq
|- rules.n3
```

### Description of the files.

- index.js consists of the roxi engine, where you can define the width and size of the window as well as the number of observations to be generated from the streams. It uses the query and rule files.
- query.rq is where you will write the queries for the tasks specified later [here](#tasks).
- rules.n3 is where you will write the rules.


## Data

##### RFID observations (Blue room)
```
 <http://pbonte.github.io/roxi/observation/0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/sosa/Observation>;
                                              <http://www.w3.org/ns/sosa/hasFeatureOfInterest> <http://pbonte.github.io/roxi/Alice>;
                                              <http://www.w3.org/ns/sosa/madeBySensor> <http://pbonte.github.io/roxi/sensorRFID-Blue>.
<http://pbonte.github.io/roxi/sensorRFID-Blue> <http://www.w3.org/ns/sosa/hasLocation> <http://pbonte.github.io/roxi/Blue>.

```

##### RFID observations (Red room)
```
<http://pbonte.github.io/roxi/observation/2> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://saref.etsi.org/core/Measurement> ;
                                             <https://saref.etsi.org/core/relatesToProperty> <http://pbonte.github.io/roxi/sensorRFIDRed>;
                                             <https://saref.etsi.org/core/isMeasurementOf> <http://pbonte.github.io/roxi/Red'> .
<http://pbonte.github.io/roxi/John> <http://pbonte.github.io/roxi/isIn> <http://pbonte.github.io/roxi/Red'> .

```


##### Facebook check-ins
```
<http://pbonte.github.io/roxi/Post/0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://pbonte.github.io/roxi/FacebookPost> .
<http://pbonte.github.io/roxi/Bob> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/Submission/sioc-spec/User> .
<http://pbonte.github.io/roxi/Post/0> <http://www.w3.org/Submission/sioc-spec/has_creator> <http://pbonte.github.io/roxi/Bob> .
<http://pbonte.github.io/roxi/Bob> <http://pbonte.github.io/roxi/hasCheckIn> <http://pbonte.github.io/roxi/Blue> .

```
##### COVID test results

```
<http://pbonte.github.io/roxi/observation/1>  <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://pbonte.github.io/roxi/CovidTestResult>; 
                                              <http://pbonte.github.io/roxi/who> <http://pbonte.github.io/roxi/Elena>.
<http://pbonte.github.io/roxi/Elena> <http://pbonte.github.io/roxi/hasResult> <http://pbonte.github.io/roxi/positive>.


```

##### Contact tracing
```
<http://pbonte.github.io/roxi/contactTracingPost/3> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/Submission/sioc-spec/Post>;
                                                    <http://www.w3.org/Submission/sioc-spec/has_creator> <http://pbonte.github.io/roxi/Bob>.
<http://pbonte.github.io/roxi/Bob> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/Submission/sioc-spec/User>.
<http://pbonte.github.io/roxi/John> <http://pbonte.github.io/roxi/detectedWith> <http://pbonte.github.io/roxi/Bob> .
```

## Tasks

### Task 1: Finding each person's location.

The location of the person is updated by both the Facebook Check-In Posts and the RFID sensors of the two rooms. The sample observation generated from them is the sample [data](#Data) above.

As you can see in the events generated by the RFID sensor in the Blue room which uses SOSA ontology, but `:isIn` relation is not specified directly.
The events generated with the SAREF ontology from the Red room, already have the `:isIn` relation.
A sample SOSA ontology observation from the blue room.

```
:observationX rdf:type sosa:Observation .
:observationX sosa:hasFeatureOfInterest :Carl .
:observationX sosa:madeBySensor :sensorRFID-Blue .
:sensorRFID-Blue sosa:hasLocation :Blue .
```

- **TODO:** Add a rule in `src/rules.n3` to infer the `?person :isIn ?room` relation for the sensor events resulting from the Blue room.

Now you can find the location of the person who was reported with RFID sensor observation with the following query.

```
select ?person ?room where {
    ?person :isIn ?room
}
```

Similarly, to find the location of the person who were reported with Facebook Check-In posts, the following query can be written.

```
select ?person ?room where {
    ?person :hasCheckIn ?room
}
```

We can see that both RFID and Facebook Post observe the localisation of a person, so it makes sense to align these properties to get the location of a person.

- **TODO:** Open the `src/rules.n3` file, and add a rule to align the location update from the Facebook check-in posts (:hasCheckIn) to the location updates from the RFID sensor (:isIn) . This will allow us to query both the location updates in the same way at the same time.

Once the rules have been aligned, re-run the program with:

```
npm run start
```

The following query can now be used to obtain the location of all persons, regardless of their method of localization:
```
select ?person ?room where {
    ?person :isIn ?room
}
```

Note that it could take a few seconds before seeing results.

### Task 2: Detecting which  persons are positive and in which room.

In the previous task, we identified the location of each person.
The covid test result events describes which person is COVID positive. An example observation of the COVID test result stream is,

```
:observationX rdf:type :CovidTestResult .
:observationX :who :Elena .
:Elena :hasResult :positive .
```

- **TODO:** Write a query to find out the COVID-positive person (?person) and their location (?room) by adding and using the `:hasResult` property to check the person is COVID-positive.

Once the query is written, re-run the program with

```
npm run start
```

The result will be the location and the person who has a positive COVID result.

### Task 3: Finding if there's a contact traced person at risk of COVID with a COVID-positive person.

In the previous exercises, we combined streams of observations to find positive COVID persons and their location.

We also have a contact tracing stream, containing the following observations:

```
:CovidTracingPost sioc:has_creator :John .
:John rdf:type sioc:User
:Elena :detectedWith :John
```

So, if John received a positive COVID test and Elena has been detected in the presence of  John, Elena might be at Risk.

- **TODO:** Write a query to find the person at risk of COVID (?personAtRisk) trough contact tracing with a positive person.
- Use  the `:detectedWith` property.

Once the query is written, re-run the program with

```
npm run start
```

The result will be the person who is at risk due to close contact with a COVID positive person.


