var when = require('when');

module.exports = {
    init: function (openDatabase) {

        this.db = openDatabase('prototypeDB', '1.0', 'songs', 2 * 1024 * 1024);

        this.db.transaction(function (tx) {
            tx.executeSql('create table if not exists songs (' +
                'id VARCHAR PRIMARY KEY UNIQUE,' +
                'file TEXT,' +
                'title VARCHAR,' +
                'artist VARCHAR,' +
                'album VARCHAR,' +
                'genre VARCHAR,' +
                'track VARCHAR,' +
                'year VARCHAR' +
                ');'
            );

            tx.executeSql('create table if not exists artists (' +
                'id VARCHAR PRIMARY KEY UNIQUE,' +
                'name VARCHAR,' +
                'url VARCHAR' +
                ');'
            );
        });

    },

    addSong: function (data) {
        this.db.transaction(function (tx) {
            tx.executeSql('INSERT INTO songs (id, file, title, artist, album, genre, track, year) VALUES (?,?,?,?,?,?,?,?)', [data.id, data.file, data.title, data.artist, data.album, data.genre, data.track, data.year]);
        });
    },

    selectAllSongs: function () {
        return this.query('SELECT * FROM songs');
    },
    selectAllArtists: function () {
        return this.query('SELECT * FROM artists');
    },
    listArtists: function () {
        return this.query('SELECT artist as foo FROM songs group by artist')
            .then(function (data) {
                var response = [];
                data.forEach(function (item) {
                    if (item.foo === null || item.foo === '') {
                        item.foo = 'Unknown';
                    }
                    response.push(item.foo);
                });
                return when.resolve(response);
            });
    },
    listAlbums: function () {
        return this.query('SELECT album, artist FROM songs group by artist')
            .then(function (data) {
                var response = [];
                data.forEach(function (item) {
                    if (item.artist === null || item.artist === '') {
                        item.artist = 'Unknown';
                    }
                    if (item.album === null || item.album === '') {
                        item.album = 'Unknown';
                    }
                    response.push(item.foo);
                });
                return when.resolve(data);
            });
    },
    getSongById: function (id) {
        return this.query('SELECT * FROM songs where id = "' + id + '"')
            .then(function (songs) {
                return when.resolve(songs[0]);
            });
    },
    songsExists: function (id) {
        return this.query('SELECT count(*) as COUNT FROM songs where id = "' + id + '"')
            .then(function (data) {
                return when.resolve((data[0]['COUNT'] > 0))
            });
    },
    
    artistExistsByName: function (name) {
        console.log(name)
        return this.query('SELECT count(*) as COUNT FROM artists where name = "' + name + '"')
            .then(function (data) {
                return when.resolve((data[0]['COUNT'] > 0))
            });
    },
    
    
    addArtist: function (data) {
        this.db.transaction(function (tx) {
            tx.executeSql('INSERT INTO artists (id, name, url) VALUES (?,?,?)', [data.id, data.name, data.url]);
        });
    },

    songsExistsByFile: function (file) {
        return this.query('SELECT count(*) as COUNT FROM songs where file = "' + file + '"')
            .then(function (data) {
                return when.resolve((data[0]['COUNT'] > 0))
            });
    },
    query: function (sql) {
        var deferred = when.defer();


        this.db.transaction(function (tx) {
            tx.executeSql(sql, [], function (tx, results) {

                try {
                    var data = [];
                    var len = results.rows.length,
                        i;
                    for (i = 0; i < len; i++) {
                        data.push(results.rows.item(i));
                    }

                    deferred.resolve(data);

                } catch (e) {
                    // error that is thrown when there is not affected columns 
                }



            });
        });

        return deferred.promise;
    },

    drop: function () {
        this.db.transaction(function (tx) {
            tx.executeSql('DROP TABLE songs');
            tx.executeSql('DROP TABLE artists');
        });
    }


};