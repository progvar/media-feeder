define(['jquery'], fetchFeed);


function fetchFeed($) {
    let url = 'http://146.185.158.18/fake_api.php';

    $.ajax({
        url,
        dataType: 'jsonp',
        success: handleFeed
    });
}


function handleFeed(feed) {
    console.log(feed);
}