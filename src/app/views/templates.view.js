'use strict';

define([], viewTemplates);


function viewTemplates() {

    function renderFeed(feed) {
        let mediaFeedContainer = $('.media-feed main'),
            generatedFeedHtml = feed.reduce(getFeedItemTemplate, []).join('\n');

            mediaFeedContainer.html(generatedFeedHtml);
    }

    function getFeedItemTemplate(mediaTemplates, media) {
        if (media.picture) {
            let template = `<div class="feed-item" style="background-image: url('${media.picture}')"></div>`;

            mediaTemplates.push(template)
        }

        return mediaTemplates;
    }

    return {
        renderFeed
    }
}