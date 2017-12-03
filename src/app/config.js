requirejs.config({
    baseUrl: './',
    paths: {
        app: 'src/app',
        promise: 'libs/promise.min',
        jquery: 'libs/jquery-3.2.1.min',
        shim: {
            promise: {
                exports: 'Promise',
            }
        }
    }
});