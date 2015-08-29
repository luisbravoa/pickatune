define(['client/js/app/App', './Discovery'], function (AppRouter, Discovery) {

    var app = {

        initialize: function () {
            this.bindEvents();


        },

        bindEvents: function () {
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        },

        onDeviceReady: function () {
            this.discovery = new Discovery({});
            this.router = new AppRouter({
                retry: this.retry.bind(this)
            });

            this.discovery.search(this.onServerFound.bind(this), this.onServerNotFound.bind(this));
        },
        onServerFound: function (data) {
            console.log(data.url);
            this.router.baseUrl = data.url;
            this.router.showLoader(false);
            Backbone.history.start();
            this.navigate("songs", {
                    trigger: true
                }
            );
        },
        onServerNotFound: function () {

        },
        retry: function (done) {
            this.discovery.search(function(data){
                console.log(data);
                done();
            }, done);
        }

    };

    app.initialize();




});

