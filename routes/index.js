var qr = require('qr-image');



exports.qr = function (req, res) {
    var code = qr.image(global.url, {
        type: 'svg'
    });
    res.type('svg');
    code.pipe(res);
};
