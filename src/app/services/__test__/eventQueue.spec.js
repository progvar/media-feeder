'use strict';

require("amd-loader");


let { expect } = require('chai');
let eventQueueSvc = require('../eventQueue.svc');


describe('eventQueueSvc', () => {
    let subscription;

    after(() => {
        eventQueueSvc.eventQueue = {};
    })

    describe('calling subscribe with wrong params', () => {

        before(() => {
            let topic = '',
                listenerFn = () => {};

            subscription = eventQueueSvc.subscribe(topic, listenerFn);
        })

        it('should return if the `topic` is not a string or fasly', () => {
            let topic = 'test_topic',
                listenerFn = 'not a function';

            subscription = eventQueueSvc.subscribe(topic, listenerFn);

            expect(eventQueueSvc.eventQueue).to.be.an('object');
            expect(eventQueueSvc.eventQueue).to.eql({});
        })

        it('should return if the `listenerFn` is not a function or falsy', () => {
            let topic = '',
                listenerFn = () => {};

            subscription = eventQueueSvc.subscribe(topic, listenerFn);

            expect(eventQueueSvc.eventQueue).to.be.an('object');
            expect(eventQueueSvc.eventQueue).to.eql({});
        })
    })

    describe('calling subscribe with corrent params', () => {
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

        it('should delelete the listener when calling `unsubscribe`', () => {
            subscription.unsubscribe()

            let testTopic = eventQueueSvc.eventQueue['test_topic'];

            expect(testTopic).to.be.an('array');
            expect(testTopic.length).to.eql(0);
        })
    })
})