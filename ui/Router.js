define([
    'jquery',
    'handlebars',
    'backbone',
    './routes/SongList/SongList',
    './routes/ThumbnailList/ThumbnailList' ,
    './routes/SongQueue/SongQueue' ,
    './routes/Settings/Settings',
    './routes/DetailList/DetailList',
    '../public/client/js/modal/Modal',
    'i18next'
], function ($, Handlebars, Backbone, SongList, ThumbnailList, SongQueue, Settings, DetailList, Modal) {
    var qrcode = document.querySelector('#qr');
    var $contentWrapper = $('#content-wrapper');
    var contentWrapper = document.querySelector('#content-wrapper');
    var AppRouter = Backbone.Router.extend({
        initialize: function () {

            global.eventBus.on('songs:reload', function () {

                if (this.songQueue) {
                    this.songQueue.destroy();
                    delete this.songQueue;
                }
                if (this.albumsList) {
                    this.albumsList.destroy();
                    delete this.albumsList;
                }
                if (this.artistList) {
                    this.artistList.destroy();
                    delete this.artistList;
                }
                if (this.songsList) {
                    this.songsList.destroy();
                    delete this.songsList;
                }
                if (this.songsList) {
                    this.songsList.destroy();
                    delete this.songQueue;
                }
                if (this.detailList) {
                    this.detailList.destroy();
                    delete this.detailList;
                }
                if (this.settingsRoute) {
                    this.settingsRoute.destroy();
                    delete this.settingsRoute;
                }
                $contentWrapper.empty();
            }.bind(this));

            global.eventBus.on('player:change', function () {
                if (this.songQueue) {
                    this.songQueue.setCurrent(global.appPlayer.currentSong);

                }
            }.bind(this));

            global.eventBus.on('song:added', function (song) {

                if (this.songQueue) {
                    this.songQueue.addSong(song);
                }
            }.bind(this));

            $('#side-panel-overlay, #side-panel-close').click(function () {
                this.hideSidePanel();
                window.history.back();
            }.bind(this));

            $(window).resize(this.setSidePanelWidth.bind(this));

            router = this;

        },


        showDialog: function () {
            if(!this.modal){
                this.modal = new Modal({
                    primary: {
                        label: $.i18n.t('loadError.action'),
                        action: function () {

                        }.bind(this)
                    },
                    title: $.i18n.t('loadError.title'),
                    content: $.i18n.t('loadError.content')
                });
            }

            this.modal.show();

            modal = this.modal;
        },

        routes: {
            "songs": 'songs',
            "albums": 'albums',
            "artists": 'artists',
            "queue": 'queue',
            "party": 'party',
            "settings": 'settings',
            "artist/:artist": 'detail',
            "album/:artist/:album": 'detail'
        },
        hideSidePanel: function () {
            $('#page-wrapper').removeClass('side');
        },
        setSidePanelWidth: function () {
            var $pageWrapper = $('#page-wrapper');
            var width = $pageWrapper.width();
            $('#side-panel-content').width(width);
        },
        showSidePanel: function () {
            var $pageWrapper = $('#page-wrapper');

            this.setSidePanelWidth();

            $pageWrapper.addClass('side');
        },
        showContent: function (element) {


            if (element.parentNode !== contentWrapper) {
                $contentWrapper.append(element);
            }

            $contentWrapper.children().hide();
            $(element).show();

        },

        loader: function (show) {
            if (show) {
                $('#loader').modal({
                    backdrop: 'static'
                });
            } else {
                $('#loader').modal('hide')
            }
        },

        setLoaderText: function (text) {
            $('#loader-message').text(text);
        },

        detail: function (artist, album) {
            //        console.log(artist, album)

            var data = {};


            function getPlay(song) {
                return '<div class="song-controls">' +
                    '<a href="#" class="playButton" data-id="' + song.file + '"><i class="fa fa-play"></i></a> ' +
                    '<a href="#" class="addButton" data-id="' + song.file + '"><i class="fa fa-plus"></i></a>' +
                    '</div>';
            }

            // album
            if (artist !== null && album !== null) {

                data.albums = {};
                data.albums[album] = global.songs.filter(function (song) {
                    return (song.artist === artist && song.album === album);
                });

                data.albums[album].forEach(function (song) {

                    song.play = getPlay(song);

                });


            } else if (artist !== null) {
                var songs = global.songs.filter(function (song) {
                    return (song.artist === artist);
                });


                var albums = {};

                songs.forEach(function (song) {

                    song.play = getPlay(song);

                    if (albums[song.album] === undefined) {
                        albums[song.album] = [song];
                    } else {
                        albums[song.album].push(song);
                    }
                });
                data.albums = albums;
            }

            data.artist = artist;


            if (this.detailList) {
                this.detailList.destroy();
            }

            this.detailList = new DetailList({
                data: data,
                parentElement: document.querySelector('#page-wrapper')
            });


            this.showSidePanel();
            $('#side-panel-content').append(this.detailList.element);
            global.setCurrent();
        },

        albums: function () {
            if (!this.albumsList) {

                this.albumsList = new ThumbnailList({
                    id: 'albums',
                    type: 'album',
                    defaultImage: 'public/client/img/album_default.png',
                    url: global.url + "/album",
                    primaryLink: {
                        url: '#album/{#}/{#}',
                        property: ['artist', 'name']
                    },
                    secondaryLink: {
                        url: '#artist/{#}',
                        property: ['artist']
                    },
                    getData: function (index, length, cb) {
                        var data = global.albums.slice(index, index + length);
                        cb(data);
                    },
                    getInfo: function (item, cb) {
                        $.get('http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=3560007ae1982c970859a515efeb3174&artist=' + item.artist + '&album=' + item.name + '&format=json',
                            function (res) {
                                var data = {};
                                data.imgUrl = (res !== undefined && res.album && res.album.image && res.album.image.length > 0) ? res.album.image[3]['#text'] : '';
                                cb(data)
                            });

                    },
                    parentElement: document.querySelector('#page-wrapper')
                });
            }

            this.showContent(this.albumsList.element);
        },
        artists: function () {

            if (this.artistList === undefined) {
                this.artistList = new ThumbnailList({
                    id: 'artists',
                    type: 'artist',
                    url: global.url + "/artist",
                    defaultImage: 'public/client/img/artist_default.png',
                    primaryLink: {
                        url: '#artist/{#}',
                        property: ['name']
                    },
                    secondaryLink: {
                        url: '#artist/{#}',
                        property: ['name']
                    },
                    getData: function (index, length, cb) {
                        var data = global.artists.slice(index, index + length);

                        cb(data);
                    },
                    getInfo: function (item, cb) {

                        $.get('http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + item.name + '&api_key=3560007ae1982c970859a515efeb3174&format=json',
                            function (res) {
                                var data = {};
                                data.imgUrl = (res !== undefined && res.artist && res.artist.image && res.artist.image.length > 0) ? res.artist.image[3]['#text'] : '';
                                cb(data)
                            });
                    },
                    parentElement: document.querySelector('#page-wrapper')
                });
            }

            this.showContent(this.artistList.element);

        },
        songs: function () {

            if (this.songsList === undefined) {
                this.songsList = new SongList({
                    parentElement: document.querySelector('#page-wrapper'),
                    strings: {
                        album: $.i18n.t('Album'),
                        artist: $.i18n.t('Artist'),
                        title: $.i18n.t('Title'),
                        unknown: $.i18n.t('Unknown')
                    }
                });
            }
            this.showContent(this.songsList.element);

        },
        party: function () {
            if (this.partyRoute === undefined) {
                this.partyRoute = new Party({
                    url: global.url
                });
            }
            this.showContent(this.partyRoute.element);
        },
        settings: function () {
            if (this.settingsRoute === undefined) {
                this.settingsRoute = new Settings({
                    url: global.url
                });
            }
            this.showContent(this.settingsRoute.element);
        },
        queue: function () {

            if (this.songQueue === undefined) {
                this.songQueue = new SongQueue({
                    queue: global.appPlayer.getSongQueue(),
                    current: global.appPlayer.currentSong,
                    strings: {
                        unknown: $.i18n.t('Unknown')
                    }
                });
            }

            this.showContent(this.songQueue.element);
        }
    });

    return AppRouter;

});