define(['client/js/app/App'],function(AppRouter){
    $(function () {

        $.i18n.init({
            lng: 'en',
            debug: true,
            fallbackLng: false,
        }, function() {
            var router = new AppRouter();

            Backbone.history.start();
            router.showLoader(false);
        });

    });
});
