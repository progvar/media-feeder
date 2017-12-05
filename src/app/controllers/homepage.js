'use strict';

define(['jquery', 'services/api', 'services/model'], Homepage);

function Homepage($, apiService, modelService) {

    let activeFilters = [];

    function init() {
        handleDOM();
        fetchFeed();
    }

    function fetchFeed() {
        apiService
            .fetchFeed()
            .done(handleFeed)
            .fail(handleError);
    }

    function handleFeed(feed) {
        modelService.updateFeed(feed);
    }

    function handleError(jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
    }

    function updateActiveFilters() {
        let currentFilter = $(this).data('filter'),
            indexOfFilter = activeFilters.indexOf(currentFilter);

            if (indexOfFilter === -1) {
                activeFilters.push(currentFilter)
            } else {
                activeFilters.splice(indexOfFilter, 1);
            }
    }

    function handleDOM() {
        let toggleSortingMenu = () => handleToggleClass('.main-content', 'sorting-menu-opened'),
            toggleFilterClass = event => handleToggleClass(event.target, 'active');

        usePositionHandler();

        registerListener('.sorting-menu-toggle', 'click', toggleSortingMenu);
        registerListener('.filter-btn', 'click', applyHandlers(toggleFilterClass, updateActiveFilters));
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