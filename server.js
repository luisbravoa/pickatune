"use strict";

var http = require('http'),
    path = require('path'),
    express = require('express'),
    utils = require('./misc/utils'),
    //    routes = require(path.join(process.cwd(), 'routes', 'index.js')),
    app = express(),
    ip = require('ip').address(),
    qr = require('qr-image'),
    url = 'http://' + ip + ':2323',
    _ = require('underscore'),
    when = require('when');

var request = require('request');

var musicFolder = '/Users/luis/Music';


var db = require('./db/db.js');

try {
    db.init(openDatabase);
} catch (e) {
    console.log(e)
}


var EventEmitter = require("events").EventEmitter;
var eventBus = new EventEmitter();
loadfiles();

var songs = [];
var queue = [];

function loadfiles() {



    utils.getFileNames(musicFolder)
        .then(function (files) {
            files.forEach(function (file) {
                if (queue.indexOf(file) === -1) {
                    queue.push(file);
                }
            });
            loadQueue();
        });

}

function loadQueue() {
    if (queue.length === 0) {
        return;
    }

    //    console.log(queue.length + 'songs to go');

    var songsToCheck = queue.splice(0, 1);

    var promises = [];

    var songsToLoad = [];

    songsToCheck.forEach(function (songfile) {
        var promise = db.songsExistsByFile(songfile)
            .then(function (exists) {
                //                console.log(exists, songfile);
                if (!exists) {
                    songsToLoad.push(songfile);
                    //                    console.log('PUSH')
                }
                return when.resolve();
            })

        promises.push(promise);
    });


    when.all(promises)
        .then(function () {
            //            console.log('loadSongs', songsToLoad);
            if (songsToLoad.length > 0) {
                utils.loadFilesInfo(songsToLoad)
                    .then(function (data) {
                        //                        console.log('data', data)
                        data.forEach(function (song) {
                            //                            console.log('addsong', song);
                            db.addSong(song);

                            //                            console.log('sdasdas');
                            saveArtistsBySong(song);


                        });

                        //                        setTimeout(function () {
                        loadQueue();
                        //                        }, 50);
                    }, console.error);
            } else {
                loadQueue();
            }


        });
}

function saveArtistsBySong(song) {
    //
    //    db.artistExistsByName(song.artist)
    //        .then(function (exists) {
    //            console.log(song.artist, exists)
    //            if (!exists) {
    //                request('http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + song.artist + '&api_key=3560007ae1982c970859a515efeb3174&format=json', function (error, response, body) {
    //                    var artist = {
    //                        id: utils.generateHash(),
    //                        name: song.artist
    //                    };
    //                    if (!error && response.statusCode == 200) {
    //
    //                        body = JSON.parse(body);
    //                        console.log(body.artist.image) // Show the HTML for the Google homepage. 
    //                        artist.url = (body !== undefined && body.artists && body.artist.url) ? body.artist.url : null;
    //                        artist.img = (body.artist !== undefined && body.artist.image.length > 0) ? body.artist.image[body.artist.image.length - 1]['#text'] : '';
    //                    }
    //                    console.log(artist);
    //                    db.addArtist(artist);
    //
    //                })
    //
    //            }
    //        }, console.error)

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

    console.log(e);

    // all environments
    app.set('port', process.env.PORT || 2323);

    app.use(express.static(path.join(process.cwd(), 'public')));
    app.use('/music', express.static(musicFolder));

    app.get('/qr', function (req, res) {
        var code = qr.image(url, {
            type: 'svg'
        });
        res.type('svg');
        code.pipe(res);
    });

    app.get('/song', function (req, res) {
        db.selectAllSongs()
            .then(function (songs) {
                res.send(songs);
            }, function (e) {
                res.error(e)
            })
    });


    app.get('/artist', function (req, res) {
        db.selectAllArtists()
            .then(function (artists) {
                res.send(artists);
            }, function (e) {
                res.error(e)
            })
    });


    app.get('/album', function (req, res) {
        db.listAlbums()
            .then(function (data) {
                res.send(data);
            }, function (e) {
                res.error(e)
            })
    });


    app.get('/song/play/:id', function (req, res) {
        console.log('/song/play/:id', req.param("id"))
        db.getSongById(req.param("id"))
            .then(function (song) {
                console.log('song:play', song);
                eventBus.emit('song:play', song);
            })
        res.send();
    });
    console.log('starting server', eventBus);
    http.createServer(app).listen(app.get('port'), function (err) {
        console.log('server created', eventBus);
        eventBus.emit('server:ready');
    });
});