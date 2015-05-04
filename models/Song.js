var _ = require('underscore');
var when = require('when');
var utils = require('../misc/utils');
var fs = require('graceful-fs');
var mm = require('musicmetadata');

module.exports = {


    save: function (data) {

        var promises = [];

                promises.push(this.add(data));

                if (data.artist !== undefined && data.artist.length > 0) {
                    promises.push(global.models.Artist.save(data.artist));

                    if (data.album !== undefined && data.album.length > 0) {
                        promises.push(global.models.Album.save(data.artist, data.album));
                    }

                }

        return when.all(promises);

    },

    add: function (data) {
        return global.db.query('INSERT INTO songs (id, file, title, artist, album, genre, track, year) VALUES (?,?,?,?,?,?,?,?)', [null, data.file, data.title || null, data.artist || null, data.album || null, data.genre || null, data.track || null, data.year || null])
    },
    addFile: function (file) {
        return global.db.query('INSERT INTO songs (file) VALUES (?)', [file])
    },

    updateSongByFile: function (file, data) {
        global.db.makeTransaction('UPDATE songs SET title = ?, artist = ?, album = ?, genre = ?, track = ?, year = ?  WHERE file = ?;', [data.title, data.artist, data.album, data.genre, data.track, data.year, file]);

    },
    selectAll: function () {
        return global.db.query('SELECT * FROM songs');
    },
    getById: function (id) {
        return global.db.query('SELECT * FROM songs where id = "' + id + '"')
            .then(function (songs) {
                return when.resolve(songs[0]);
            });
    },
    getByFile: function (file) {
        return _.findWhere(global.songs, {file: file});
    },
    exists: function (id) {
        return global.db.query('SELECT count(*) as COUNT FROM songs where id = "?"', id)
            .then(function (data) {
                return when.resolve((data[0]['COUNT'] > 0))
            });
    },
    existsByFile: function (file) {
        return global.db.query('SELECT count(*) as COUNT FROM songs where file = ?', [file])
            .then(function (data) {
                return when.resolve((data[0]['COUNT'] > 0))
            });
    },
    loadFileInfo: function (file, dir) {
        var deferred = when.defer();

        var stream = fs.createReadStream(file);
        var parser = mm(stream, function (err, metadata) {
            if (err) {
                deferred.resolve({file: file});
            }
            stream.close();

            metadata.file = file;

            var response = {
                artist: (metadata.artist) ? metadata.artist.join(', ') : '',
                album: metadata.album,
                genre: (metadata.genre) ? metadata.genre.join(', ') : '',
                track: (metadata.track) ? metadata.track.no : '',
                trackTotal: (metadata.track) ? metadata.track.of : '',
                year: metadata.year,
                title: metadata.title,
                file: file,
                url: file.replace(dir, '')
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


}
;