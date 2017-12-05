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
    usePositionHandler();

    registerScrollListener();
    registerClickListener();
}

function registerClickListener() {
    $('.filter-btn').on('click', handleFilterToggleClick);
}

function handleFilterToggleClick() {
    let element = $(this);

    if (element.hasClass('active')) {
        return element.removeClass('active');
    }

    element.addClass('active');
}

function registerScrollListener () {
    $(window).on('scroll', usePositionHandler);
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
