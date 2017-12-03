define(['jquery'], fetchFeed);


function fetchFeed($) {
    let requestConfig = {
        url: 'http://146.185.158.18/fake_api.php',
        dataType: 'jsonp',
    };

    $.ajax(requestConfig)
        .done(handleFeed)
        .fail(handleError);
}

function handleFeed(feed) {
    console.log(feed);
}

function handleError(jqXHR, textStatus, errorThrown) {
    console.error(errorThrown);
}