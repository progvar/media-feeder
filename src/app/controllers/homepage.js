'use strict';

define(['jquery', 'services/api', 'services/model'], Homepage);

function Homepage($, apiService, modelService) {

    let activeFilters = [];

    function init() {
        handleDOM();
        fetchFeed();
    }

    function fetchFeed() {
        return apiService
            .fetchFeed()
            .done(handleFeed)
            .done(applyFilters)
            .done(renderFeed)
            .fail(handleError);
    }

    function handleFeed(feed) {
        modelService.updateFeed(feed);
    }

    function handleError(jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
    }

    function applyFilters(feed) {
        if (!activeFilters.length) {
            return modelService.updateFilteredFeed(feed);
        }

        let filteredFeed = feed.filter(doesMediaComfortFilters);

        modelService.updateFilteredFeed(filteredFeed);
    }

    function renderFeed() {
        let filteredFeed = modelService.filteredFeed;

        if (!filteredFeed || !filteredFeed.length) {
            return;
        }

        let mediaFeedContainer = $('.media-feed main'),
            generatedFeedHtml = filteredFeed.map(getFeedItemTemplate).join('\n');

            mediaFeedContainer.html(generatedFeedHtml);
    }

    function getFeedItemTemplate(media) {
        return `<div class="feed-item" style="background-image: url('${media.picture}')"></div>`;
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
        let toggleSettingsMenu = () => handleToggleClass('.main-content', 'settings-menu-opened'),
            toggleFilterClass = event => handleToggleClass(event.target, 'active');

        usePositionHandler();

        registerListener('.settings-menu-toggle', 'click', toggleSettingsMenu);
        registerListener('.filter-btn', 'click', applyHandlers(toggleFilterClass, updateActiveFilters, fetchFeed));
        registerListener(window, 'scroll', usePositionHandler);
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