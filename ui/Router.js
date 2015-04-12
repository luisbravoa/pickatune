var AppRouter = Backbone.Router.extend({
    initialize: function(){
        console.log('INIT');
        global.eventBus.on('song:play', function (song) {
            //console.log('router play');
            if(this.songQueue){
                this.songQueue.setCurrent(song);
            }
        }.bind(this));
        global.eventBus.on('song:added', function (song) {
            //console.log('router add');

            if(this.songQueue){
                this.songQueue.addSong(song);
            }
        }.bind(this));
    },
    routes: {
        "songs": 'songs',
        "albums": 'albums',
        "artists": 'artists',
        "queue": 'queue',
        "party": 'party',
        "artists/:name/songs": 'artistsSongs'
    },
    albums: function(){
        if(!this.albumsList){
            loader(true);
            this.albumsList = new ThumbnailList({
                type: 'album',
                url: global.url + "/album",
                primaryLink: {url:'#artists/{#}/songs', property: ['name']},
                secondaryLink: {url:'#artists/{#}/songs', property: ['name']}
            });
            loader(false);
        }

        showContent(this.albumsList.element);
    },
    artists: function(){
        loader(true);
        //$contentWrapper.empty();
        if(this.artistList === undefined){
            this.artistList = new ThumbnailList({
                type: 'artist',
                url: global.url + "/artist",
                primaryLink: {url:'#artists/{#}/songs', property: ['name']},
                secondaryLink: {url:'#artists/{#}/songs', property: ['name']}
            });
        }

        showContent(this.artistList.element);

        loader(false);


    },
    songs: function () {
        loader(true);

        if(this.songsList === undefined){
            this.songsList = new SongList({
                type: 'artist',
                url: global.url + "/artist",
                primaryLink: {url:'#artists/{#}/songs', property: ['name']},
                secondaryLink: {url:'#artists/{#}/songs', property: ['name']}
            });
        }
        showContent(this.songsList.element);

        loader(false);
    },
    party: function () {
        //loader(true);
        if(this.partyRoute === undefined){
            this.partyRoute = new Party({
                url: global.url
            });
        }
        showContent(this.partyRoute.element);
        loader(false);
    },
    queue: function () {

        //loader(true);
        //$contentWrapper.empty();
        if(this.songQueue === undefined){
            this.songQueue = new SongQueue({
                queue: songQueue.getSongs(),
                current:currentSong
            });
        }

        showContent(this.songQueue.element);
        //loader(false);
    }
});