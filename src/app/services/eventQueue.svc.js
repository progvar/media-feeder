'use strict';

define([], eventQueueService);


function eventQueueService() {

    let eventQueue = {};

    function subscribe(topic, listenerFn) {
        eventQueue[topic] = eventQueue[topic] || [];

        let listenerIndex = eventQueue[topic].push(listenerFn);

        function unsubscribe() {
            delete eventQueue[topic][listenerIndex];
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

    return {
        eventQueue,
        subscribe,
        publish
    }

}