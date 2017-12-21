'use strict';

define([], eventQueueService);


function eventQueueService() {

    let eventQueue = {};

    function subscribe(topic, listenerFn) {
        if (!isType(topic, 'string') || !isType(listenerFn, 'function')) {
            return;
        }

        eventQueue[topic] = eventQueue[topic] || [];

        let listenerIndex = eventQueue[topic].push(listenerFn) - 1;

        function unsubscribe() {
            delete eventQueue[topic].splice(listenerIndex, 1);
        }

        return {
            unsubscribe
        };
    }

    function publish(topic, data) {
        if (!eventQueue[topic]) {
            return;
        }

        eventQueue[topic].forEach(listenerFn => listenerFn(data));
    }

    function isType(target, type) {
        return target && type && typeof target === type;
    }

    return {
        eventQueue,
        subscribe,
        publish,
        isType
    }

}