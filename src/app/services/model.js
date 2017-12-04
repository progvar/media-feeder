'use strict';

define([], modelService);

function modelService() {
    let feed = [];

    function updateFeed(newFeed) {
        feed.splice(0);
        feed.push.apply(feed, newFeed);
    }

    return {
        feed,
        updateFeed
    };
}
