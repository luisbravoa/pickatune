var player = document.querySelector('#player');
var test = document.querySelector('#test');
var qrcode = document.querySelector('#qr');

var $contentWrapper = $('#content-wrapper');
var contentWrapper = document.querySelector('#content-wrapper');

var songQueue = new Queue();
var currentSong;

$('.navbar').append(global.utils.loadFile('./html/nav.html'));


//function showContent(name) {
//    var $element = $('#' + name);
//
//    if ($element.length === 0) {
//        console.log('adding ' + name);
//        contentWrapper.append(global.utils.loadFile('./html/' + name + '.html'));
//    } else {
//        $element.fadeIn();
//
//        console.log('showing ' + name);
//    }
//    contentWrapper.children(':not(#' + name + ')').each(function () {
//        $(this).hide();
//    });
//
//}

//function showContent(element) {
//    var $element = $(element);
//
//    //if ($element.length === 0) {
//    //    console.log('adding ' + name);
//    //    contentWrapper.append(global.utils.loadFile('./html/' + name + '.html'));
//    //} else {
//        $element.fadeIn();
//
//        console.log('showing ' + name);
//    //}
//    $contentWrapper.children().each(function () {
//        if($(this) !== $element){
//            $(this).hide();
//        }
//
//    });
//
//}
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

player.addEventListener('ended', function(){
    var next = songQueue.getNext();
    if(next !== undefined){
        //console.log('next', next);
        global.eventBus.emit('song:play', next);
    }else{
        global.eventBus.emit('song:clear');
    }
});

global.eventBus.on('song:play', function (song) {

    //console.log('song:play', song);


    //player.src = global.url + '/music/' + song.file.replace(global.config.musicFolder, '');
    player.src ='file:///C:/' + song.file;
    player.play();
    currentSong = song;

    //global.eventBus.emit('song:played', song);

});
global.eventBus.on('song:add', function (song) {

    if(!player.src || (!player.paused && player.ended)){
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
    var app_router = new AppRouter;


    Backbone.history.start();

    app_router.navigate("songs", {trigger: true});


});

global.eventBus.on('load:songs', function(number, total){
    //console.log('artistAlbum', number, total);
    setLoaderText('loading songs info ' + number + ' of ' + total);
});
global.eventBus.on('load:artistAlbum', function(number, total){
    //console.log('artistAlbum', number, total);
    setLoaderText('loading Artists and Albums Info ' + number + ' of ' + total);
});


function setLoaderText(text){
    $('#loader-message').text(text);
}