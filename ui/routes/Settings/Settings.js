define(['jquery', 'handlebars', 'text!./template.html'], function ($, Handlebars, html) {
    function Settings(options) {
        this.options = options;
        var template = Handlebars.compile(this.html);

        this.element = $.parseHTML(template(options))[0];
        this.$element = $(this.element);

        $(this.element).i18n();

        global.db.getConfig('language')
            .then(function (language) {
                console.log(language);
                if (language !== undefined) {
                    this.$element.find("#language").val(language);
                }
            }.bind(this));
        global.db.getConfig('musicFolder')
            .then(function (musicFolder) {
                console.log(musicFolder);

                if (musicFolder !== undefined) {
                    this.$element.find("#currentMusicFolder").html(musicFolder);
                }
            }.bind(this));


        $(this.element).find('form').submit(function (e) {
            e.preventDefault();
            var data = this.getValues();

            if(data.musicFolder !== undefined && data.language !== undefined){
                global.eventBus.emit('config:change', data);
            }
        }.bind(this));

    }

    Settings.prototype.html = html;

    Settings.prototype.destroy = function () {
        this.element.remove();
        delete this;
    };
    Settings.prototype.getValues = function () {
        return {
            musicFolder: $('#musicFolder').val(),
            language: $('#language').val()
        };

    };

    return Settings;

});