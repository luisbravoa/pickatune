define(['jquery', 'handlebars', 'text!./template.html'], function ($, Handlebars, html) {
    function Settings(options) {
        this.options = options;
        var template = Handlebars.compile(this.html);

        this.element = $.parseHTML(template(options))[0];

        $(this.element).i18n();

        requestAnimationFrame(function () {
            global.db.getConfig('musicFolder')
                .then(function (musicFolder) {
                    if (musicFolder !== undefined) {
                        console.log(musicFolder);
                        $('#musicFolder').attr('filename', musicFolder);
                    }
                });
            $('#settings-save').click(function (e) {
                var path = $('#musicFolder').val();
                if (path !== undefined && path !== '') {

                    global.eventBus.emit('config:musicFolder', path);
                }
            });
        }.bind(this));


    }

    Settings.prototype.html = html;

    Settings.prototype.destroy = function () {
        this.element.remove();
        delete this;
    };

    return Settings;

});