var _ = require('underscore');

exports.play = function (req, res) {

    var id = parseInt(req.params.id);
    var song = _.findWhere(global.songs, {id: id});
    if(song){
        global.eventBus.emit('song:play', song);

    }
    res.send();
};

exports.add = function (req, res) {

    var id = parseInt(req.params.id);
    var song = _.findWhere(global.songs, {id: id});
    if(song){
        global.eventBus.emit('song:add', song);
    }
    res.send();
};

exports.getById = function (req, res) {

    var id = parseInt(req.params.id);
    var song = _.findWhere(global.songs, {id: id});
    res.send(song);
};

exports.list = function (req, res) {
    res.send(global.songs);
};

exports.listPaginated = function (req, res) {

    var index = parseInt(req.params.index);
    var length = parseInt(req.params.length);

    console.log(index, index + length);

    debugger;
    var response = {
        length: global.songs.length,
        data: global.songs.slice(index, index + length)
    };
    res.send(response);
};


exports.getSongByIndex = function (req, res) {

    var indexes = req.params.indexes.split(',');

    //debugger;
    var response = {};

    indexes.forEach(function(index){
        if(global.songs[index] !== undefined){
            var song = _.clone(global.songs[index]);

            response[index] = song;
        }
    }.bind(this));

    res.send(response);
};


exports.length = function (req, res) {
    res.send({length: global.songs.length});
};


exports.getSongsByArtist = function (req, res) {
    var artist = req.params.name;
    var response = {};

    var songs = global.songs.filter(function (song) {
        return (song.artist !== undefined && song.artist.toLowerCase() === artist.toLowerCase());
    });


    var albums = {};

    songs.forEach(function (song) {
        if (albums[song.album] === undefined) {
            albums[song.album] = [song];
        } else {
            albums[song.album].push(song);
        }
    });
    response.albums = albums;

    res.send(response);
};



exports.getSongsByAlbum = function (req, res) {
    var artist = req.params.artist;
    var album = req.params.album;

    var response = {};

    response.albums = {};
    response.albums[album] = global.songs.filter(function (song) {
        return (song.artist && song.artist.toLocaleLowerCase() === artist.toLocaleLowerCase() && song.album.toLocaleLowerCase() === album.toLocaleLowerCase());
    });

    //console.log(re)

    //response.albums = albums;

    res.send(response);
};

