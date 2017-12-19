'use strict';

define(['services/api.svc', 'services/mediaFeed.svc', 'services/eventQueue.svc', 'services/watchItLater.svc'], viewEvents)

function viewEvents(apiService, mediaFeedService, eventQueueService, watchItLaterService) {

    let resetPolling = apiService.resetPolling.bind(apiService),
        fetchFeed = apiService.fetchFeed.bind(apiService),
        setPollingInterval = apiService.setPollingInterval.bind(apiService),
        minInterval = apiService.minInterval;

    let activeFilters = mediaFeedService.activeFilters,
        sortByPropName = mediaFeedService.sortByPropName;


    function initListeners() {
        let toggleFilterClass = event => handleToggleClass(event.target, 'active');

        usePositionHandler();

        registerListener('.settings-menu-toggle', 'click', toggleSettingsMenu);
        registerListener('.filter-btn', 'click', applyHandlers(toggleFilterClass, updateActiveFilters, dispatchFilterChange));
        registerListener('.select-sorting-btn', 'click', toggleSortingOptions);
        registerListener('.sorting-option', 'click', applyHandlers(handleSortingSelection, dispatchSortingChange));
        registerListener('#save-btn', 'click', applyHandlers(handlePollingInputSave, dispatchSortingChange));
        registerListener('.polling-input', 'keyup', handleKeyUp);
        registerListener(window, 'click', closeSortingDropdown);
        registerListener(window, 'scroll', usePositionHandler);
        registerListener(window, 'resize', closeSettingsMenu);
    }

    function initDynamicElementListeners() {
        registerListener('.watch-later-btn', 'click', onWatchItLater);
    }

    function registerListener(selector, type, handler) {
        $(selector).on(type, handler);
    }

    function getMediaIdAttr(element) {
        return $(element).data('media-id');
    }

    function onWatchItLater() {
        watchItLaterService.add(getMediaIdAttr(this));
    }

    function dispatchFilterChange() {
        eventQueueService.publish('filter_change');
    }

    function dispatchSortingChange() {
        eventQueueService.publish('sorting_change')
    }

    function handleToggleClass(targetElement, toggleClass) {
        if (!targetElement) {
            return;
        }

        let target = $(targetElement);

        if (target.hasClass(toggleClass)) {
            return target.removeClass(toggleClass);
        }

        target.addClass(toggleClass);
    }

    function usePositionHandler() {
        !window.requestAnimationFrame ? handleIsFixedClass() : window.requestAnimationFrame(handleIsFixedClass);
    }

    function handleIsFixedClass() {
        let offsetTop = $('.main-content').offset().top,
            scrollTop = $(window).scrollTop();

        if (scrollTop > offsetTop) {
            $('.main-content').addClass('is-fixed');
        } else {
            $('.main-content').removeClass('is-fixed');
        }
    }

    function applyHandlers() {
        let handlers = Array.prototype.slice.call(arguments);

        return function() {
            handlers.forEach(handlerCb => {
                handlerCb.apply(this, arguments);
            });
        }
    }

    function isWindowWidthEnough() {
        let win = $(window);

        return win.width() >= 900;
    }

    function toggleSettingsMenu() {
        if (isWindowWidthEnough()) {
            handleToggleClass('.main-content', 'settings-menu-opened');
            $('.sorting-options').removeClass('opened');
        }
    }

    function closeSettingsMenu() {
        if (!isWindowWidthEnough()) {
            $('.main-content').removeClass('settings-menu-opened');
            $('.sorting-options').removeClass('opened');
        }
    }


    function toggleSortingOptions(event) {
        event.stopPropagation();

        handleToggleClass('.sorting-options', 'opened')
    }

    function closeSortingDropdown(event) {
        let target = $(event.target),
            sortingDropdown = $('.sorting-options');

        if (sortingDropdown.hasClass('opened') && !target.closest('.sorting-options').length) {
            handleToggleClass('.sorting-options', 'opened');
        }
    }

    function handleSortingSelection() {
        let element = $(this),
            selectedSortingText = element.html();

        sortByPropName = element.data('sort-by');

        $('.select-sorting-btn').html(selectedSortingText);

        handleToggleClass('.sorting-options', 'opened');
    }


    function getPollingInputVal() {
        let inputVal = $('.polling-input')[0].valueAsNumber;

        return inputVal && inputVal >= minInterval ? inputVal : null;
    }

    function handleKeyUp(event) {
        let keyCode = event.which || event.keyCode;

        if (keyCode === 13) {
            apiService.setPollingInterval(getPollingInputVal());
        }
    }

    function handlePollingInputSave() {
        apiService.setPollingInterval(getPollingInputVal());
    }

    function updateActiveFilters() {
        let filter = $(this),
            toggledFilterId = filter.data('filter-id'),
            mediaType = filter.data('media-type'),
            isLive = filter.data('is-live'),
            indexOfFilter = activeFilters.findIndex(activeFilter => activeFilter.id === toggledFilterId);

        if (indexOfFilter === -1) {
            activeFilters.push({
                id: toggledFilterId,
                mediaType,
                isLive
            });
        } else {
            activeFilters.splice(indexOfFilter, 1);
        }
    }

    return {
        initListeners,
        initDynamicElementListeners
    }
}