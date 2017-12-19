'use strict';

define([], eventQueueService);


function eventQueueService() {

    let events = [];

    function subscribe(topic, listenerFn) {
        events[topic] = events[topic] || [];

        let listenerIndex = events[topic].push(listenerFn);

        function unsubscribe() {
            delete events[topic][listenerIndex];
        }

        return {
            unsubscribe
        };
    }

    function publish(topic, data) {
        if (!events[topic]) {
            return;
        }

        events[topic].forEach(listenerFn => listenerFn(data));
    }

    return {
        subscribe,
        publish
    }

}