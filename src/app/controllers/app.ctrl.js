'use strict';

define(['services/api.svc', 'services/model.svc', 'views/events.view', 'views/templates.view', 'services/eventQueue.svc'], AppController);

function AppController(apiService, modelService, viewEvents, viewTemplates, eventQueue) {

    let userDefinedInterval = null;

    function initApp() {
        viewEvents.initListeners();
        apiService.fetchFeed();

        eventQueue.subscribe('filter_change', apiService.fetchFeed);
        eventQueue.subscribe('sorting_change', apiService.fetchFeed);
        eventQueue.subscribe('polling_interval_set', apiService.fetchFeed);
        eventQueue.subscribe('feed_updated', renderFeed);
    }

    function renderFeed(processedFeed) {
        if (!processedFeed || !processedFeed.length) {
            return;
        }

        viewTemplates.renderFeed(processedFeed);
    }

    return {
        initApp
    }
}