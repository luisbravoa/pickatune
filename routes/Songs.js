var _ = require('underscore');

exports.play = function (req, res) {

    var id = parseInt(req.param('id'));
    var song = _.findWhere(global.songs, {id: id});
    if(song){
        global.eventBus.emit('song:play', song);

    }
    res.send();
};

exports.add = function (req, res) {

    var id = parseInt(req.param('id'));
    var song = _.findWhere(global.songs, {id: id});
    if(song){
        global.eventBus.emit('song:add', song);
    }
    res.send();
};

exports.getById = function (req, res) {

    var id = parseInt(req.param('id'));
    var song = _.findWhere(global.songs, {id: id});
    res.send(song);
};

exports.list = function (req, res) {
    res.send(global.songs);
};

exports.listPaginated = function (req, res) {

    var index = parseInt(req.param("index"));
    var length = parseInt(req.param("length"));

    console.log(index, index + length);

    debugger;
    var response = {
        length: global.songs.length,
        data: global.songs.slice(index, index + length)
    };
    res.send(response);
};


exports.getSongByIndex = function (req, res) {

    var indexes = req.param('indexes').split(',');

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


