var qrcode = document.querySelector('#qr');
var $contentWrapper = $('#content-wrapper');
var contentWrapper = document.querySelector('#content-wrapper');

var appPlayer = new AppPlayer();

global.router = new AppRouter();

Backbone.history.start();
document.querySelector('#player-wrapper').appendChild(appPlayer.player.element);

$('#qr').attr('src', global.url + '/qr');

$(function () {
    global.router.loader(true);
});

global.eventBus.on('song:play', function (song) {
    appPlayer.play(song);
});

global.eventBus.on('song:add', function (song) {

    if (appPlayer.isPlaying()) {
        global.eventBus.emit('song:play', song)
    } else {
        // add to queue
        appPlayer.addToQueue(song);
        global.eventBus.emit('song:added', song);
    }

});

global.eventBus.on('server:ready', function () {
    console.log('server:ready');
    $('#url').text(global.url);
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
        appPlayer.clear();
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