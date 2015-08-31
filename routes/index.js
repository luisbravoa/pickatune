var qr = require('qr-image');

exports.qr = function (req, res) {
    var code = qr.image(global.url, {
        type: 'svg'
    });
    res.type('svg');
    code.pipe(res);
};

exports.config = function (req, res) {

     global.db.getConfig('language')
        .then(function (language) {
            res.send({
                language: language
            });
        });
};
