var player = document.querySelector('#player');
var test = document.querySelector('#test');
var qrcode = document.querySelector('#qr');

var contentWrapper = $('#content-wrapper');

$('.navbar').append(utils.loadFile('./html/nav.html'));


function showContent(name) {
    var $element = $('#' + name);

    if ($element.length === 0) {
        console.log('adding ' + name);
        contentWrapper.append(utils.loadFile('./html/' + name + '.html'));
    } else {
        $element.fadeIn();

        console.log('showing ' + name);
    }
    contentWrapper.children(':not(#' + name + ')').each(function () {
        $(this).hide();
    });

}

function loader(show) {

    if (show) {
        $('#loader').modal({
            backdrop: 'static'
        });
    } else {
        $('#loader').modal('hide')
    }

}
$(function () {
    loader(true);
})

eventBus.on('song:play', function (song) {

    player.src = url + '/music/' + song.file.replace(musicFolder, '');
    player.play();



});
eventBus.on('server:ready', function () {
    console.log('server:ready');
    var AppRouter = Backbone.Router.extend({
        routes: {
            "now-playing": "nowPlaying",
            "my-music": 'myMusic',
            "search": 'search',
            "import-music": 'importMusic'
        },
        nowPlaying: function () {
            showContent('now-playing');
        },
        myMusic: function () {
            showContent('my-music');
            
            debugger;
            if(this.myMusicLoaded){   
                return;
            }
            
            loader(true);
            db.selectAllSongs()
                .then(function (data) {
                    loader(false);
                    data.forEach(function (song) {

                        song.play = '<div class="song-controls">' +
                            '<a href="#" class="playButton" data-id="' + song.id + '"><i class="fa fa-play"></i></a> ' +
                            '<a href="#" class="addButton" data-id="' + song.id + '"><i class="fa fa-plus"></i></a>' +
                            '</div>';

                    })

                    var table = new TableLite({
                        columns: [
                            {
                                name: 'play',
                                property: 'play'
                            },
                            {
                                name: 'Title',
                                property: 'title'
                            },
                            {
                                name: 'Artist',
                                property: 'artist'
                            },
                            {
                                name: 'Album',
                                property: 'album'
                            },

                            {
                                name: 'File',
                                property: 'file'
                            }
                        ],
                        data: data,
                        parentElement: document.querySelector('#my-music')
                    });

                    $('.TableLite').delegate('.playButton', 'click', function (e) {
                        e.preventDefault();
                        var id = $(this).attr('data-id');

                        db.getSongById(id)
                            .then(function (song) {
                                eventBus.emit('song:play', song);

                            });
                    })
                    
                    $('.TableLite tr').dblclick(function (e) {
                        e.preventDefault();
                        debugger;
                        var id = $(this).find('.playButton').attr('data-id');

                        db.getSongById(id)
                            .then(function (song) {
                                eventBus.emit('song:play', song);

                            });
                    })
                    debugger;
                    this.myMusicLoaded = true;
                }.bind(this));
        },
        search: function () {
            showContent('search');
        },
        importMusic: function () {
            showContent('import-music');
        }
    });
    // Initiate the router
    var app_router = new AppRouter;


    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();

    app_router.navigate("my-music", {
        trigger: true
    });


    //    //    setTimeout(function(){
    //    qrcode.src = url + '/qr';


    //test.innerHTML = url+ '';


});