define(['jquery','./AppPlayer', './Router', 'i18next', 'bootstrap'], function($, AppPlayer, AppRouter){

    global.appPlayer = new AppPlayer({
        onChange: function () {
            global.eventBus.emit('player:change');
        }
    });

    global.router = new AppRouter();

    $(function () {

        $.i18n.init({
            lng: 'en',
            debug: true,
            fallbackLng: false,
            resGetPath: 'public/locales/__lng__/__ns__.json'
        }, function () {
            global.router.loader(true);


            Backbone.history.start();
            $('body').i18n();
            document.querySelector('#player-wrapper').appendChild(global.appPlayer.player.element);
        });


    });

    global.eventBus.on('song:play', function (song) {
        global.appPlayer.play(song);
    });

    global.eventBus.on('song:add', function (song) {

        if (global.appPlayer.isPlaying()) {
            global.eventBus.emit('song:play', song)
        } else {
            // add to queue
            global.appPlayer.addToQueue(song);
            global.eventBus.emit('song:added', song);
        }

    });

    global.eventBus.on('server:ready', function () {
        console.log('server:ready');
        $('#url').text(global.url);
        $('#qr').attr('src', global.url + '/qr');
    });

    global.eventBus.on('load:songs', function (number, total) {
        global.router.setLoaderText('loading songs info ' + number + ' of ' + total);
    });

    global.eventBus.on('load:artistAlbum', function (number, total) {
        global.router.setLoaderText('loading Artists and Albums Info ' + number + ' of ' + total);
    });

    global.eventBus.on('config:musicFolder', function (musicFolder) {
        global.router.loader(true);

        requestAnimationFrame(function () {
            global.db.setConfig('musicFolder', musicFolder);
            global.db.deleteAll();
            global.appPlayer.clear();
            global.eventBus.emit('songs:reload', musicFolder);

        });
    });

    global.eventBus.on('reload:ready', function (musicFolder) {
        global.router.navigate("songs", {
            trigger: true
        });
        global.router.loader(false);
    });

    global.eventBus.on('reload:error', function (musicFolder) {
        global.router.loader(false);
    });
});