var when = require('when');

module.exports = {
    init: function (openDatabase) {

        this.db = openDatabase('prototypeDB', '1.0', 'songs', 2 * 1024 * 1024);

        this.db.transaction(function (tx) {
            tx.executeSql('create table if not exists songs (' +
                'id INTEGER PRIMARY KEY,' +
                'file TEXT UNIQUE,' +
                'title VARCHAR,' +
                'artist VARCHAR,' +
                'album VARCHAR,' +
                'genre VARCHAR,' +
                'track VARCHAR,' +
                'year VARCHAR' +
                ');'
            );

            tx.executeSql('create table if not exists artists (' +
                'id INTEGER PRIMARY KEY,' +
                'name VARCHAR UNIQUE,' +
                'url VARCHAR,' +
                'img VARCHAR' +
                ');'
            );
            tx.executeSql('create table if not exists albums (' +
                'id INTEGER PRIMARY KEY,' +
                'name VARCHAR,' +
                'artist VARCHAR,' +
                'url VARCHAR,' +
                'img VARCHAR' +
                ');'
            );
            tx.executeSql('create table if not exists appconfig (' +
                'name VARCHAR PRIMARY KEY UNIQUE,' +
                'value VARCHAR' +
                ');'
            );
        });

    },


    makeTransaction: function(sql, params){
        this.db.transaction(function (tx) {
            tx.executeSql(sql, params);
        });
    },


    selectAllSongsByArtistName: function (name) {
        return this.query('SELECT * FROM songs where lower(artist) = lower("' + name + '")');
    },
    selectAllArtists: function () {
        return this.query('SELECT * FROM artists');
    },
    listArtistsAndAlbums: function () {

        return this.query('SELECT artist, album FROM songs group by artist, album')
            .then(function (data) {
                var response = [];
                data.forEach(function (item) {
                    if (item.artist !== '' && item.artist !== ' ') {
                        response.push(item);
                    }

                });
                return when.resolve(response);
            });

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
        return this.query('SELECT * FROM albums')
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


    albumExistsByArtistsAndName: function (artist, name) {
        //console.log('albumExistsByArtistsAndName', artist, name, 'SELECT count(*) as COUNT FROM albums where name = "' + name + '" and artist = "' + artist + '"')
        return this.query('SELECT count(*) as COUNT FROM albums where name = ? AND artist = ?', [name, artist])
            .then(function (data) {
                return when.resolve((data[0]['COUNT'] > 0))
            });
    },

    artistExistsByName: function (name) {
        //console.log(name)
        return this.query('SELECT count(*) as COUNT FROM artists where lower(name) = lower(?)', [name])
            .then(function (data) {
                return when.resolve((data[0]['COUNT'] > 0))
            });
    },

    getConfig: function (name) {
        return this.query('SELECT * FROM appconfig where name = "' + name + '"')
            .then(function (data) {
                return when.resolve((data[0])? data[0].value : undefined);
            });
    },
    setConfig: function (name, value) {
        this.db.transaction(function (tx) {
            tx.executeSql('INSERT OR REPLACE INTO appconfig (name, value) VALUES (?,?);', [name, value]);
            tx.executeSql('UPDATE appconfig SET value = "'+value+'" WHERE name = "'+name+'";');
        });
    },


    addArtist: function (data) {
        this.db.transaction(function (tx) {
            tx.executeSql('INSERT INTO artists (id, name, url, img) VALUES (?,?,?, ?)', [null, data.name, data.url, data.img]);
        });
    },
    addAlbum: function (data) {
        //console.log('addALbum', data);
        this.db.transaction(function (tx) {
            tx.executeSql('INSERT INTO albums (id, name, artist, url, img) VALUES (?,?,?,?,?)', [null, data.name, data.artist, data.url, data.img]);
        });
    },


    query: function (sql, args) {
        var deferred = when.defer();


        this.db.transaction(function (tx) {
            tx.executeSql(sql, args, function (tx, results) {

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
            tx.executeSql('DROP TABLE albums');
        });
    },
    dropConfig: function () {
        this.db.transaction(function (tx) {
            tx.executeSql('DROP TABLE appconfig');
        });
    },
    dropAll: function () {
        this.drop();
        this.dropConfig();
    },
    deleteAll: function(){
        this.makeTransaction('delete from songs;');
        this.makeTransaction('delete from albums;');
        this.makeTransaction('delete from artists;');
    }


};