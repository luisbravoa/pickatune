define(['client/js/app/App'],function(AppRouter){
    $(function () {
        $.get('/config', function(config){
            $.i18n.init({
                lng: config.language || 'en',
                debug: true,
                fallbackLng: false,
            }, function() {
                var router = new AppRouter();

                Backbone.history.start();
                router.showLoader(false);
            });
        });


    });
});
