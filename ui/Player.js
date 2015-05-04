function Player(options) {
    this.options = options;
    var template = Handlebars.compile(this.html);

    this.element = $.parseHTML(template(options))[0];
    //this.options.parentElement.appendChild(this.element);
    this.$element = $(this.element);
    this.audio = this.element.querySelector('#audio');

    this.$element.find('#player-play').click(this.play.bind(this));
    this.$element.find('#player-pause').click(this.pause.bind(this));


    this.audio.addEventListener("canplaythrough", function () {
        this.duration = this.audio.duration;
        this.timesRight.innerText = secondsToHms(this.duration);
    }.bind(this), false);

    this.audio.addEventListener("timeupdate", timeUpdate.bind(this), false);

    this.timeline = this.element.querySelector('#timeline');
    this.playhead = this.element.querySelector('#playhead');
    this.timesLeft = this.element.querySelector('#times-left');
    this.timesRight = this.element.querySelector('#times-right');
    this.infoArtist = this.element.querySelector('#info-artist');
    this.infoTitle = this.element.querySelector('#info-title');
    this.img = this.element.querySelector('#img');

    this.timeline.addEventListener("click", function (event) {
        moveplayhead.call(this, event);
        this.audio.currentTime = this.duration * clickPercent.call(this, event);
    }.bind(this), false);

}

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
}

function timeUpdate(){
    this.timesLeft.innerText = secondsToHms(this.audio.currentTime);
    var playPercent = 100 * (this.audio.currentTime / this.duration);
    this.playhead.style.width = playPercent + "%";
}

function moveplayhead(e) {
    var timelineWidth = this.timeline.offsetWidth - this.playhead.offsetWidth;
    var newMargLeft = e.pageX - this.timeline.offsetLeft;
    if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
        this.playhead.style.width = (newMargLeft - timelineWidth) + "px";

    }
    if (newMargLeft < 0) {
        this.playhead.style.width = "0px";
    }
    if (newMargLeft > timelineWidth) {
        this.playhead.style.width = (timelineWidth - timelineWidth) + "px";
    }
}
function clickPercent(e) {
    var timelineWidth = this.timeline.offsetWidth - this.playhead.offsetWidth;
    return (e.pageX - this.timeline.offsetLeft) / timelineWidth;
}

Player.prototype.html =
    '<div id="player">' +
            '<div id="img-container"><img id="img"></div>' +

            '<div id="info"> ' +
            '<div id="info-title"></div>' +
            '<div id="info-artist"></div> ' +
            '</div>' +
        '<div id="timeline-container"> ' +
            '<div id="timeline"> ' +
            '<div id="playhead"></div> ' +
        '</div>' +
        '<div id="times">' +
            '<div id="times-left"></div>' +
            '<div id="times-right"></div>' +
        '</div>' +
    '</div>' +
    '<div id="buttons">' +
        '<audio id="audio"></audio>' +
        '<button id="player-backward" class="player-button"><i class="fa fa-fast-backward"></i></button>' +
        '<button id="player-play" class="player-button"><i class="fa fa-play"></i></button>' +
        '<button id="player-pause" class="player-button"><i class="fa fa-pause"></i></button>' +
        '<button id="player-forward" class="player-button"><i class="fa fa-fast-forward"></i></button>' +
    '</div>' +

    '</div>';


Player.prototype.setTitle = function (title) {
    this.infoTitle.innerText = title;
};

Player.prototype.setArtist = function (artist) {
    this.infoArtist.innerText = artist;
};

Player.prototype.setImage = function (image) {
    this.img.src = image;
};

Player.prototype.destroy = function () {
    this.element.remove();
    delete this;
};

Player.prototype.play = function () {
    console.log('play');
    this.audio.play();
    this.$element.addClass('playing');
};

Player.prototype.pause = function () {
    console.log('pause');
    this.audio.pause();
    this.$element.removeClass('playing');
};

Player.prototype.clear = function () {
    this.setArtist('');
    this.setTitle('');

    this.audio.src = '';
    this.$element.removeClass('playing');
};