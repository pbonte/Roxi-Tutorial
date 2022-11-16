# Roxi Tutorial

This repository contains a version of the RSP4J Tutorial, with Roxi.

We will use a covid scenario consisting of two room (BlueRoom and RedRoom) and 4 types of streams:

- RFID observations that report the location of a person through RFID tags.
- Facebook check-in posts that also report the location of a person.
- Contact tracing posts that report the presence of two individuals.
- Testing results posts that report the results of a corona test a certain individual took.

The standard setup of the COVID scenario,
![COVID Scenario](fig/covid_scenario.png)

The data which will be generated from the stream, and we will be dealing with.
![Data Stream](fig/covid_data.png)

The queries which will be executed to find information,
![Queries](fig/covid_queries.png)

## How to Start?

Clone the repository at `https://github.com/argahsuknesib/Roxi-Tutorial`

You will find the `src/` folder containing the query.rq file where you have to write a queries and a rules.n3 file where you have to write the rules.
