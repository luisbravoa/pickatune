exports.list = function (req, res) {
    //global.db.selectAllArtists()
        //.then(function (artists) {
            res.send(global.artists);
        //}, function (e) {
        //    res.error(e)
        //})
};
//exports.listSongs = function (req, res) {
//    var name = req.param("name");
//    global.db.selectAllSongsByArtistName(name)
//        .then(function (data) {
//            res.send(data);
//        }, function (e) {
//            res.error(e)
//        })
//};



exports.listPaginated = function (req, res) {

    var index = parseInt(req.param("index"));
    var length = parseInt(req.param("length"));

    var response = {
        length: global.artists.length,
        data: global.artists.slice(index, index + length)
    };
    res.send(response);
};




