var AppRouter = Backbone.Router.extend({

    routes: {
        "songs": 'showSongs',
        "albums": 'albums',
        "artists": 'artists',
        "settings": 'settings',
        "artist/:artist": 'detail',
        "album/:artist/:album": 'detail'
    },

    showContent: function (element) {
        if(element.parentNode !== this.$contentWrapper[0]){
            this.$contentWrapper.append(element);
        }
        this.$contentWrapper.children().hide();
        $(element).show();
    },

    collapseNav: function(){
        $('.navbar-collapse').collapse('hide');
    },

    artists: function(){
        if(!this.artistList){
            this.artistList = new ThumbnailList({
                id: 'artists',
                type: 'artist',
                url: "/artist",
                defaultImage: 'img/artist_default.png',
                primaryLink: {url:'#artist/{#}', property: ['name']},
                secondaryLink: {url:'#artist/{#}', property: ['name']},
                perPage:50,
                getData: function(index, length, cb){
                    $.get('artist/'+index+'/'+length, function(data){
                        cb(data.data);
                    });
                },
                getInfo: function(item, cb){
                    $.get('http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + item.name + '&api_key=3560007ae1982c970859a515efeb3174&format=json',
                        function(res){

                            var data = {};


                            data.imgUrl = (res !== undefined && res.artist&& res.artist.image && res.artist.image.length > 0) ? res.artist.image[2]['#text'] : '';
                            //console.log(res, data);

                            cb(data)
                        });
                },
                parentElement: document.querySelector('#content-wrapper')
            });

        }

        this.showContent(this.artistList.element);
    },

    albums: function(){
        if(!this.albumList){
            this.albumList = new ThumbnailList({
                id: 'albums',
                type: 'album',
                defaultImage: 'img/album_default.png',
                url: "/album",
                primaryLink: {url:'#album/{#}/{#}', property: ['artist', 'name']},
                secondaryLink: {url:'#artist/{#}', property: ['artist']},
                perPage:50,
                getData: function(index, length, cb){
                    $.get('album/'+index+'/'+length, function(data){
                        cb(data.data);
                    });
                },
                getInfo: function(item, cb){
                    $.get('http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=3560007ae1982c970859a515efeb3174&artist=' + item.artist + '&album=' + item.name + '&format=json',
                        function(res){

                            var data = {};


                            data.imgUrl = (res !== undefined && res.album && res.album.image && res.album.image.length > 0) ? res.album.image[2]['#text'] : '';
                            //console.log(res, data);

                            cb(data)
                        });
                },
                parentElement: document.querySelector('#content-wrapper')
            });

        }

        console.log(this.albumList.element);
        this.showContent(this.albumList.element);
    },

    initialize: function(){

        this.$pageWrapper = $('.page-wrapper');
        this.$contentWrapper = $('.content-wrapper');
        this.$playButton = $('#play');
        this.$addButton = $('#add');
        this.$playDeviceButton = $('#play-device');
        this.$closeSideButton = $('#side-panel-close');
        this.$player = $('#player');
        this.$sidebarOverlay = $('#side-panel-overlay');

        this.$sidebarOverlay.click(this.hideSidePanel.bind(this));

        this.$playButton.click(function(){
           if(this.selectedSong){
               this.playSong(this.selectedSong);
           }
        }.bind(this));

        this.$addButton.click(function(){
           if(this.selectedSong){
               this.addSong(this.selectedSong);
           }
        }.bind(this));

        this.$playDeviceButton.click(function(){
           if(this.selectedSong){
               this.playSongInDevice(this.selectedSong);
           }
        }.bind(this));

        this.$closeSideButton.click(function(){
            this.hideSidePanel();
        }.bind(this));

        //$('.nav.navbar-nav a').click(this.collapseNav.bind(this));
    },

    playSong: function (song) {
        $.get('/song/play/'+song.id)
            .done(function () {
            });
    },
    playSongInDevice: function (song) {
        this.$player.attr('src', '/music'+song.url);
        this.$player[0].play();
    },
    addSong: function (song) {
        $.get('/song/add/'+song.id)
            .done(function () {
            });
    },
    showDetail: function(){

        if(this.selectedSongId !== undefined){

            this.getSong(this.selectedSongId, function(song){
                this.selectedSong = song;
                $('#side-panel-song').html(this.selectedSong.title);
                $('#side-panel-artist').html(this.selectedSong.artist);
                if(this.selectedSong){
                    this.showSidePanel();
                }
            }.bind(this));

        }
    },
    isSidePanelOpened: function(){
        return this.$pageWrapper.hasClass('side');
    },
    onSwipe: function(){
        if(this.isSidePanelOpened()){
            this.hideSidePanel();
        }
    },
    showSidePanel: function(){
        if (!this.isSidePanelOpened()){
            this.$pageWrapper.addClass('side');

            this.swipeHandler = this.onSwipe.bind(this);

            $('.page-wrapper').on( "swiperight", this.swipeHandler);
        }
    },
    hideSidePanel: function(){
        if (this.isSidePanelOpened()){
            this.$pageWrapper.removeClass('side');
        }

        $('.page-wrapper').off( "swiperight", this.swipeHandler);
    },
    showSongs: function (data) {


        if(!this.songsList){

            this.songContainer = $.parseHTML('<div id="songs"></div>')[0];
            this.showContent(this.songContainer);

            $.ajax({
                url: "/song/length"
            })
                .done(function (data) {
                    this.songsLength = data.length;
                    this.songsList =  new VirtualTable({
                        columns: [
                            {
                                name: '',
                                property: 'play',
                                style: 'min-width:0px; max-width:0px; width: 0px; padding:0;'
                            },
                            {
                                name: 'Title',
                                property: 'title',
                                width: '200px'
                            },
                            {
                                name: 'Artist',
                                property: 'artist',
                                width: '200px'
                            },
                            {
                                name: 'Album',
                                property: 'album',
                                width: '200px'
                            },
                            {
                                name: 'File',
                                property: 'file',
                                width: '200px'
                            }
                        ],
                        length: this.songsLength,
                        parentElement: document.querySelector('#songs'),
                        scrollableElement: document.querySelector('#songs'),
                        getData: this.getData.bind(this)
                    });


                    this.songContainer.appendChild(this.songsList.element);


                    $('.TableLite-content').delegate('tr', 'click', function (e) {
                        e.preventDefault();
                        this.selectedSongId = parseInt($(e.target.parentNode).find('[data-id]').attr('data-id'));
                        this.showDetail();
                    }.bind(this));
                }.bind(this));
        }else{
            this.showContent(this.songContainer);
        }


    },
    getData: function (indexes, cb) {

        // nope
        //if(this._songXHR){
        //    this._songXHR.abort();
        //    delete this._songXHR;
        //}

        this._songXHR = $.get('/song/index/' + indexes.join(','))
            .done(function(data){

                for(var key in data){
                    var song = data[key];
                    song.play = '<div class="song-controls" data-id="' + song.id + '"></div>';
                }

                cb(data);
            });
    },
    getSong: function(id, cb){
        $.get('/song/'+id)
            .done(function(song){

                cb(song);
            });
    }
});


$(function () {
    var router = new AppRouter();
    Backbone.history.start();
    router.navigate("songs", {trigger: true});


});