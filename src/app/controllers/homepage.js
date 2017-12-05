'use strict';

define(['jquery', 'services/api', 'services/model'], Homepage);

function Homepage($, apiService, modelService) {
    function init() {
        handleDOM();

        fetchFeed();
    }

    function fetchFeed() {
        return apiService
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

    return {
        init
    }
}

function handleDOM() {
    let toggleSortingMenu = () => handleToggle('.main-content', 'sorting-menu-opened'),
        toggleFilter = event => handleToggle(event.target, 'active');

    usePositionHandler();

    registerListener('.sorting-menu-toggle', 'click', toggleSortingMenu);
    registerListener('.filter-btn', 'click', toggleFilter);
    registerListener(window, 'scroll', usePositionHandler);
}

function registerListener(selector, type, handler) {
    $(selector).on(type, handler);
}

function handleToggle(targetElement, toggleClass) {
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
