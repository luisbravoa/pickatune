function SongQueue(options) {
    this.options = options;
    this.element = parse('<div></div>');
    var template = Handlebars.compile(this.html);

    this.songTemplte = Handlebars.compile(this.songHtml);
    //console.log(options);

    this.element.innerHTML = template(options);
}

SongQueue.prototype.addSong = function(song){
    $(createTr(song)).hide().appendTo(this.element.querySelector('#queue-song-list')).fadeIn(1000);
    //this.element.querySelector('#queue-song-list').appendChild(createTr(song));
};

SongQueue.prototype.setCurrent = function(song){

    $('#queue-song-list tr[data-id='+song.id+']').remove();

    $('#queue-song-current tbody').children().remove();


    $(createTr(song)).hide().appendTo(this.element.querySelector('#queue-song-current tbody')).fadeIn(1000);
};

    function createTr(song){
    var tr = document.createElement("TR");
        tr.setAttribute("data-id", song.id);
    var title = tr.insertCell(0);
    title.innerHTML = (song.title)? song.title: 'Unknown';
    var album = tr.insertCell(1);
    album.innerHTML = (song.album)? song.album: 'Unknown';
    var artist = tr.insertCell(2);
    artist.innerHTML = (song.artist)? song.artist: 'Unknown';

    return tr;
}

SongQueue.prototype.songHtml =
//'<tr>' +
'<td>{{#if title}}{{title}}{{else}}(Unknown){{/if}}</td>' +
'<td>{{#if album}}{{album}}{{else}}(Unknown){{/if}}</td>' +
'<td>{{#if artist}}{{artist}}{{else}}(Unknown){{/if}}</td>';
//'</tr>';

SongQueue.prototype.html =
    '<div id="song-list">' +
    '<h2>Now Playing</h2>' +
    '<table id="queue-song-current" style="width:100%">' +
    '<thead>' +
    '<tr>' +
    '<th>Title</th>' +
    '<th>Album</th>' +
    '<th>Artist</th>' +
    '</thead>' +
    '<tbody>' +
    '{{#if current}}' +

    '</tr>' +
    '<tr data-id="{{current.id}}">' +
    '<td>{{#if current.title}}{{current.title}}{{else}}(Unknown){{/if}}</td>' +
    '<td>{{#if current.album}}{{current.album}}{{else}}(Unknown){{/if}}</td>' +
    '<td>{{#if current.artist}}{{current.artist}}{{else}}(Unknown){{/if}}</td>' +
    '</tr>' +

    '{{/if}}' +
    '</tbody>' +
    '</table>' +
    '<h2>Next...</h2>' +
    '<table id="queue-song-list" style="width:100%">' +
    '<tr>' +
    '<th>Title</th>' +
    '<th>Album</th>' +
    '<th>Artist</th>' +
    //'<th>file</th>' +
    '{{#each queue}}' +
    '</tr>' +
    '<tr data-id="{{id}}">' +
    '<td>{{#if title}}{{title}}{{else}}(Unknown){{/if}}</td>' +
    '<td>{{#if album}}{{album}}{{else}}(Unknown){{/if}}</td>' +
    '<td>{{#if artist}}{{artist}}{{else}}(Unknown){{/if}}</td>' +
    '</tr>' +
    '{{/each}}' +
    '</table>' +

    '</div>';

SongQueue.prototype.destroy = function () {
    this.element.remove();
    delete this;
};