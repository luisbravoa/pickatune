define(['jquery', 'handlebars', 'text!./template.html'], function ($, Handlebars, html) {
    function SongQueue(options) {
        this.options = options;
        this.element = $.parseHTML('<div></div>')[0];
        var template = Handlebars.compile(this.html);

        this.songTemplte = Handlebars.compile(this.songHtml);
        //console.log(options);

        this.element.innerHTML = template(options);
    }

    SongQueue.prototype.addSong = function (song) {
        $(createTr(song)).hide().appendTo(this.element.querySelector('#queue-song-list')).fadeIn(1000);
        //this.element.querySelector('#queue-song-list').appendChild(createTr(song));
    };

    SongQueue.prototype.setCurrent = function (song) {

        $('#queue-song-list tr[data-id=' + song.id + ']').remove();

        $('#queue-song-current tbody').children().remove();


        $(createTr(song)).hide().appendTo(this.element.querySelector('#queue-song-current tbody')).fadeIn(1000);
    };

    function createTr(song) {
        var tr = document.createElement("TR");
        tr.setAttribute("data-id", song.id);
        var title = tr.insertCell(0);
        title.innerHTML = (song.title) ? song.title : 'Unknown';
        var album = tr.insertCell(1);
        album.innerHTML = (song.album) ? song.album : 'Unknown';
        var artist = tr.insertCell(2);
        artist.innerHTML = (song.artist) ? song.artist : 'Unknown';

        return tr;
    }

    SongQueue.prototype.songHtml =
        '<td>{{#if title}}{{title}}{{else}}(Unknown){{/if}}</td>' +
        '<td>{{#if album}}{{album}}{{else}}(Unknown){{/if}}</td>' +
        '<td>{{#if artist}}{{artist}}{{else}}(Unknown){{/if}}</td>';

    SongQueue.prototype.html = html;

    SongQueue.prototype.destroy = function () {
        this.element.remove();
        delete this;
    };

    return SongQueue;
});