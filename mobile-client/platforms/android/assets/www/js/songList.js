function SongList(options) {
    this.options = options;
    this.rowHeight = 45;

    this.getData = this.options.getData;

    this.element = $.parseHTML(this.html)[0];

    //console.log(this.element);


    // add filler rows
    var rows = '';
    for (var i = 0; i < this.options.length; i++) {
        rows += this.emptyRow;
    }
    this.shownIndexes = [];
    this.limit = 200;

    this.$contentElement = $(this.element).find('.SongList-content');
    this.$contentElement.append(rows);
//    console.log(this.$contentElement)

    $(this.options.scrollableElement).scroll(function (e) {
        if (this.timeout) {
            //console.log('return');
            clearTimeout(this.timeout);
            delete this.timeout;
        }
        this.timeout = setTimeout(this.onScroll.bind(this), 20);
    }.bind(this));



    window.addEventListener('resize', this.onResize.bind(this));
    requestAnimationFrame(function () {
        this.onResize();
        this.onScroll();
    }.bind(this));
}

SongList.prototype.onResize = function () {
    var height = this.options.parentElement.offsetHeight;
    this.perPage = Math.ceil(height / this.rowHeight);
};

SongList.prototype.onScroll = function () {
    var scrollTop = this.options.scrollableElement.scrollTop;
    var index = parseInt(scrollTop / this.rowHeight);

    if (this.currentIndex === index) {
        return;
    }
    this.currentIndex = index;
    //console.log(index);

    var newIndex = index - (this.perPage * 4);
    var newLength = this.perPage * 8;

    if (newIndex < 0) {
        newIndex = index;
    }

    var tr;
    var children = this.$contentElement.children();
    var indexesToQuery = [];
    for (var i = newIndex; i < newIndex + newLength; i++) {
        //console.log(i, children.length)
        tr = $(children[i]);
        if (tr.hasClass('empty')) {
            indexesToQuery.push(i);
        }
    }
    
    if(indexesToQuery.length === 0){
        return;
    }

    console.log(indexesToQuery);
    this.getData(indexesToQuery, function (data) {
        console.log('response');
        for (var key in data) {
            tr = $(children[key]);

            if (tr.hasClass('empty')) {
                this.shownIndexes.push(key);
                tr.removeClass('empty');
                tr.addClass('filled');
                tr.replaceWith(this.rowHTML(data[key]));
            }
        }

        if (this.shownIndexes.length > this.limit) {
            var toRemove = this.shownIndexes.splice(0, 20);
            toRemove.forEach(function (i) {
                $(children[i]).empty().addClass('empty').removeAttr('data-id').removeClass('filled');
            });
        }

        $(this.options.parentElement).focus();

    }.bind(this))

};

SongList.prototype.html =
    '<div class="SongList">' +
    '<ul class="SongList-content"  tabindex="0"></ul>' +
    '</div>';

SongList.prototype.rowHTML = function (data) {
    var rowString = '<li data-id="' + data.id + '"><h2>' + data.title + '</h2><p>' + data.artist + '<p></li>';
    return rowString;
};

SongList.prototype.emptyRow = '<li class="empty"></li>';