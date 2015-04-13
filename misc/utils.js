var fs = require('graceful-fs');
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
};


exports.getFilesRecursiveSync = getFilesRecursiveSync;


function loadFileInfo(file) {
    var deferred = when.defer();
    var mm = require('musicmetadata');
    var stream = fs.createReadStream(file);
    
    function onClose(){
        console.log('close');
    }
    stream.on('close', onClose);
    //console.log('loading ', file);
    var parser = mm(stream, function (err, metadata) {
        if (err) {
            //console.log(err);
            deferred.resolve({});
        }
        //console.log('loaded ', file, metadata);
        stream.close();
        stream.removeListener('close', onClose);

        metadata.file = file;

        var response  = {
            id: generateHash(),
            artist: (metadata.artist) ? metadata.artist.join(', ') : '',
            album: metadata.album,
            genre: (metadata.genre) ? metadata.genre.join(', ') : '',
            track: (metadata.track) ? metadata.track.no: '',
            trackTotal: (metadata.track) ? metadata.track.of: '',
            year: metadata.year,
            title: metadata.title,
            file: file
        };
        
        deferred.resolve(response);
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


exports.loadFileInfo = loadFileInfo;




exports.loadFilesInfo = function (list, folder) {

    var deferred = when.defer();

    var promises = [];

    list.forEach(function (file, index) {
        if (index > 200) {
            return;
        }
        promises.push(loadFileInfo(file));
    });

    when.all(promises)
        .then(function (songs) {
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
    return require('graceful-fs').readFileSync(path, "utf-8");
}