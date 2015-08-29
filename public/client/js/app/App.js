define([
    'jquery',
    'backbone',
    '../thumbnailList/ThumbnailList',
    '../detailList/DetailList',
    '../songList/songList',
    '../modal/Modal',
    'text!./app.html',
    'i18next',
    'bootstrap'], function ($, Backbone, ThumbnailList, DetailList, SongList, Modal, html) {
    //console.log(i18n);



    return Backbone.Router.extend({

        routes: {
            "songs": 'showSongs',
            "album/:artist/:album": 'detail',
            "artist/:artist": 'detail',
            "albums": 'albums',
            "artists": 'artists',
            "settings": 'settings',
            '*actions': 'defaultRoute'
        },
        defaultRoute: function () {
            this.navigate('songs', {trigger: true});
        },
        lastFM: 'http://ws.audioscrobbler.com/2.0/',

        initialize: function (options) {

            this.options = options;
            this.baseUrl = (this.options && this.options.baseUrl) ? this.options.baseUrl : '';


            $("body").html(html);
            $("body").i18n();
            this.initUI();


            $(document).ajaxError(function (event, request, settings) {

                if (settings.url.indexOf(this.lastFM) === -1 && request.statusText !== 'abort') {
                    this.showDialog({
                        action: function () {
                            if(options.retry){
                                this.showLoader(true);
                                options.retry(function(){
                                    this.retry(settings);
                                }.bind(this));
                            }else{
                                this.retry(settings);
                            }
                        }.bind(this)
                    });
                }
            }.bind(this));
        },
        showLoader: function(show){
            if(show){
                $('#loader').modal({backdrop: 'static'});
            }else{
                $('#loader').hide();
            }
        },

        retry: function (settings) {
            $.ajax(settings).fail(this.showDialog.bind(this));
            this.showLoader(false);
        },

        showDialog: function (options) {
            if (!this.modal) {
                this.modal = new Modal({
                    onAction: options.action,
                    title: $.i18n.t('ModalTitle'),
                    content: $.i18n.t('ModalContent')
                });
            } else {
                setTimeout(function () {
                    console.log('show')
                    this.modal.show();
                }.bind(this), 100);
            }


        },
        initUI: function () {


            this.$pageWrapper = $('.page-wrapper');
            this.$contentWrapper = $('.content-wrapper');
            this.$playButton = $('#play');
            this.$addButton = $('#add');
            this.$playDeviceButton = $('#play-device');
            this.$closeSideButton = $('#side-panel-close');
            this.$player = $('#player');
            this.$sidebarOverlay = $('#side-panel-overlay');

            this.$sidebarOverlay.click(this.hideSidePanel.bind(this));

            this.$playButton.click(function () {
                if (this.selectedSong) {
                    this.playSong(this.selectedSong);
                }
            }.bind(this));

            this.$addButton.click(function () {
                if (this.selectedSong) {
                    this.addSong(this.selectedSong);
                }
            }.bind(this));

            this.$playDeviceButton.click(function () {
                if (this.selectedSong) {
                    this.playSongInDevice(this.selectedSong);
                }
            }.bind(this));

            this.$closeSideButton.click(function () {
                this.hideSidePanel();
            }.bind(this));
        },

        onError: function (e) {
            if (e.status === 404) {
                this.onNetworkError();
            }
        },

        getDataForDetails: function (artist, album, cb) {
            var url = this.baseUrl + '/artists/' + encodeURI(artist);
            if (album) {
                url += '/albums/' + encodeURI(album);
            }
            url += '/songs';
            $.get(url, cb.bind(this))
                .fail(function (e) {
                    if (e.status === 404) {
                        this.onNetworkError();
                    }
                }.bind(this));
        },

        detail: function (artist, album) {

            this.getDataForDetails(artist, album, function (data) {
                if (this.detailList) {
                    this.detailList.destroy();
                }

                data.artist = artist;

                this.detailList = new DetailList({

                    data: data,
                    parentElement: document.querySelector('#content-wrapper')
                });
                this.showContent(this.detailList.element);

                $(this.detailList.element).find('.DetailList-content li').click(function (e) {
                    this.selectedSongId = (e.target.getAttribute('data-id') !== null) ? e.target.getAttribute('data-id') : e.target.parentNode.getAttribute('data-id');
                    this.showDetail();
                }.bind(this));
            });

        },

        showContent: function (element) {
            if (element.parentNode !== this.$contentWrapper[0]) {
                this.$contentWrapper.append(element);
            }
            this.$contentWrapper.children().hide();
            $(element).show();
        },

        collapseNav: function () {
            $('.navbar-collapse').collapse('hide');
        },

        artists: function () {
            if (!this.artistList) {
                this.artistList = new ThumbnailList({
                    id: 'artists',
                    type: 'artist',
                    url: this.baseUrl + "/artists",
                    defaultImage: 'client/img/artist_default.png',
                    primaryLink: {
                        url: '#artist/{#}',
                        property: ['name']
                    },
                    secondaryLink: {
                        url: '#artist/{#}',
                        property: ['name']
                    },
                    perPage: 50,
                    getData: function (index, length, cb) {
                        $.get(this.baseUrl + '/artists/' + index + '/' + length, function (data) {
                            cb(data.data);
                        });
                    }.bind(this),
                    getInfo: function (item, cb) {
                        $.get(this.lastFM + '?method=artist.getinfo&artist=' + item.name + '&api_key=3560007ae1982c970859a515efeb3174&format=json',
                            function (res) {

                                var data = {};


                                data.imgUrl = (res !== undefined && res.artist && res.artist.image && res.artist.image.length > 0) ? res.artist.image[2]['#text'] : '';
                                //console.log(res, data);

                                cb(data)
                            });
                    }.bind(this),
                    parentElement: document.querySelector('#content-wrapper')
                });

            }

            this.showContent(this.artistList.element);
        },

        albums: function () {
            if (!this.albumList) {
                this.albumList = new ThumbnailList({
                    id: 'albums',
                    type: 'album',
                    defaultImage: 'client/img/album_default.png',
                    url: this.baseUrl + "/albums",
                    primaryLink: {
                        url: '#album/{#}/{#}',
                        property: ['artist', 'name']
                    },
                    secondaryLink: {
                        url: '#artist/{#}',
                        property: ['artist']
                    },
                    perPage: 50,
                    getData: function (index, length, cb) {
                        $.get(this.baseUrl + '/albums/' + index + '/' + length, function (data) {
                            cb(data.data);
                        });
                    }.bind(this),
                    getInfo: function (item, cb) {
                        $.get(this.lastFM + '?method=album.getinfo&api_key=3560007ae1982c970859a515efeb3174&artist=' + item.artist + '&album=' + item.name + '&format=json',
                            function (res) {

                                var data = {};


                                data.imgUrl = (res !== undefined && res.album && res.album.image && res.album.image.length > 0) ? res.album.image[2]['#text'] : '';
                                //console.log(res, data);

                                cb(data)
                            });
                    }.bind(this),
                    parentElement: document.querySelector('#content-wrapper')
                });

            }

            this.showContent(this.albumList.element);
        },


        playSong: function (song) {
            $.get(this.baseUrl + '/songs/play/' + song.id)
                .done(function () {
                });
        },
        playSongInDevice: function (song) {
            this.$player.attr('src', this.baseUrl + '/music' + song.url);
            this.$player[0].play();
        },
        addSong: function (song) {
            $.get('/songs/add/' + song.id)
                .done(function () {
                });
        },
        showDetail: function () {

            if (this.selectedSongId !== undefined) {

                this.getSong(this.selectedSongId, function (song) {
                    this.selectedSong = song;
                    $('#side-panel-song').html(this.selectedSong.title);
                    $('#side-panel-artist').html(this.selectedSong.artist);
                    if (this.selectedSong) {
                        this.showSidePanel();
                    }
                }.bind(this));

            }
        },
        isSidePanelOpened: function () {
            return this.$pageWrapper.hasClass('side');
        },
        onSwipe: function () {
            if (this.isSidePanelOpened()) {
                this.hideSidePanel();
            }
        },
        showSidePanel: function () {
            if (!this.isSidePanelOpened()) {
                this.$pageWrapper.addClass('side');

                this.swipeHandler = this.onSwipe.bind(this);

                $('.page-wrapper').on("swiperight", this.swipeHandler);
            }
        },
        hideSidePanel: function () {
            if (this.isSidePanelOpened()) {
                this.$pageWrapper.removeClass('side');
            }

            $('.page-wrapper').off("swiperight", this.swipeHandler);
        },
        showSongs: function (data) {
            console.log('showsongs')
            if (!this.songsList) {
                this.songContainer = $.parseHTML('<div id="songs"></div>')[0];
                $.ajax({
                    url: this.baseUrl + "/songs/length"
                })
                    .done(function (data) {
                        this.songsLength = data.length;
                        this.songsList = new SongList({
                            length: this.songsLength,
                            parentElement: document.querySelector('#songs'),
                            scrollableElement: document.querySelector('#songs'),
                            getData: this.getData.bind(this)
                        });

                        this.songContainer.appendChild(this.songsList.element);

                        $('.SongList-content').delegate('li', 'click', function (e) {
                            this.selectedSongId = (e.target.getAttribute('data-id') !== null) ? e.target.getAttribute('data-id') : e.target.parentNode.getAttribute('data-id');
                            this.showDetail();
                        }.bind(this));
                    }.bind(this));
            }

            this.showContent(this.songContainer);

        },
        getData: function (indexes, cb) {
            console.log('getData', indexes);

            if (this._songXHR) {
                this._songXHR.abort();
                delete this._songXHR;
            }

            this._songXHR = $.get(this.baseUrl + '/songs/index/' + indexes.join(','))
                .done(function (data) {


                    cb(data);
                });
        },
        getSong: function (id, cb) {
            $.get(this.baseUrl + '/songs/' + id)
                .done(function (song) {

                    cb(song);
                });
        }
    });
});

