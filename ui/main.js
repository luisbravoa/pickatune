define(['jquery','./AppPlayer', './Router', 'i18next', 'bootstrap'], function($, AppPlayer, AppRouter){

    $('#splash').fadeOut(1000,function () {
        $('#splash').remove();
    });
    $('#loader').modal({
        backdrop: 'static'
    });
    global.setCurrent = function () {
        $('.current').removeClass('current');
        $('[data-id=' + global.currentSongId + ']').addClass('current');
    };
    global.router = new AppRouter();

    global.router.loader(true);
    global.appPlayer = new AppPlayer({
        onChange: function (song) {
            global.eventBus.emit('player:change', song);
            global.currentSongId = song.id;
            global.setCurrent();
        }
    });
    $(function () {


        global.db.getConfig('language')
            .then(function (languageConfig) {
                var lang = languageConfig || 'en';

                $.i18n.init({
                    lng: lang,
                    debug: true,
                    fallbackLng: 'en',
                    resGetPath: 'public/locales/__lng__/__ns__.json'
                }, function () {

                    if(!languageConfig){
                        global.db.setConfig('language', $.i18n.lng());
                    }
                    Backbone.history.start();
                    $('body').i18n();
                    document.querySelector('#player-wrapper').appendChild(global.appPlayer.player.element);
                });
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
        $('#url').text(global.url);
        $('#qr').attr('src', global.url + '/qr');
    });

    global.eventBus.on('load:songs', function (number, total) {
        global.router.setLoaderText(sprintf($.i18n.t('LoadingSongs'), number, total));
    });

    //global.eventBus.on('load:artistAlbum', function (number, total) {
    //    global.router.setLoaderText('loading Artists and Albums Info ' + number + ' of ' + total);
    //});

    global.eventBus.on('config:change', function (data) {
        global.router.setLoaderText('');
        global.router.loader(true);
        var currentMusicFolder, currentLanguage;
        var musicFolderPromise = global.db.getConfig('musicFolder')
            .then(function (musicFolder) {
                currentMusicFolder = musicFolder;
            });
        var languagePromise = global.db.getConfig('language')
            .then(function (language) {
                currentLanguage = language;
            });

        when.all([musicFolderPromise, languagePromise])
            .then(function () {
                var musicFolderChanged = false;
                var languageChanged = false;
                if(data.musicFolder !== undefined && data.musicFolder !== '' && currentMusicFolder !== data.musicFolder){
                    global.db.setConfig('musicFolder', data.musicFolder);
                    musicFolderChanged = true;
                }
                if(data.language !== undefined && data.language !== '' && currentLanguage !== data.language){
                    global.db.setConfig('language', data.language);
                    languageChanged = true;
                }

                if(languageChanged){
                    setTimeout(restart, 500);
                }else if(musicFolderChanged){
                    global.db.deleteAll();
                    global.appPlayer.clear();
                    global.eventBus.emit('songs:reload', musicFolder);
                }else{
                    gotoSongs();
                    global.router.loader(false);
                }


            });

    });

    function gotoSongs(){
        global.router.navigate("songs", {
            trigger: true
        });
    }

    global.eventBus.on('reload:ready', function (musicFolder) {
        gotoSongs();
        global.router.loader(false);
    });

    global.eventBus.on('reload:error', function (musicFolder) {
        global.router.loader(false);
        global.router.showDialog();
    });



});

function restart() {
    var gui = require("nw.gui"),
        child_process = require("child_process"),
        win = gui.Window.get(),
        child;

    if (process.platform == "darwin") {
        child = child_process.spawn("open", ["-n", "-a", process.execPath.match(/^([^\0]+?\.app)\//)[1]], {detached: true});
    } else {
        child = child_process.spawn(process.execPath, [], {detached: true});
    }

    child.unref();
    win.hide();
    gui.App.quit();
}

function sprintf (text){
    var values = [];

    for(var i = 1; i < arguments.length; i++){
        values.push(arguments[i]);
    }

    values.forEach(function(value, index){
        text = text.replace(new RegExp('\{\{' + index + '}}', 'g'), value)
    });
    return text;
}


function sprintf(str) {
    var values = [];

    for(var i = 1; i < arguments.length; i++){
        values.push(arguments[i]);
    }
    return str.replace(/{(\d+)}/g, function (match, number) {
        return typeof values[number] != 'undefined'
            ? values[number]
            : match
            ;
    });
}