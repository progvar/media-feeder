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
            let template = `<div class="feed-item" style="background-image: url('${media.picture}')">${getMediaActionsContainer(media.id)}</div>`;

            mediaTemplates.push(template)
        }

        return mediaTemplates;
    }

    function getMediaActionsContainer(mediaId) {
        return `<div class="media-actions">
                    <a class="action-btn watch-later-btn" data-media-id="${mediaId}">
                        <i class="far fa-clock"></i>
                    </a>
                    <a class="action-btn delete-btn" data-media-id="${mediaId}">
                        <i class="far fa-trash-alt"></i>
                    </a>
                </div>`;
    }

    return {
        renderFeed
    }
}