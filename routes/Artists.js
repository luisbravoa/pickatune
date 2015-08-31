exports.list = function (req, res) {
    //global.db.selectAllArtists()
        //.then(function (artists) {
            res.send(global.artists);
        //}, function (e) {
        //    res.error(e)
        //})
};

exports.listPaginated = function (req, res) {

    var index = parseInt(req.params.index);
    var length = parseInt(req.params.length);

    var response = {
        length: global.artists.length,
        data: global.artists.slice(index, index + length)
    };
    res.send(response);
};




