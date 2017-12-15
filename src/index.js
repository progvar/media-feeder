'use strict';

requirejs(['./app/config'], function loadApp() {
    requirejs(['controllers/app.ctrl'], function(AppController) {
        AppController.init();
    });
});