'use strict';

define(['services/mediaFeed.svc'], apiService);

function apiService(mediaFeedService) {
    let defaultInterval = 10000,
        delayedInterval = 30000,
        minInterval = 1000,
        userDefinedInterval = null;

    let currentPollId = null;

    function fetchFeed() {
        let requestConfig = {
            url: 'http://146.185.158.18/fake_api.php',
            dataType: 'jsonp',
        };

        return $.ajax(requestConfig)
            .then(processFeed)
            .then(poll)
            .fail(handleError);
    }

    function processFeed(feed) {
        return mediaFeedService.processFeed(feed);
    }

    function poll(errorOccured) {
        resetPolling();

        let pollingInterval = errorOccured ? delayedInterval : (userDefinedInterval || defaultInterval);

        currentPollId = setTimeout(fetchFeed, pollingInterval);
    }

    function handleError(jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);

        let errorOccured = true;

        poll(errorOccured);
    }

    function resetPolling() {
        if (currentPollId) {
            clearInterval(currentPollId);
        }
    }

    function setPollingInterval(interval) {
        userDefinedInterval = interval;
    }

    return {
        minInterval,
        userDefinedInterval,
        fetchFeed,
        resetPolling,
        setPollingInterval
    };
}

