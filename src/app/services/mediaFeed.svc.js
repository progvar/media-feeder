'use strict';

define([], mediaFeedService);

function mediaFeedService() {
    let processedFeed = [],
        watchItLaterList = [];

    let activeFilters = [],
        sortByPropName = 'viewers';

    function processFeed(feed) {
        return persist(sort(filter(feed)));
    }

    function persist(feed) {
        processedFeed.splice(0);
        processedFeed.push.apply(processedFeed, feed);

        return processedFeed;
    }

    function filter(feed) {
        if (!activeFilters.length) {
            return feed;
        }

        return feed.filter(doesMediaComfortFilters);
    }

    function doesMediaComfortFilters(media) {
        return activeFilters.some(filter => filter.mediaType === media.type && filter.isLive === media.isLive)
    }

    function sort(feed) {
        let feedToSort = feed || [];

        if (!sortByPropName || !feedToSort.length) {
            return feedToSort;
        }

        return feedToSort.sort(sortCb);
    }

    function sortCb(mediaA, mediaB) {
        let valA = mediaA[sortByPropName],
            valB = mediaB[sortByPropName]

        if (valA && valB && typeof valA === 'string' && typeof valB === 'string') {
            return valA.localeCompare(valB);
        }

        return valA > valB ? -1 : 1;
    }

    return {
        processFeed,
        activeFilters,
        sortByPropName,
        persist,
        filter,
        sort
    };
}
