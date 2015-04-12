var _ = require('underscore');
var when = require('when');
var utils = require('../misc/utils');
var fs = require('fs');
var request = require('request');

module.exports  = {

    save: function (artist, name) {
        //console.log('ALBUM SAVE',artist, name);
        return global.db.albumExistsByArtistsAndName(artist, name)
            .then(function (exists) {
                //console.log(name, exists)
                if (!exists) {
                    return global.models.Album.getInfo(artist, name)
                        .then(function(data){
                            global.db.addAlbum(data);
                            return when.resolve();
                        });
                }else{
                    return when.resolve();
                }
            }, console.error);
    },
    getInfo: function (artist, name) {
            //console.log('getInfo', artist, name)
        var deferred = when.defer();

        var album = {
            id: utils.generateHash(),
            name: name,
            artist: artist
        };
        //console.log(album);
        //console.log('http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=3560007ae1982c970859a515efeb3174&artist=' + artist + '&album=' + name + '&format=json');

        request('http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=3560007ae1982c970859a515efeb3174&artist=' + artist + '&album=' + name + '&format=json',
            function (error, response, body) {

            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                //console.log(body.album.image); // Show the HTML for the Google homepage.
                //console.log(body.album.image, body.album.image[body.album.image.length -1], body.album.image[body.album.image.length -1]['#text'])
                album.url = (body !== undefined && body.album && body.album.url) ? body.album.url : null;
                album.img = (body.album !== undefined && body.album.image.length > 0 && body.album.image[body.album.image.length -2]['#text']) ? body.album.image[body.album.image.length -2]['#text'] : '';
            }
            //console.log(album);
            deferred.resolve(album);

        });

        return deferred.promise;
    }


};