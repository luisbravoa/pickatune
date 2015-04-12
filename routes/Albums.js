exports.list = function (req, res) {
    global.db.listAlbums()
        .then(function (data) {
            res.send(data);
        }, function (e) {
            res.error(e)
        });
};
