define(['jquery', 'handlebars','text!./template.html' ],function($, Handlebars, html){
    function DetailList(options) {
        this.element = $.parseHTML('<div id="detailList"></div>')[0];
        this.options = options;

        var template = Handlebars.compile(this.html);
        var html = template(this.options.data);

        $(this.element).append(html);

        $(this.element).delegate('.playButton', 'click', function (e) {
            e.preventDefault();
            var id = $(this).attr('data-id');

            var song = global.models.Song.getByFile(id);

            if(song){
                global.eventBus.emit('song:play', song);
            }
        });
        $(this.element).delegate('.addButton', 'click', function (e) {
            e.preventDefault();
            var id = $(this).attr('data-id');
            var song = global.models.Song.getByFile(id);

            if(song){
                global.eventBus.emit('song:add', song);
            }
        });
    }
    DetailList.prototype.html = html;


    DetailList.prototype.getData = function (cb) {
        global.models.Song.selectAll()
            .then(function (data) {
                data.forEach(function (song) {

                    song.play = '<div class="song-controls">' +
                        '<a href="#" class="playButton" data-id="' + song.id + '"><i class="fa fa-play"></i></a> ' +
                        '<a href="#" class="addButton" data-id="' + song.id + '"><i class="fa fa-plus"></i></a>' +
                        '</div>';
                });
                cb(data);
            });
    };

    DetailList.prototype.destroy = function () {
        this.element.remove();
        delete this;
    };

    return DetailList;
});
