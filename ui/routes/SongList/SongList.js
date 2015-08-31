define(['jquery', 'handlebars', 'text!./template.html', '../Table/Table'], function ($, Handlebars, html, VirtualTable) {
    function SongList(options) {
        this.element = $.parseHTML('<div id="song-list"></div>')[0];
        this.options = options;

        this.table = new VirtualTable({
            columns: [
                {
                    name: '',
                    property: 'play',
                    style: 'min-width:50px; max-width: 50px; width: 50px;'
                },
                {
                    name: this.options.strings.title,
                    property: 'title',
                    style: 'min-width:200px; max-width: 200px; width: 200px;'
                },
                {
                    name: this.options.strings.artist,
                    property: 'artist',
                    style: 'min-width:200px; max-width: 200px; width: 200px;'
                },
                {
                    name: this.options.strings.album,
                    property: 'album',
                    style: 'min-width:200px; max-width: 200px; width: 200px;'
                }
            ],
            length: global.songs.length,
            parentElement: this.options.parentElement,
            scrollableElement: this.element,
            getData: function (indexes, cb) {
                //console.log(index, length);


                var response = {};

                indexes.forEach(function (index) {
                    if (global.songs[index] !== undefined) {
                        var song = _.clone(global.songs[index]);

                        song.play = '<div class="song-controls">' +
                            '<a href="#" class="playButton" data-id="' + song.file + '"><i class="fa fa-play"></i></a> ' +
                            '<a href="#" class="addButton" data-id="' + song.file + '"><i class="fa fa-plus"></i></a>' +
                            '</div>';

                        if(!song.artist){
                            song.artist = '(' + this.options.strings.unknown + ')';
                        }
                        if(!song.album){
                            song.album = '(' + this.options.strings.unknown + ')';
                        }
                        if(!song.title){
                            song.title = '(' + this.options.strings.unknown + ')';
                        }

                        response[index] = song;


                    }
                }.bind(this));

                cb(response);

            }.bind(this)
        });

        this.element.appendChild(this.table.element);
        //requestAnimationFrame(this.initialize.bind(this))


        $(this.element).delegate('.playButton', 'click', function (e) {
            e.preventDefault();
            var id = $(this).attr('data-id');

            //debugger;

            var song = global.models.Song.getByFile(id);

            if (song) {
                global.eventBus.emit('song:play', song);
            }
        });
        $(this.element).delegate('.addButton', 'click', function (e) {
            e.preventDefault();
            var id = $(this).attr('data-id');
            var song = global.models.Song.getByFile(id);

            if (song) {
                global.eventBus.emit('song:add', song);
            }
        });

        $('#song-list tr').dblclick(function (e) {
            e.preventDefault();
            var id = $(this).find('.playButton').attr('data-id');
            var song = global.models.Song.getByFile(id);

            if (song) {
                global.eventBus.emit('song:play', song);
            }
        });
    }

    SongList.prototype.initialize = function () {
        var template = Handlebars.compile(this.html);
        //console.log(options);
        this.getData(function (items) {
            //console.log({items: items});


            this.element.innerHTML = template({items: items});
            //this.options.parentElement.appendChild(this.element);


        }.bind(this));
    };
    SongList.prototype.html =html;


    SongList.prototype.getData = function (cb) {
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

    SongList.prototype.destroy = function () {
        this.element.remove();
        delete this;
    };

    return SongList;

});