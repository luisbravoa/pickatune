var player;
var test = document.querySelector('#test');
var qrcode = document.querySelector('#qr');



var $contentWrapper = $('#content-wrapper');
var contentWrapper = document.querySelector('#content-wrapper');

var songQueue = new Queue();
var currentSong;

//$('.navbar').append(global.utils.loadFile('./html/nav.html'));

global.router = new AppRouter;
Backbone.history.start();


function showContent(element) {


    if(element.parentNode !== contentWrapper){
        $contentWrapper.append(element);
    }
    $contentWrapper.children().hide();
    $(element).show();
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
});



global.eventBus.on('song:play', function (song) {

    //console.log('song:play', song);


    //player.src = global.url + '/music/' + song.file.replace(global.config.musicFolder, '');
    player.audio.src ='file:///' + song.file;
    player.setTitle(song.title);
    player.setArtist(song.artist);


    $.get('http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=3560007ae1982c970859a515efeb3174&artist=' + song.artist + '&track=' + song.title + '&format=json',
        function(res){

            console.log(res);
            var data = res.track || {};

            var imgUrl = (data !== undefined && data.album.image && data.album.image.length > 0) ? data.album.image[data.album.image.length - 2]['#text'] : '';
            if(imgUrl){
                player.setImage(imgUrl);
            }

        });


    player.play();
    currentSong = song;

    //global.eventBus.emit('song:played', song);

});
global.eventBus.on('song:add', function (song) {

    if(!player.audio.src || (!player.audio.paused && player.audio.ended)){
        global.eventBus.emit('song:play', song)
    }else{
        // add to queue
        songQueue.add(song);
        global.eventBus.emit('song:added', song);
    }
   //console.log(songQueue);



});
global.eventBus.on('server:ready', function () {
    console.log('server:ready');
    // Initiate the router

    player = new Player();

    player.setImage('file://' + global.baseDir + '/public/img/song_default.png');

    document.querySelector('#player-wrapper').appendChild(player.element);

    $('#qr').attr('src', global.url + '/qr');

    player.audio.addEventListener('ended', function(){
        var next = songQueue.getNext();
        if(next !== undefined){
            //console.log('next', next);
            global.eventBus.emit('song:play', next);
        }else{
            global.eventBus.emit('song:clear');
        }
    });





});

global.eventBus.on('load:songs', function(number, total){
    //console.log('artistAlbum', number, total);
    setLoaderText('loading songs info ' + number + ' of ' + total);
});
global.eventBus.on('load:artistAlbum', function(number, total){
    //console.log('artistAlbum', number, total);
    setLoaderText('loading Artists and Albums Info ' + number + ' of ' + total);
});

global.eventBus.on('config:musicFolder', function(musicFolder){
    requestAnimationFrame(function(){
        global.db.setConfig('musicFolder', musicFolder);
        global.db.deleteAll();
        player.clear();
        global.eventBus.emit('songs:reload', musicFolder);

    });

});

global.eventBus.on('reload:ready', function(musicFolder){
    global.router.navigate("songs", {trigger: true});
    loader(false);
});
global.eventBus.on('reload:error', function(musicFolder){
    loader(false);
});


function setLoaderText(text){
    $('#loader-message').text(text);
}