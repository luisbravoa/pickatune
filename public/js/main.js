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
        .done(function () {
        });
}

function addSong(id) {
    $.ajax({
            url: "/song/add/" + id
        })
        .done(function () {
        });
}

function setTable(data) {

    data.forEach(function (song) {

        song.play = '<div class="song-controls">' +
                                '<a href="#" class="playButton " data-id="' + song.id + '"><i class="fa fa-play fa-2x"></i></a> &nbsp; &nbsp; ' +
                                '<a href="#" class="addButton " data-id="' + song.id + '"><i class="fa fa-plus fa-2x"></i></a>' +
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
    $('.addButton').click(function (e) {
        e.preventDefault();
        var id = $(this).attr('data-id');

        addSong(id);
    })

}