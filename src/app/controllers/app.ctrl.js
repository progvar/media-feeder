'use strict';

define(['jquery', 'services/api', 'services/model'], AppController);

function AppController($, apiService, modelService) {

    let activeFilters = [],
        sortByProp = 'viewers';

    let defaultPollingInterval = 2000,
        delayedPollingInterval = 10000;


    function init() {
        handleDOM();
        fetchFeed();
    }

    function fetchFeed() {
        return apiService
            .fetchFeed()
            .done(poll.bind(null, defaultPollingInterval))
            .done(handleFeed)
            .done(applyFilters)
            .done(applySorting)
            .done(renderFeed)
            .fail(handleError);
    }

    function poll(pollingInterval) {
        setTimeout(fetchFeed, pollingInterval);
    }

    function handleFeed(feed) {
        modelService.updateFeed(feed);
    }

    function handleError(jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);

        poll(delayedPollingInterval);
    }

    function applyFilters(feed) {
        if (!activeFilters.length) {
            modelService.updateFilteredFeed(feed);
            return;
        }

        let filteredFeed = feed.filter(doesMediaComfortFilters);

        modelService.updateFilteredFeed(filteredFeed);
    }

    function applySorting() {
        let filteredFeed = modelService.filteredFeed || modelService.feed || [];

        if (!sortByProp || !filteredFeed.length) {
            return;
        }

        filteredFeed.sort(sortCb)
    }

    function sortCb(mediaA, mediaB) {
        let valA = mediaA[sortByProp],
            valB = mediaB[sortByProp]

        if (valA && valB && typeof valA === 'string' && typeof valB === 'string') {
            return valA.localeCompare(valB);
        }

        return valA > valB ? -1 : 1;
    }

    function renderFeed() {
        let filteredFeed = modelService.filteredFeed;

        if (!filteredFeed || !filteredFeed.length) {
            return;
        }

        let mediaFeedContainer = $('.media-feed main'),
            generatedFeedHtml = filteredFeed.reduce(getFeedItemTemplate, []).join('\n');

            mediaFeedContainer.html(generatedFeedHtml);
    }

    function getFeedItemTemplate(mediaTemplates, media) {
        if (media.picture) {
            let template = `<div class="feed-item" style="background-image: url('${media.picture}')"></div>`;

            mediaTemplates.push(template)
        }

        return mediaTemplates;
    }

    function doesMediaComfortFilters(media) {
        return activeFilters.some(filter => filter.mediaType === media.type && filter.isLive === media.isLive)
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

    function handleDOM() {
        let toggleFilterClass = event => handleToggleClass(event.target, 'active');

        usePositionHandler();

        registerListener('.settings-menu-toggle', 'click', toggleSettingsMenu);
        registerListener('.filter-btn', 'click', applyHandlers(toggleFilterClass, updateActiveFilters, fetchFeed));
        registerListener('.select-sorting-btn', 'click', toggleSortingOptions);
        registerListener('.sorting-option', 'click', applyHandlers(handleSortingSelection, fetchFeed));
        registerListener(window, 'click', closeSortingDropdown);
        registerListener(window, 'scroll', usePositionHandler);
        registerListener(window, 'resize', closeSettingsMenu);
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

        sortByProp = element.data('sort-by');

        $('.select-sorting-btn').html(selectedSortingText);

        handleToggleClass('.sorting-options', 'opened');
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
        if (!sWindowWidthEnough()) {
            $('.main-content').removeClass('settings-menu-opened');
            $('.sorting-options').removeClass('opened');
        }
    }


    function closeSettingsMenu() {
        let win = $(this);

        if (win.width() <= 900) {
            $('.main-content').removeClass('settings-menu-opened');
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

    function registerListener(selector, type, handler) {
        $(selector).on(type, handler);
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

    return {
        init
    }
}