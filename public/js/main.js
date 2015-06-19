


$(function () {
    var router = new AppRouter();
    Backbone.history.start();
    router.navigate("songs", {trigger: true});


});