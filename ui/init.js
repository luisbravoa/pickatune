define(['jquery'], function ($) {
    var nw = require('nw.gui');
    var win = nw.Window.get();
    win.isMaximized = false;
    // Expand
    document.getElementById('debug').onclick = function () {
        win.showDevTools();
    };

    // Expand
    document.getElementById('expand').onclick = function () {
        win.enterFullscreen();
        $('body').addClass('fullScreen');
    };

    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            win.leaveFullscreen();
            $('body').removeClass('fullScreen');
        }
    });

    // Min
    document.getElementById('minimize').onclick = function () {
        win.minimize();
    };

    // Close
    document.getElementById('close').onclick = function () {
        win.close();
    };

    // Max
    document.getElementById('maximize').onclick = function () {
        if (win.isMaximized)
            win.unmaximize();
        else
            win.maximize();
    };

    win.on('maximize', function () {
        win.isMaximized = true;
    });

    win.on('unmaximize', function () {
        win.isMaximized = false;
    });

            $('#qr-wrapper').click(function () {
                nw.Shell.openExternal(global.url);
            });



});

