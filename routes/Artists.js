exports.list = function (req, res) {
    global.db.selectAllArtists()
        .then(function (artists) {
            res.send(artists);
        }, function (e) {
            res.error(e)
        })
};
exports.listSongs = function (req, res) {
    var name = req.param("name");
    global.db.selectAllSongsByArtistName(name)
        .then(function (data) {
            res.send(data);
        }, function (e) {
            res.error(e)
        })
};
