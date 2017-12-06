'use strict';

define([], modelService);

function modelService() {
    let feed = [],
        filteredFeed = [];

    function updateFeed(newFeed) {
        feed.splice(0);
        feed.push.apply(feed, newFeed);
    }

    function updateFilteredFeed(newFilteredFeed) {
        filteredFeed.splice(0);
        filteredFeed.push.apply(filteredFeed, newFilteredFeed);
    }



    return {
        feed,
        filteredFeed,
        updateFeed,
        updateFilteredFeed
    };
}
