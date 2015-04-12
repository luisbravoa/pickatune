function SongList(options) {
    this.element = uiUtils.parse('<div id="song-list"></div>');
    this.options = options;



    requestAnimationFrame(this.initialize.bind(this))

}

SongList.prototype.initialize = function(){
    var template = Handlebars.compile(this.html);
    console.log(options);
    this.getData(function (items) {
        console.log({items: items});


        this.element.innerHTML = template({items: items});
        //this.options.parentElement.appendChild(this.element);

        $('#song-list').delegate('.playButton', 'click', function (e) {
            e.preventDefault();
            var id = $(this).attr('data-id');

            global.db.getSongById(id)
                .then(function (song) {
                    global.eventBus.emit('song:play', song);

                });
        });
        $('#song-list').delegate('.addButton', 'click', function (e) {
            e.preventDefault();
            var id = $(this).attr('data-id');

            global.db.getSongById(id)
                .then(function (song) {
                    global.eventBus.emit('song:add', song);

                });
        });

        $('#song-list tr').dblclick(function (e) {
            e.preventDefault();
            debugger;
            var id = $(this).find('.playButton').attr('data-id');

            global.db.getSongById(id)
                .then(function (song) {
                    global.eventBus.emit('song:play', song);

                });
        });
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
    global.db.selectAllSongs()
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