'use strict';

describe('mediaFeedService', () => {

    let mediaFeedSvc;

    before(done => {
        requirejs(['services/mediaFeed.svc'], mediaFeedModule => {
            mediaFeedSvc = mediaFeedModule;
            done();
        })
    })

    describe('processFeed()', () => {
        let processFeedSpy;

        beforeEach(() => {
            processFeedSpy = sinon.spy(mediaFeedSvc, 'processFeed');
        })

        afterEach(() => {
            mediaFeedSvc.processFeed.restore();
        })

        it('should return an empty array if called with a falsy `feed` arg', () => {
            let emptyFeedArray = mediaFeedSvc.processFeed();

            expect(processFeedSpy.calledTwice);
            sinon.assert.calledWithExactly(processFeedSpy);

            expect(emptyFeedArray).to.be.an('array');
            expect(emptyFeedArray).to.eql([]);
        })
    })

    describe('getWatchLaterList()', () => {

    })

    describe('syncWatchLaterIds()', () => {

    })

    describe('filter()', () => {

    })

    describe('doesMediaComfortFilters()', () => {

    })

    describe('sort()', () => {

    })

    describe('sortCb()', () => {

    })

    describe('add()', () => {

    })

    describe('addToList()', () => {

    })

    describe('checkIfMediaAdded()', () => {

    })

    describe('fetchFromLocalStorage()', () => {

    })

    describe('toggleWatchLater()', () => {

    })

    describe('deleteMedia()', () => {

    })
})