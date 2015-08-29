require.config({
    baseUrl: '',
    paths: {
        jquery: 'client/js/lib/jquery-2.1.3',
        "jquery.mobile.custom": "client/js/lib/jquery.mobile.custom",
        underscore: 'client/js/lib/underscore-min',
        backbone: 'client/js/lib/backbone',
        handlebars: 'client/js/lib/handlebars-v3.0.1',
        bootstrap: 'client/js/lib/bootstrap.min',
        jquery_mobile: 'client/js/lib/jquery.mobile.custom',
        text: 'client/js/lib/text',
        i18next: 'client/js/lib/i18next-latest'
    },
    shim: {
        // jQuery Mobile
        "jquery.mobile.custom": ["jquery"],
        "bootstrap": ["jquery"],
        "i18next": ["jquery"],

        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        handlebars: {
            exports: 'Handlebars'
        }
    },

});

require(['main']);