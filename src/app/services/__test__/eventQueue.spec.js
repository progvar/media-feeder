'use strict';

require("amd-loader");


let { expect } = require('chai');
let sinon = require('sinon');
let rewire = require('rewire');

let eventQueueSvc = rewire('../eventQueue.svc');


describe('eventQueueSvc', () => {
    after(() => {
        eventQueueSvc.eventQueue = {};
    })
    describe('subscribe', () => {
        let subscription;

        before(() => {
            let topic = 'test_topic',
                listenerFn = () => {};

            subscription = eventQueueSvc.subscribe(topic, listenerFn);
        })

        it('should add a new topic called `test_topic`', () => {
            expect(eventQueueSvc.eventQueue).to.be.an('object');
            expect(eventQueueSvc.eventQueue).to.have.property('test_topic');

        })

        it('should register a noop listener to `test_topic`', () => {
            let testTopic = eventQueueSvc.eventQueue['test_topic'];

            expect(testTopic).to.be.an('array');
            expect(testTopic.length).to.eql(1);
        })

        it('should return a method called `unsubscribe`', () => {
            expect(subscription).to.have.property('unsubscribe');
            expect(subscription.unsubscribe).to.be.a('function');
        })
    })
})