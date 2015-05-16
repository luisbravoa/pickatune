function AppPlayer() {
    this.history = [];
    this.queue = [];
    
    this.shuffle = false;

    this.player = new Player({
        onBackward: this.playPrev.bind(this),
        onForward: this.playNext.bind(this)
    });
    
    this.defaultImage = 'file://' + global.baseDir + '/public/img/song_default.png';

    this.player.setImage(this.defaultImage);

    this.player.audio.addEventListener('ended', function () {
        this.playNext();
    }.bind(this));
    
    

}

AppPlayer.prototype.addToQueue = function (item) {
    return this.queue.push(item);
};


AppPlayer.prototype.getNext = function () {
    if (this.queue.length > 0) {
        return this.queue.splice(0, 1)[0];
    }
};

AppPlayer.prototype.playNext = function () {
    var next = this.getNext();
    if (next !== undefined) {
        this.play(next);
    } else {
        // seach for the next
        if(this.shuffle){
            
            var ramdom = randomIntFromInterval(0, global.songs.length);
            
            this.play(global.songs[ramdom]);
                    
        }else{
            var song = _.findWhere(global.songs, {id: this.currentSong.id});
            var index = global.songs.indexOf(song);

            if(index !== -1 && index + 1 < global.songs.length){
                this.play(global.songs[index + 1]);
            }else{
                global.eventBus.emit('song:clear');
            }
        }
    }
};

AppPlayer.prototype.playPrev = function () {
    var prevId = (this.history.length > 1) ? this.history[this.history.length - 1]: undefined;
    if (prevId !== undefined && prevId !== this.currentSong.id) {
        this.playById(prevId, true);
    } else {
        // seach for the next
        if(this.shuffle){
            
            var ramdom = randomIntFromInterval(0, global.songs.length);
            
            this.play(global.songs[ramdom]);
                    
        }else{
            var song = _.findWhere(global.songs, {id: this.currentSong.id});
            var index = global.songs.indexOf(song);

            if(index !== -1 && index - 1 < global.songs.length){
                this.play(global.songs[index - 1]);
            }else{
                global.eventBus.emit('song:clear');
            }
        }
    }
};



AppPlayer.prototype.getSongQueue = function () {
    return this.queue;
};
AppPlayer.prototype.clear = function () {
    //    clear queue and history
    this.player.clear();
};

AppPlayer.prototype.playById = function(id, silent){
    var song = _.findWhere(global.songs, {id: id});
    
    if(song){
        this.play(song, silent);
    }

}

AppPlayer.prototype.play = function (song, silent) {

    this.player.audio.src = 'file:///' + song.file;
    this.player.setTitle(song.title);
    this.player.setArtist(song.artist);

    if(!silent){
        this.history.push(song.id);
    }
    
    if(song.artist !== undefined && song !== undefined){
        
        $.get('http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=3560007ae1982c970859a515efeb3174&artist=' + song.artist + '&track=' + song.title + '&format=json',
        function (res) {

            var data = res.track || {};

            var imgUrl = (data !== undefined && data.album.image && data.album.image.length > 0) ? data.album.image[data.album.image.length - 2]['#text'] : '';
            if (imgUrl) {
                this.player.setImage(imgUrl);
            }else{
                this.player.setImage(this.defaultImage);
            }

        }.bind(this));
        
    }else{
        this.player.setImage(this.defaultImage);
    }

    this.player.play();

    this.currentSong = song;

};


AppPlayer.prototype.isPlaying = function () {
    return (!this.player.audio.src || (!this.player.audio.paused && this.player.audio.ended));
}


function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}