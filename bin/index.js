#!/usr/bin/env node
var args = process.argv.splice(process.execArgv.length + 2);

// Setup
if(args[0] == 'setup') {
    var setup = require('../setup');
    setup.init();
}