var _ = require('underscore');
var when = require('when');
var utils = require('../misc/utils');
var fs = require('fs');
var request = require('request');

module.exports = {

    save: function (name) {
        //console.log('SAVE', name);
        return global.db.artistExistsByName(name)
            .then(function (exists) {
                //console.log(name, exists)
                if (!exists) {
                    return this.getInfo(name)
                        .then(function(data){
                            global.db.addArtist(data);
                            return when.resolve();
                        });
                }else{
                    return when.resolve();
                }
            }.bind(this), console.log)
    },
    getInfo: function (name) {

        var deferred = when.defer();

        var artist = {
            id: utils.generateHash(),
            name: name
        };

        request('http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + name + '&api_key=3560007ae1982c970859a515efeb3174&format=json', function (error, response, body) {

            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                console.log(body.artist.image) // Show the HTML for the Google homepage.
                //console.log(body.artist.image, body.artist.image[body.artist.image.length -1], body.artist.image[body.artist.image.length -1]['#text'])
                artist.url = (body !== undefined && body.artist && body.artist.url) ? body.artist.url : null;
                artist.img = (body.artist !== undefined && body.artist.image && body.artist.image.length > 0) ? body.artist.image[body.artist.image.length -2]['#text'] : '';
            }
            //console.log(artist);
            deferred.resolve(artist);

        });

        return deferred.promise;
    }


};