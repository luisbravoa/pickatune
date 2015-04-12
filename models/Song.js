var _ = require('underscore');
var when = require('when');
var utils = require('../misc/utils');
var fs = require('fs');


module.exports  = {


    save: function(data){
        global.db.addSong(data);
        return when.resolve();
    }


};