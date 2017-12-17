'use strict';

requirejs(['./app/config'], loadApp);

function loadApp() {
    requirejs(['controllers/app.ctrl', 'jquery'], initApp);
}

function initApp(AppController) {
    AppController.initApp();
}