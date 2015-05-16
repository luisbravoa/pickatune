function SongList(options) {
    this.element = uiUtils.parse('<div id="song-list"></div>');
    this.options = options;



    this.table = new VirtualTable({
        columns: [
            {
                name: 'play',
                property: 'play',
                style: 'min-width:105px; max-width: 105px; width: 105px;'
            },
            {
                name: 'Title',
                property: 'title',
                style: 'min-width:200px; max-width: 200px; width: 200px;'
            },
            {
                name: 'Artist',
                property: 'artist',
                style: 'min-width:200px; max-width: 200px; width: 200px;'
            },
            {
                name: 'Album',
                property: 'album',
                style: 'min-width:200px; max-width: 200px; width: 200px;'
            }
//            ,
//            {
//                name: 'File',
//                property: 'file',
//                style: 'min-width:200px; max-width: 200px; width: 200px;'
//            }
        ],
        length: global.songs.length,
        parentElement: this.options.parentElement,
        scrollableElement: this.element,
        getData: function(indexes, cb){
            //console.log(index, length);


            var response = {};

            indexes.forEach(function(index){
                if(global.songs[index] !== undefined){
                    var song = _.clone(global.songs[index]);

                    song.play = '<div class="song-controls">' +
                    '<a href="#" class="playButton" data-id="' + song.file + '"><i class="fa fa-play"></i></a> ' +
                    '<a href="#" class="addButton" data-id="' + song.file + '"><i class="fa fa-plus"></i></a>' +
                    '</div>';

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

    $('#song-list tr').dblclick(function (e) {
        e.preventDefault();
        var id = $(this).find('.playButton').attr('data-id');
        var song = global.models.Song.getByFile(id);

        if(song){
            global.eventBus.emit('song:play', song);
        }
    });
}

SongList.prototype.initialize = function(){
    var template = Handlebars.compile(this.html);
    //console.log(options);
    this.getData(function (items) {
        //console.log({items: items});


        this.element.innerHTML = template({items: items});
        //this.options.parentElement.appendChild(this.element);


    }.bind(this));
};
SongList.prototype.html =

    '<table style="width:100%">' +
    '<tr>' +
    '<th></th>' +
    '<th>Title</th>' +
    '<th>Album</th>' +
    '<th>Artist</th>' +
    '<th>file</th>' +
    '{{#each items}}' +
    '</tr>' +
    '<tr>' +
    '<td>{{{play}}}</td>' +
    '<td>{{#if title}}{{title}}{{else}}(Unknown){{/if}}</td>' +
    '<td>{{#if album}}{{album}}{{else}}(Unknown){{/if}}</td>' +
    '<td>{{#if artist}}{{artist}}{{else}}(Unknown){{/if}}</td>' +
    '<td>{{file}}</td>' +
    '</tr>' +
    '{{/each}}' +
    '</table>';


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