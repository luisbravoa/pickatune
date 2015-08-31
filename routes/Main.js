var when = require('when');
//var queue = [];
var total;

module.exports = {
    loadfiles: function (musicFolder) {

        if(!musicFolder) return;

        global.songs = [];

        global.artists = [];
        global.albums = [];
        return global.utils.getFileNames(musicFolder)
            .then(function (files) {

                var i = 0;
                global.songs = files.map(function(file){
                    var song = {
                        file: file,
                        title: file.substring(file.lastIndexOf('/')+1),
                        //artist: '(unknown)',
                        //album: '(unknown)',
                        url: file.replace(musicFolder, ''), 
                        id: i};
                    i++;
                    return song;
                });
                setTimeout(function(){
                    global.eventBus.emit('reload:ready');
                }, 1000 * 2);


                queue(files, function (i, recursive) {
                    global.models.Song.loadFileInfo(files[i], musicFolder)
                        .then(function (data) {
                            global.eventBus.emit('load:songs', i, files.length);
                            var id = global.songs[i].id;
                        
                        for(key in data){
//                            console.log(key, data[key], data[key] !== undefined);
                            if(data[key] !== undefined && data[key] !== ''){
                                global.songs[i][key] = data[key];
                            }    
                        }
                        
//                        if(data.artist !== undefined){
//                            global.songs[i].artist = data.artist;
//                        }
//                        if(data.album !== undefined){
//                            global.songs[i].album = data.album;
//                        }
//                            global.songs[i] = data;

//                            global.songs[i].id = id;

                            if (!isEmpty(data.artist) && !isInAritsts(data.artist)) {
                                global.artists.push({name: data.artist});
                            }

                            if (!isEmpty(data.artist) && !isEmpty(data.album) && !isInAlbums(data.artist, data.album)) {
                                global.albums.push({artist: data.artist, name: data.album});
                            }

                            recursive();

                        }, function (e) {
                            console.error(e);
                        });

                }, function(){
                    // done

//                    global.eventBus.emit('reload:ready');
                });


            });
    }

};

//
//function loadQueue() {
//    //console.log('loadQueue', queue.length);
//    if (queue.length === 0) {
//
//        console.log(global.artists, global.albums);
//        return;
//        //return loadArtistAndAlbumData();
//    }
//
//    global.eventBus.emit('load:songs', total - queue.length, total);
//
//    var songsToCheck = queue.splice(0, 1);
//
//    var promises = [];
//
//    global.models.Song.loadFileInfo(songsToCheck[0])
//        .then(function (data) {
//
//            global.songs.push(data);
//
//            if(data.artist !== undefined && global.artists.indexOf(data.artist) === -1){
//                global.artists.push(data.artist);
//            }
//
//            if(data.artist !== undefined && !isAlbumInQueue(data.artist, data.album)){
//                global.albums.push({artist: data.artist, name: data.album});
//            }
//
//
//            loadQueue();
//
//        }, function (e) {
//            console.error(e);
//        });
//
//}

function isInAritsts(artist) {
    var exists = false;
    global.artists.forEach(function (item) {
        if (item.name === artist) {
            exists = true;
        }
    });
    return exists;
}

function isInAlbums(artist, album) {
    var exists = false;
    global.albums.forEach(function (item) {
        if (item.artist === artist && item.name === album) {
            exists = true;
        }
    });
    return exists;
}

function isEmpty(str){
    return (str == undefined || str == '' || str == ' ');
}

//var currentArtist = 0;
//function loadArtistsInfo (){
//    if (currentArtist >= global.artists.length) {
//        console.log('return');
//        return loadAlbumsInfo();
//    }
//
//    console.log(currentArtist);
//    global.models.Artist.getInfo(global.artists[currentArtist])
//        .then(function(data){
//            global.artists.push(data);
//            currentArtist++;
//            loadArtistsInfo();
//        });
//}
//global.albums = [];
//
//var currentAlbum = 0;
//function loadAlbumsInfo(){
//    if (currentAlbum >= global.albums.length) {
//        console.log('return');
//        return;
//    }
//
//    console.log(currentAlbum);
//    global.models.Album.getInfo(global.albums[currentAlbum])
//        .then(function(data){
//            global.albums.push(data);
//            currentAlbum++;
//            loadAlbumsInfo();
//        });
//}


function queue(array, action, cb) {
    var i = 0;

    function recursive() {
        if (i >= array.length) {
            if (cb) {
                cb()
            }
            return;
        }

        action(i, recursive);
        i++;
    }

    recursive()
}

//var current = 0;
//function saveQueue() {
//    global.eventBus.emit('load:songs', current, global.songs.length);
//    //console.log('loadQueue', queue.length);
//    if (current >= global.songs.length) {
//
//        debugger;
//        return;
//        //return loadArtistAndAlbumData();
//    }
//
//    global.models.Song.save(global.songs[current])
//        .then(function(){
//            current++;
//            //setTimeout(saveQueue, 100)
//            saveQueue();
//        });
//}
