define(['jquery', 'handlebars', 'text!./template.html'], function ($, Handlebars, html) {
    function SongQueue(options) {
        this.options = options;
        this.element = $.parseHTML('<div></div>')[0];
        var template = Handlebars.compile(this.html);

        this.element.innerHTML = template(options);
        $(this.element).i18n();
    }

    SongQueue.prototype.addSong = function (song) {
        $(createTr(song)).hide().appendTo(this.element.querySelector('#queue-song-list')).fadeIn(1000);
        //this.element.querySelector('#queue-song-list').appendChild(createTr(song));
    };

    SongQueue.prototype.setCurrent = function (song) {

        $('#queue-song-list tr[data-id=' + song.id + ']').remove();

        $('#queue-song-current tbody').children().remove();


        $(createTr.call(this, song)).hide().appendTo(this.element.querySelector('#queue-song-current tbody')).fadeIn(1000);
    };

    function createTr(song) {
        var tr = document.createElement("TR");
        tr.setAttribute("data-id", song.id);
        var title = tr.insertCell(0);
        title.innerHTML = (song.title) ? song.title : this.options.strings.unknown;
        var album = tr.insertCell(1);
        album.innerHTML = (song.album) ? song.album : this.options.strings.unknown;
        var artist = tr.insertCell(2);
        artist.innerHTML = (song.artist) ? song.artist : this.options.strings.unknown;
        return tr;
    }

    SongQueue.prototype.html = html;

    SongQueue.prototype.destroy = function () {
        this.element.remove();
        delete this;
    };

    return SongQueue;
});