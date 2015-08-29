requirejs.config({
    baseUrl: '',
    paths: {
        jquery: 'public/client/js/lib/jquery-2.1.3',
        underscore: 'public/client/js/lib/underscore-min',
        backbone: 'public/client/js/lib/backbone',
        handlebars: 'public/client/js/lib/handlebars-v3.0.1',
        bootstrap: 'public/client/js/lib/bootstrap.min',
        jquery_mobile: 'public/client/js/lib/jquery.mobile.custom',
        text: 'public/client/js/lib/text',
        i18next: 'public/client/js/lib/i18next-latest'
    },
    shim: {
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
    }

});

requirejs(['./ui/init', './ui/main']);