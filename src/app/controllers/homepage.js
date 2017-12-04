'use strict';

define(['jquery', 'services/api', 'services/model'], Homepage);

function Homepage($, apiService, modelService) {
    function init() {
        registreScrollListener();

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

function registreScrollListener () {
    !window.requestAnimationFrame ? fixGallery($) : window.requestAnimationFrame(fixGallery);

    $(window).on('scroll', function(){
        !window.requestAnimationFrame ? fixGallery($) : window.requestAnimationFrame(fixGallery);
    });
}

function fixGallery() {
    let offsetTop = $('.main-content').offset().top,
        scrollTop = $(window).scrollTop();

    if (scrollTop > offsetTop) {
        $('.main-content').addClass('is-fixed');
    } else {
        $('.main-content').removeClass('is-fixed');
    }
}
