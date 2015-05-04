function DetailList(options) {
    this.element = $.parseHTML('<div id="detailList"></div>')[0];
    this.options = options;

    var template = Handlebars.compile(this.html);
    var html = template(this.options.data);

    $(this.element).append(html);

    //this.element.appendChild(this.table.element);

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
    //
    //$('#song-list tr').dblclick(function (e) {
    //    e.preventDefault();
    //    var id = $(this).find('.playButton').attr('data-id');
    //    var song = global.models.Song.getByFile(id);
    //
    //    if(song){
    //        global.eventBus.emit('song:play', song);
    //    }
    //});
}
DetailList.prototype.html =

    '<h1>{{artist}}</h1>' +
    '{{#each albums}}' +
    '<h2>{{@key}}</h2>' +
    '<div class="TableLite">' +
    '<table style="width:100%">' +
    '<thead>' +
    '<th style="min-width: 70px; max-width: 70px; width: 70px;"></th>' +
    '<th style="min-width: 70px; max-width: 70px; width: 70px;">#</th>' +
    '<th>Title</th>' +
    '<th>Album</th>' +
    '<th>Artist</th>' +
    '<th>file</th>' +

    '</thead>' +
    '{{#each this}}' +
    '<tr>' +
    '<td style="min-width: 70px; max-width: 70px; width: 70px;">{{{play}}}</td>' +
    '<td style="min-width: 70px; max-width: 70px; width: 70px;">{{#if track}}{{track}}{{else}}(Unknown){{/if}}</td>' +
    '<td>{{#if title}}{{title}}{{else}}(Unknown){{/if}}</td>' +
    '<td>{{#if album}}{{album}}{{else}}(Unknown){{/if}}</td>' +
    '<td>{{#if artist}}{{artist}}{{else}}(Unknown){{/if}}</td>' +
    '<td>{{file}}</td>' +
    '</tr>' +
    '{{/each}}' +

    '</table>'+
    '</div>'+
    '{{/each}}';


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