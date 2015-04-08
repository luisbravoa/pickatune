var fs = require('fs');
var when = require('when');

function getFilesRecursiveSync(dir, fileList, optionalFilterFunction) {
    if (!fileList) {
        grunt.log.error("Variable 'fileList' is undefined or NULL.");
        return;
    }
    var files = fs.readdirSync(dir);
    for (var i in files) {
        if (!files.hasOwnProperty(i)) continue;
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFilesRecursiveSync(name, fileList, optionalFilterFunction);
        } else {
            if (optionalFilterFunction && optionalFilterFunction(name) !== true)
                continue;
            fileList.push(name);
        }
    }
}



//exports.getFilesRecursiveSync = getFilesRecursiveSync;
//
//function loadFile(file) {
//    var deferred = when.defer();
//    var mm = require('musicmetadata');
//    var rs = fs.createReadStream(file);
//
//
//
//
//    var id3 = require('id3js');
//
//    id3({
//        file: file,
//        type: id3.OPEN_LOCAL
//    }, function (err, metadata) {
//        // tags now contains your ID3 tags 
//
//        if (err) {
//
//            throw err;
//            deferred.resolve({});
//        }
//
//        metadata.file = file;
//        deferred.resolve(metadata);
//    });
//
//
//    return deferred.promise;
//
//}


exports.getFilesRecursiveSync = getFilesRecursiveSync;

function loadFile(file) {
    var deferred = when.defer();
    var mm = require('musicmetadata');
    var rs = fs.createReadStream(file);

    var steam = fs.createReadStream(file);
    var parser = mm(steam, function (err, metadata) {
        if (err) deferred.resolve({});;

        metadata.file = file;
        steam.close();
        deferred.resolve(metadata);
        console.log(metadata);
    });

    /* 
    
    { artist : ['Spor'],
  album : 'Nightlife, Vol 5.',
  albumartist : [ 'Andy C', 'Spor' ],
  title : 'Stronger',
  year : '2010',
  track : { no : 1, of : 44 },
  disk : { no : 1, of : 2 },
  genre : ['Drum & Bass'],
  picture : [ { format : 'jpg', data : <Buffer> } ],
  duration : 302 // in seconds
}
    
    */

    return deferred.promise;

}

function loadFile(file) {
    var deferred = when.defer();
    var mm = require('musicmetadata');
    var rs = fs.createReadStream(file);

    var stream = fs.createReadStream(file);
    
    function onClose(){
        console.log('close');
    }
    stream.on('close', onClose);
    var parser = mm(stream, function (err, metadata) {
        if (err) deferred.resolve({});;
        
        stream.close();
        stream.removeListener('close', onClose);

        metadata.file = file;
        
        deferred.resolve(metadata);
//        console.log(metadata);
    });

    /* 
    
    { artist : ['Spor'],
  album : 'Nightlife, Vol 5.',
  albumartist : [ 'Andy C', 'Spor' ],
  title : 'Stronger',
  year : '2010',
  track : { no : 1, of : 44 },
  disk : { no : 1, of : 2 },
  genre : ['Drum & Bass'],
  picture : [ { format : 'jpg', data : <Buffer> } ],
  duration : 302 // in seconds
}
    
    */

    return deferred.promise;

}



exports.getFileNames = function loadFiles(folder) {
    var deferred = when.defer();
    var fs = require('fs');
    var list = [];

    getFilesRecursiveSync(folder, list, function (name) {
        var allowedExtentions = ['mp3', 'm34'];
        var extention = (name.split('.').length > 0) ? name.split('.')[name.split('.').length - 1] : 'NOPE';
        return (allowedExtentions.indexOf(extention) !== -1);
    });

    deferred.resolve(list);

    return deferred.promise;
}


exports.loadFilesInfo = function (list, folder) {

    var deferred = when.defer();

    var promises = [];

    list.forEach(function (file, index) {
        if (index > 200) {
            return;
        }
        promises.push(loadFile(file));
    });

    when.all(promises)
        .then(function (songs) {
            songs = songs.map(function (song) {
                return {
                    id: generateHash(),
                    artist: (song.artist) ? song.artist.join(', ') : '',
                    album: song.album,
                    genre: (song.genre) ? song.genre.join(', ') : '',
                    track: (song.track) ? song.track.no: '',
                    trackTotal: (song.track) ? song.track.of: '',
                    year: song.year,
                    title: song.title,
                    file: (folder) ? song.file.replace(folder + '/', '') : song.file
                };
            })
            deferred.resolve(songs);
        }, console.error);

    return deferred.promise;

}

function generateHash() {
    var crypto = require('crypto');
    return crypto.randomBytes(20).toString('hex');;

}

exports.generateHash  = generateHash;


exports.loadFile = function (path) {
    return require('fs').readFileSync(path, "utf-8");
}