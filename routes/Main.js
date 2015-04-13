var when = require('when');
var queue = [];
var total;


module.exports = {
    loadfiles: function (musicFolder) {
        global.utils.getFileNames(musicFolder)
            .then(function (files) {
                total = files.length;
                files.forEach(function (file) {
                    if (queue.indexOf(file) === -1) {
                        queue.push(file);
                    }
                });
                loadQueue();
            });
    }

};


function loadQueue() {
    if (queue.length === 0) {

        return loadArtistAndAlbumData();
    }

    global.eventBus.emit('load:songs', total - queue.length, total);

    var songsToCheck = queue.splice(0, 1);

    var promises = [];

    var songsToLoad = [];

    songsToCheck.forEach(function (songfile) {
        var promise = global.db.songsExistsByFile(songfile)
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
            if (songsToLoad.length > 0) {
                utils.loadFilesInfo(songsToLoad)
                    .then(function (data) {
                        var promises = [];
                        data.forEach(function (song) {
                            global.models.Song.save(song)
                                .then(function () {
                                    loadQueue();
                                }, console.error);
                        });
                    });
            } else {
                loadQueue();
            }


        });
}

var artistAlbumQueue = [];
var artistAlbumTotal;
function loadArtistAndAlbumData() {

    try {
        global.db.listArtistsAndAlbums()
            .then(function (data) {
                //console.log(data);
                artistAlbumTotal = data.length;
                artistAlbumQueue = data;
                loadArtistAlbumQueue();
            }, console.log);
    } catch (e) {
        console.error(e)
    }

}

function loadArtistAlbumQueue() {

    if (artistAlbumQueue.length === 0) {
        global.eventBus.emit('reload:ready');
        return;
    }

    var toLoad = artistAlbumQueue.splice(0, 1)[0];
    global.eventBus.emit('load:artistAlbum', artistAlbumTotal - artistAlbumQueue.length, artistAlbumTotal);
    if (toLoad.artist !== undefined && toLoad.artist.length > 0) {
        global.models.Artist.save(toLoad.artist)
            .then(function () {
                if (toLoad.album !== undefined && toLoad.album.length) {
                    global.models.Album.save(toLoad.artist, toLoad.album)
                        .then(function () {
                            loadArtistAlbumQueue();
                            //console.log('done');
                        });
                }
            })
    } else {
        loadArtistAlbumQueue();
    }

}
