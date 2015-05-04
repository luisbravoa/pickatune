exports.list = function (req, res) {
    //global.db.listAlbums()
    //    .then(function (data) {
            res.send(global.albums);
        //}, function (e) {
        //    res.error(e)
        //});
};

exports.listPaginated = function (req, res) {

    var index = parseInt(req.param("index"));
    var length = parseInt(req.param("length"));

    console.log(index, index + length);

    debugger;
    var response = {
        length: global.albums.length,
        data: global.albums.slice(index, index + length)
    };
    res.send(response);
};
