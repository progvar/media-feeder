'use strict';

define(['services/api.svc', 'views/events.view', 'views/templates.view', 'services/eventQueue.svc'], AppController);

function AppController(apiService, viewEvents, viewTemplates, eventQueueService) {

    let userDefinedInterval = null;

    function initApp() {
        viewEvents.initListeners();
        apiService.fetchFeed();

        eventQueueService.subscribe('filter_change', apiService.fetchFeed);
        eventQueueService.subscribe('sorting_change', apiService.fetchFeed);
        eventQueueService.subscribe('polling_interval_set', apiService.fetchFeed);
        eventQueueService.subscribe('feed_updated', renderFeed);
    }

    function renderFeed(processedFeed) {
        if (!processedFeed || !processedFeed.length) {
            return;
        }

        viewTemplates.renderFeed(processedFeed);
        viewEvents.initDynamicElementListeners();
    }

    return {
        initApp
    }
}