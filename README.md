# Roxi Tutorial

This repository contains a version of the RSP4J Tutorial, with [Roxi](https://github.com/pbonte/roxi) (by [Pieter Bonte](https://pbonte.github.io/))

We will use a covid scenario consisting of two room (BlueRoom and RedRoom) and 4 types of streams:

- RFID observations that report the location of a person through RFID tags.
- Facebook check-in posts that also report the location of a person.
- Contact tracing posts that report the presence of two individuals.
- Testing results posts that report the results of a corona test a certain individual took.

## How to Start?

```
git clone https://github.com/argahsuknesib/Roxi-Tutorial
cd Roxi-Tutorial
npm install
cd src
```

In `src/` folder we have,

```
src 
|- utils/
|- index.js
|- query.rq
|- rules.n3
```

- Write reasoning rules in the `rules.n3` file.
- Queries in the `query.rq` file, which has prefixes for you to write the queries.
Then, open your terminal to run the file.
```
node index.js
```

### Example Observations

```

```

## Context 

The standard setup of the COVID scenario,
![COVID Scenario](fig/covid_scenario.png)