//var utils = require('./misc/utils')
//
//var when = require('when');

process.on('message', function(m) {
  // Do work  (in this case just up-case the string
  m = m.toUpperCase();

  // Pass results back to parent process
  process.send(m.toUpperCase(m));
});

process.send({ foo: 'bar' });

setTimeout(function(){console.log('alo')},10000)


//process.end();

//var musicFolder = '/Users/luis/Music';
//
//var songs = [];
//var queue = [];
//utils.getFileNames(musicFolder)
//    .then(function (files) {
//        files.forEach(function (file) {
//            if (queue.indexOf(file) === -1) {
//                queue.push(file);
//            }
//        });
//                loadQueue();
//    });

//function loadQueue() {
//    if (queue.length === 0) {
//        return;
//    }
//    
//    console.log(queue.length + 'songs to go');
//
//    var songsToCheck = queue.splice(0, 20);
//
//    var promises = [];
//
//    var songsToLoad = [];
//
//    songsToCheck.forEach(function (songfile) {
//        songsToLoad.push(songfile);
//        var promise = db.songsExistsByFile(songfile)
//            .then(function (exists) {
////                console.log(exists, songfile);
//                if (!exists) {
//                    songsToLoad.push(songfile);
////                    console.log('PUSH')
//                }
//                return when.resolve();
//            })
//
//        promises.push(promise);
//    });
//
//
//    when.all(promises)
//        .then(function () {
//            console.log('loadSongs', songsToLoad);
//            if (songsToLoad.length > 0) {
//                utils.loadFilesInfo(songsToLoad)
//                    .then(function (data) {
////                        console.log('data', data)
//                        data.forEach(function (song) {
//                            console.log('addsong', song);
////                            db.addSong(song);
//                        });
//
//                        setTimeout(function () {
//                            loadQueue();
//                        }, 10);
//                    }, console.error);
//            } else {
//                    loadQueue();
//            }
//
//
//        });
//}
