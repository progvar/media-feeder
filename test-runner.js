'use strict';

let Mocha = require("mocha"),
    mocha = new Mocha();

// add test libs to the global scope to reduce boilerplate require-ing in the test files
global.expect = require('chai').expect;
global.sinon = require('sinon');
global.requirejs = require('requirejs');
global.window = global;

// needed for dependency injection
requirejs.config({
    nodeRequire: require,
    baseUrl: __dirname,
    paths: {
      services: 'src/app/services'
    }
  });

// TODO: load deps like jQuery

// add test files
mocha.addFile('src/app/services/__test__/eventQueue.spec');
mocha.addFile('src/app/services/__test__/mediaFeed.spec');

// run tests
mocha.run();