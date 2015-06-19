function VirtualTable(options){
    this.options = options;
    this.rowHeight = 45;

    this.getData = this.options.getData;

    this.element = $.parseHTML(this.html)[0];

    //console.log(this.element);


    this.renderHeader();

    // add filler rows
    var rows = '';
    for(var i = 0; i < this.options.length; i++){
        rows += this.emptyRow;
    }
    this.shownIndexes = [];
    this.limit = 100;

    this.$contentElement = $(this.element).find('.content');
    this.$contentElement.append(rows);

    $(this.options.scrollableElement).scroll(function(e){
        if(this.timeout){
            //console.log('return');
            cancelAnimationFrame(this.timeout);
            delete this.timeout;
        }
        this.timeout = requestAnimationFrame(this.onScroll.bind(this));
    }.bind(this));



    window.addEventListener('resize', this.onResize.bind(this));
    requestAnimationFrame(function(){
        this.onResize();
        this.onScroll();
    }.bind(this));
}

VirtualTable.prototype.onResize = function(){
    var height = this.options.parentElement.offsetHeight;
    this.perPage = Math.ceil(height/ this.rowHeight);
};

VirtualTable.prototype.onScroll = function(){
    var scrollTop = this.options.scrollableElement.scrollTop;
    var index = parseInt(scrollTop/this.rowHeight);

    if(this.currentIndex === index){
        return;
    }
    this.currentIndex = index;
    //console.log(index);

    var newIndex  = index - 5;
    var newLength = this.perPage * 2;

    if(newIndex < 0){
        newIndex = index;
    }

    var tr;
    var children = this.$contentElement.children();
    var indexesToQuery = [];
    for(var i = newIndex; i < newIndex + newLength; i++){
        //console.log(i, children.length)
        tr = $(children[i]);
        if(tr.hasClass('empty')){
            indexesToQuery.push(i);
        }
    }

    this.getData(indexesToQuery, function(data){

        for(var key in data){
            tr = $(children[key]);

                if(tr.hasClass('empty')){
                    this.shownIndexes.push(key);
                    tr.removeClass('empty');
                    tr.addClass('filled');
                    tr.empty().append(this.rowHTML(data[key]));
                }
        }

        if(this.shownIndexes.length > this.limit){
            var toRemove = this.shownIndexes.splice(0, 20);
            toRemove.forEach(function(i){
                $(children[i]).empty().addClass('empty').removeClass('filled');
                $(children[i]).blur(function(){
                   //console.log('focus')
                });
            });
        }

        $(this.options.parentElement).focus();

    }.bind(this))

};

VirtualTable.prototype.html =
    '<div class="TableLite">' +
        '<div class="TableLite-header"><table width="100%"><thead class="header"></thead></table></div>' +
        '<div class="TableLite-content"  tabindex="0"><table width="100%"><tbody class="content"></tbody></table></div>' +
    '</div>';



VirtualTable.prototype.renderHeader = function(header){
    var rowString = '<tr>';
    this.options.columns.forEach(function(col){
        rowString += '<th';
        if(col.style !== undefined){
            rowString += ' style="' + col.style + '"';
        }
        rowString += '>' + col.name + '</th>';
    }.bind(this));
    rowString += '</tr>';
    //console.log(this.element)
    $(this.element).find('.header').append(rowString);
};


VirtualTable.prototype.rowHTML = function(data){
    var rowString = '';
    //var rowString = '<tr>'
    this.options.columns.forEach(function(col){
        rowString += '<td ';
        if(col.style !== undefined){
            rowString += ' style="' + col.style + '"';
        }
        rowString += '>' + data[col.property] + '</td>';
    }.bind(this));
    //rowString += '</tr>';
    return rowString;
};

VirtualTable.prototype.emptyRow = '<tr class="empty"></tr>';