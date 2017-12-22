'use strict';




describe('mediaFeedService', () => {
    let mediaFeedSvc;
    let publishSpy = sinon.spy();

    before(() => { // mock mediaFeed dependencies
        requirejs.undef('services/eventQueue.svc');

        requirejs.define('services/eventQueue.svc', [], function() {
            return {
                publish: publishSpy
            };
        });
    });

    before(done => {
        requirejs(['services/mediaFeed.svc'], mediaFeedModule => {
            mediaFeedSvc = mediaFeedModule;
            done();
        });
    });

    describe('processFeed()', () => {
        let processFeedSpy;

        beforeEach(() => {
            processFeedSpy = sinon.spy(mediaFeedSvc, 'processFeed');
        });

        afterEach(() => {
            mediaFeedSvc.processFeed.restore();
        });

        it('should return an empty array if called with a falsy `feed` arg', () => {
            let emptyFeedArray = mediaFeedSvc.processFeed();

            expect(processFeedSpy.calledOnce).to.be.true;
            sinon.assert.calledWithExactly(processFeedSpy);

            expect(emptyFeedArray).to.be.an('array');
            expect(emptyFeedArray).to.eql([]);
        });

        describe('processing the watch later list feed', () => {
            it('should return an empty array if called with a falsy `feed` arg', () => {
                let feed = [
                    { id: 1 },
                    { id: 2 },
                    { id: 3 }
                ],
                emptyFeedArray = mediaFeedSvc.processFeed(feed);

                expect(processFeedSpy.calledOnce).to.be.true;
                sinon.assert.calledWithExactly(processFeedSpy, feed);

                expect(emptyFeedArray).to.be.an('array');
                expect(emptyFeedArray).to.eql(feed);

                expect(publishSpy.calledOnce).to.be.true;
            });
        });
    });

    describe('getWatchLaterList()', () => {

    });

    describe('syncWatchLaterIds()', () => {

    });

    describe('filter()', () => {

    });

    describe('doesMediaComfortFilters()', () => {

    });

    describe('sort()', () => {

    });

    describe('sortCb()', () => {

    });

    describe('add()', () => {

    });

    describe('addToList()', () => {

    });

    describe('checkIfMediaAdded()', () => {

    });

    describe('fetchFromLocalStorage()', () => {

    });

    describe('toggleWatchLater()', () => {

    });

    describe('deleteMedia()', () => {

    });
});