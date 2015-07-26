function DetailList(options) {
    this.element = $.parseHTML('<div id="detailList"></div>')[0];
    this.options = options;

    var template = Handlebars.compile(this.html);
    var html = template(this.options.data);

    $(this.element).append(html);


}
DetailList.prototype.html =

    '<h1>{{artist}}</h1>' +
    '{{#each albums}}' +
    '<h2>{{@key}}</h2>' +
    '<div>' +
    '<ul class="DetailList-content" >' +
    '{{#each this}}' +
    '<li data-id="{{id}}">' +
    '<h2>{{#if title}}{{title}}{{else}}(Unknown){{/if}}</h2>' +
    '<p>{{#if artist}}{{artist}}{{else}}(Unknown){{/if}}</p>' +
    '</li>' +
    '{{/each}}' +

    '</ul>'+
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