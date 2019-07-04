#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const test = require('./lib/test-route');

// const inputs = [ 'POST /submit', '/','/img/couple.jpg', 'img/couple.jpg', '/submit', '/index' ];

const argv = require('yargs')
    .demandCommand(1)
    .argv;

let projectDir = process.cwd();
let nowJsonPath = path.join(projectDir, 'now.json');

if (argv.config) {
  if (!fs.existsSync(argv.config)) {
    return console.error(`now.json file provided by --config does not exist at ${argv.config}`);
  }
  nowJsonPath = argv.config;
  projectDir = path.dirname(argv.config);
} else {
  
  if (!fs.existsSync(nowJsonPath)) {
    console.error(`now.json file does not exist in current directory ${projectDir}. Create one or specify the --config option to test the route on another path`);
    return;
  }
}

const nowJson = require(nowJsonPath);
const routeParams = argv._.join(" ");
const result = test(routeParams, nowJson, projectDir);

if (result.matchedBuilder && result.matchedFile) {
  if (result.fileFound) {
    console.log(`SUCCESS: 
      matched input route ${routeParams} 
      to file ${result.matchedFile} 
      with builder ${result.matchedBuilder}`);
  } else {
    console.log(`WARNING: 
    matched input route ${routeParams} 
    to file ${result.matchedFile} 
    with builder ${result.matchedBuilder} 
    BUT did not find file ${result.matchedFile} in file system`);
  }
} else if (!result.matchedFile) {
  console.log(`ERROR: no route matches for ${routeParams}`);
} else {
  console.log(`ERROR: no builder matches for ${routeParams}`);
}