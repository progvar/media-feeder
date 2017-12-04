'use strict';

define(['jquery'], apiService);

function apiService($) {
    return {
        fetchFeed
    };
}

function fetchFeed() {
    let requestConfig = {
        url: 'http://146.185.158.18/fake_api.php',
        dataType: 'jsonp',
    };

    return $.ajax(requestConfig);
}

