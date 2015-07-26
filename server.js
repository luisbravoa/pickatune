"use strict";


var EventEmitter = require("events").EventEmitter;
global.eventBus = new EventEmitter();

var http = require('http'),
    path = require('path'),
    express = require('express'),
    app = express(),
    _ = require('underscore'),
    when = require('when');

var Discover = require('./misc/discover');
new Discover();

global.models = require(path.join(process.cwd(), 'models', 'index.js')).models;

global.ip = require('ip').address();
global.url = 'http://' + global.ip + ':2323';
global.utils = require(path.join(process.cwd(), 'misc', 'utils.js'));
//global.config = require('./config');

global.baseDir = process.cwd();

var routes = {
    Main: require('./routes/Main'),
    Index: require('./routes/index'),
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

function reload() {
    global.db.getConfig('musicFolder')
        .then(function (musicFolder) {

            if (musicFolder !== undefined && musicFolder !== 'undefined') {
                console.log('refresssssssssssssssssssh', musicFolder);
                routes.Main.loadfiles(musicFolder);
                app.use('/music', express.static(musicFolder));
            } else {
                global.eventBus.emit('reload:error');
            }
            console.log('>>>>>>>>>>. ', musicFolder);
        });

}
reload();

global.eventBus.on('songs:reload', reload);


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

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });



    app.get('/qr', routes.Index.qr);
    app.get('/songs/length', routes.Songs.length);
    app.get('/songs/index/:indexes', routes.Songs.getSongByIndex);
    app.get('/songs/play/:id', routes.Songs.play);
    app.get('/songs/add/:id', routes.Songs.add);
    // Songs
    app.get('/song', routes.Songs.list);
    app.get('/songs/:id', routes.Songs.getById);


    // Artists
    app.get('/artists', routes.Artists.list);
    app.get('/artists/:artist/albums/:album/songs', routes.Songs.getSongsByAlbum);
    app.get('/artists/:name/songs', routes.Songs.getSongsByArtist);

    app.get('/artists/:index/:length', routes.Artists.listPaginated);



    // Albums
    app.get('/albums', routes.Albums.list);

    app.get('/albums/:index/:length', routes.Albums.listPaginated);


    http.createServer(app).listen(app.get('port'), function (err) {
        console.log('server created');
        setTimeout(function () {
            global.eventBus.emit('server:ready');
        }, 1000);

    });
});