'use strict';

define(['services/api.svc', 'services/mediaFeed.svc', 'views/events.view', 'views/templates.view', 'services/eventQueue.svc'], AppController);

function AppController(apiService, mediaFeedService, viewEvents, viewTemplates, eventQueueService) {

    let userDefinedInterval = null;

    function initApp() {
        viewEvents.initListeners();
        apiService.fetchFeed();

        eventQueueService.subscribe('filter_change', apiService.fetchFeed);
        eventQueueService.subscribe('sorting_change', apiService.fetchFeed);

        eventQueueService.subscribe('polling_interval_set', apiService.fetchFeed);

        eventQueueService.subscribe('add_to_watch_later', mediaFeedService.add);

        eventQueueService.subscribe('toggle_watch_later', mediaFeedService.toggleWatchLater);
        eventQueueService.subscribe('toggle_watch_later', apiService.fetchFeed);

        eventQueueService.subscribe('delete_media', mediaFeedService.deleteMedia);

        eventQueueService.subscribe('feed_updated', renderFeed);
    }

    function renderFeed(feed) {
        if (!feed) {
            return;
        }

        viewTemplates.renderFeed(feed);
        viewEvents.initDynamicElementListeners();
    }

    return {
        initApp
    }
}