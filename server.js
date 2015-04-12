"use strict";

var http = require('http'),
    path = require('path'),
    express = require('express'),
    app = express(),
    _ = require('underscore'),
    when = require('when');

var request = require('request');

global.models = require(path.join(process.cwd(), 'models', 'index.js')).models;

global.ip = require('ip').address();
global.url = 'http://' + global.ip + ':2323';
global.utils = require('./misc/utils');
global.config = require('./config');


var routes = {
    Main: require('./routes/Main'),
    Index: require('./routes/Index'),
    Songs: require('./routes/Songs'),
    Artists: require('./routes/Artists'),
    Albums: require('./routes/Albums')
};


global.db = require('./misc/db.js');

try {
    global.db.init(openDatabase);
} catch (e) {
    console.log(e)
}

var EventEmitter = require("events").EventEmitter;
global.eventBus = new EventEmitter();



try{

    setTimeout(function(){
        routes.Main.loadfiles();
    }, 3000)

}catch (e){
    console.log(e)
}



var options = {
    host: 'localhost',
    port: 2323
};


//check if server is already running
http.get(options, function (res) {
    //    eventBus.emit('server:ready');
}).on('error', function (e) {
    //server is not yet running

    // all environments
    app.set('port', process.env.PORT || 2323);

    app.use(express.static(path.join(process.cwd(), 'public')));
    app.use('/music', express.static(global.config.musicFolder));


    app.get('/qr', routes.Index.qr);

    // Songs
    app.get('/song', routes.Songs.list);
    app.get('/song/play/:id', routes.Songs.play);
    app.get('/song/add/:id', routes.Songs.add);

    // Artists
    app.get('/artist', routes.Artists.list);
    app.get('/artist/:name/song', routes.Artists.listSongs);

    // Albums
    app.get('/album', routes.Albums.list);


    http.createServer(app).listen(app.get('port'), function (err) {
        console.log('server created');
        global.eventBus.emit('server:ready');
    });
});