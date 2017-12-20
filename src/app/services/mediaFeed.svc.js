'use strict';

define(['services/eventQueue.svc'], mediaFeedService);

function mediaFeedService(eventQueueService) {
    const WATCH_LATER = 'watchLaterList';

    let currentFeed = [],
        activeFilters = [],
        sortByPropName = 'viewers';

    let processWatchLaterList = false;

    function processFeed(feed) {
        if (processWatchLaterList) {
            syncWatchLaterIds(feed);

            currentFeed = getWatchLaterList(feed);

            eventQueueService.publish('feed_updated', currentFeed);

            return currentFeed;
        }

        currentFeed = sort(filter(feed));

        eventQueueService.publish('feed_updated', currentFeed);

        return currentFeed;


    }

    function getWatchLaterList(feed) {
        let watchLaterIds = fetchFromLocalStorage(WATCH_LATER),
            watchLaterList = feed.filter(feedItem => watchLaterIds.some(id => id === feedItem.id));

        return watchLaterList;
    }

    function syncWatchLaterIds(feed) {
        let watchLaterIds = fetchFromLocalStorage(WATCH_LATER),
            syncronizedWatchLaterIds = watchLaterIds.filter(id => feed.some(feedItem => feedItem.id === id));

            saveToLocalStorage(syncronizedWatchLaterIds);
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

    function add(mediaId) {
        return saveToLocalStorage(addToList(mediaId));
    }

    function saveToLocalStorage(listOfIds) {
        let stringifiedList = JSON.stringify(listOfIds)

        window.localStorage.setItem(WATCH_LATER, stringifiedList)
    }

    function addToList(mediaId) {
        let watchItLaterList = fetchFromLocalStorage(WATCH_LATER),
            isMediaAlreadyAdded = watchItLaterList.some(listItem => checkIfMediaAdded(listItem, mediaId))

        if (isMediaAlreadyAdded) {
            return watchItLaterList;
        }

        watchItLaterList.push(mediaId);

        return watchItLaterList;
    }

    function checkIfMediaAdded(listItem, mediaId){
        return listItem === mediaId;
    }

    function fetchFromLocalStorage(item) {
        return JSON.parse(window.localStorage.getItem(item)) || [];
    }

    function toggleWatchLater() {
        processWatchLaterList = !processWatchLaterList;
    }

    function deleteMedia(mediaId) {
        currentFeed = currentFeed.filter(feedItem => feedItem.id !== mediaId);

        let currentFeedIds = currentFeed.map(feedItem => feedItem.id),
            currentWatchLaterIds = fetchFromLocalStorage(WATCH_LATER),
            syncronizedWatchLaterIds = currentWatchLaterIds.filter(wathcLaterId => currentFeedIds.some(feedId => feedId === wathcLaterId));

        saveToLocalStorage(syncronizedWatchLaterIds)

        eventQueueService.publish('feed_updated', currentFeed);

        return currentFeed;
    }

    return {
        processFeed,
        activeFilters,
        sortByPropName,
        filter,
        sort,
        add,
        toggleWatchLater,
        deleteMedia
    };
}
