define(['jquery'], hompepage);


function hompepage($) {
    !window.requestAnimationFrame ? fixGallery($) : window.requestAnimationFrame(fixGallery.bind(this, $));

    $(window).on('scroll', function(){
		!window.requestAnimationFrame ? fixGallery($) : window.requestAnimationFrame(fixGallery.bind(this, $));
    });

    fetchFeed($);
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

function fetchFeed($) {
    let requestConfig = {
        url: 'http://146.185.158.18/fake_api.php',
        dataType: 'jsonp',
    };

    // $.ajax(requestConfig)
    //     .done(handleFeed)
    //     .fail(handleError);
}

function handleFeed(feed) {
    console.log(feed);
}

function handleError(jqXHR, textStatus, errorThrown) {
    console.error(errorThrown);
}