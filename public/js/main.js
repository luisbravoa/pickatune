$(function () {
    getSongs();
});


function getSongs() {
    $.ajax({
            url: "/song"
        })
        .done(function (data) {
            setTable(data);
        });
}

function playSong(id) {
    $.ajax({
            url: "/song/play/" + id
        })
        .done(function (data) {
            setTable(data);
        });
}

function setTable(data) {

    data.forEach(function (song) {

        song.play = '<div class="song-controls">' +
                                '<a href="#" class="playButton " data-id="' + song.id + '"><i class="fa fa-play"></i></a> ' +
                                '<a href="#" class="addButton " data-id="' + song.id + '"><i class="fa fa-plus"></i></a>' +
                            '</div>';

    })

    var table = new TableLite({
        columns: [
            {
                name: 'play',
                property: 'play'
            },
            {
                name: 'Title',
                property: 'title'
            },
//            {
//                name: 'id',
//                property: 'id'
//                },
            {
                name: 'Artist',
                property: 'artist'
            },
            {
                name: 'Album',
                property: 'album'
            },
//            {
//                name: 'Genre',
//                property: 'genre'
//            },
//            {
//                name: 'Track',
//                property: 'track'
//            },
//            {
//                name: 'Year',
//                property: 'year'
//            },

            {
                name: 'File',
                property: 'file'
                }
            ],
        data: data,
        parentElement: document.querySelector('#table')
    })

    $('.playButton').click(function (e) {
        e.preventDefault();
        var id = $(this).attr('data-id');

        playSong(id);
    })

}