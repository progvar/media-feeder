define([], watchItLaterService);

function watchItLaterService() {
    const WATCH_IT_LATER_KEY = 'watchItLaterList';

    let watchItLaterList = [];


    function add(mediaId) {
        return saveToLocalStorage(addToList(mediaId));
    }

    function saveToLocalStorage(list) {
        let stringifiedList = JSON.stringify(list)

        window.localStorage.setItem(WATCH_IT_LATER_KEY, stringifiedList)
    }

    function addToList(mediaId) {
        let isMediaAlreadyAdded = watchItLaterList.some(listItem => checkIfMediaAdded(listItem, mediaId))

        if (isMediaAlreadyAdded) {
            return watchItLaterList;
        }

        watchItLaterList.push(mediaId);

        return watchItLaterList;
    }

    function checkIfMediaAdded(listItem, mediaId){
        return listItem === mediaId;
    }

    function fetchListFromLocalStorage() {
        window.localStorage.getItem(WATCH_IT_LATER_KEY);
    }


    return {
        watchItLaterList,
        add
    }
}