var _ = require('underscore');
var when = require('when');
var utils = require('../misc/utils');
var fs = require('fs');
//var request = require('request');

module.exports = {

    save: function (name) {
        return this.getInfo(name)
            .then(function (data) {
                global.db.addArtist(data);
                return when.resolve();
            });
    }


};