exports.play = function (req, res) {
    console.log('/song/play/:id', req.param("id"))
    global.db.getSongById(req.param("id"))
        .then(function (song) {
            console.log('song:play', song);
            global.eventBus.emit('song:play', song);
        })
    res.send();
};
exports.add = function (req, res) {
    console.log('/song/add/:id', req.param("id"))
    global.db.getSongById(req.param("id"))
        .then(function (song) {
            console.log('song:add', song);
            global.eventBus.emit('song:add', song);
        })
    res.send();
};
exports.list = function (req, res) {
    global.db.selectAllSongs()
        .then(function (songs) {
            res.send(songs);
        }, function (e) {
            res.error(e)
        })
};


