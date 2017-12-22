'use strict';

describe('eventQueueService', () => {
    let eventQueueSvc,
        topic,
        listenerFn;

    before(done => {
        requirejs.undef('services/eventQueue.svc'); // safe reset module, since it is used by others as dependency

        requirejs(['services/eventQueue.svc'], eventQueueModule => {
            eventQueueSvc = eventQueueModule;

            done();
        });
    });

    before(() => {
        topic = 'test_topic',
        listenerFn = () => {};
    });

    after(() => {
        eventQueueSvc.eventQueue = {};
    });

    describe('subscribe()', () => {
        let subscription;

        describe('with wrong params', () => {

            before(() => {
                let topic = '',
                    listenerFn = () => {};

                subscription = eventQueueSvc.subscribe(topic, listenerFn);
            });

            it('should return if the `topic` is not a string or fasly', () => {
                let topic = '';

                subscription = eventQueueSvc.subscribe(topic, listenerFn);

                expect(eventQueueSvc.eventQueue).to.be.an('object');
                expect(eventQueueSvc.eventQueue).to.eql({});
            });

            it('should return if the `listenerFn` is not a function or falsy', () => {
                let listenerFn = 'not a function';

                subscription = eventQueueSvc.subscribe(topic, listenerFn);

                expect(eventQueueSvc.eventQueue).to.be.an('object');
                expect(eventQueueSvc.eventQueue).to.eql({});
            });
        });

        describe('with correct params', () => {
            before(() => {
                subscription = eventQueueSvc.subscribe(topic, listenerFn);
            });

            it('should add a new topic called `test_topic`', () => {
                expect(eventQueueSvc.eventQueue).to.be.an('object');
                expect(eventQueueSvc.eventQueue).to.have.property('test_topic');
            });

            it('should register a noop listener to `test_topic`', () => {
                let testTopic = eventQueueSvc.eventQueue['test_topic'];

                expect(testTopic).to.be.an('array');
                expect(testTopic.length).to.eql(1);
            });

            it('should return a method called `unsubscribe`', () => {
                expect(subscription).to.have.property('unsubscribe');
                expect(subscription.unsubscribe).to.be.a('function');
            });

            it('should delelete the noop listener when calling `unsubscribe`', () => {
                subscription.unsubscribe()

                let testTopic = eventQueueSvc.eventQueue['test_topic'];

                expect(testTopic).to.be.an('array');
                expect(testTopic.length).to.eql(0);
            });
        });
    });

    describe('publish()', () => {
        let listenerSpy;

        beforeEach(() => {
            listenerSpy = sinon.spy(listenerFn);

            eventQueueSvc.subscribe(topic, listenerSpy);
        });

        afterEach(() => {
            listenerSpy.reset();
        });

        it('should call the `test_topic` listeners with no arg', () => {
            eventQueueSvc.publish(topic);

            expect(listenerSpy.calledOnce).to.be.true;
            sinon.assert.calledWith(listenerSpy, undefined);
        });

        it('should call the `test_topic` listeners with the data arg', () => {
            let test_data = [1, 2, 3];
            eventQueueSvc.publish(topic, test_data);

            expect(listenerSpy.calledOnce).to.be.true;
            sinon.assert.calledWith(listenerSpy, test_data);
        });
    });
});