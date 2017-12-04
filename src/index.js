'use strict';

requirejs(['./app/config'], function loadApp() {
    requirejs(['controllers/homepage'], function(Homepage) {
        Homepage.init();
    });
});