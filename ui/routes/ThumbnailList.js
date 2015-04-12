function ThumbnailList(options) {
    this.options = options;
    var template = Handlebars.compile(this.html);
    console.log(options);

    this.element = parse('<div></div>');
    this.getData(function (items) {
        console.log({items: items});
        if(this.options.primaryLink){
            items.forEach(function(item){
                item.defaultImage = 'public/img/' + this.options.type + '_default.png';
                item.type = this.options.type;
                item.primaryLink = parseLink(item, this.options.primaryLink);
                if(this.options.secondaryLink){
                    item.secondaryLink = parseLink(item, this.options.secondaryLink);
                }

                if(item.img === undefined || item.img.length ===0){
                    item.img = item.defaultImage;
                }
            }.bind(this));
        }
        options.items = items;
        this.element.innerHTML = template(options);
    }.bind(this));
}
function parseLink(item, linkData){
    var url = linkData.url;
    linkData.property.forEach(function(prop){
        url = url.replace('{#}', item[prop]);
    });
    return url;
}
ThumbnailList.prototype.html =
        //'<h1>Artists</h1>' +
    '<div class="list-container" class="row">' +
    '{{#each items}}' +
    '<div class="list-item {{type}}">' +
    '<div class="list-item-img-container"><a href="{{primaryLink}}">{{#if img}}<img src="{{img}}" width="200" onerror="this.src=\'{{defaultImage}}\'">{{/if}}</a></div>' +
    '<div class="list-item-link-container">' +
    '<div class="list-item-name list-item-primary-link"><a href="{{primaryLink}}">{{name}}</a></div>' +
    '{{#if secondaryLink}}' +
    '<div class="list-item-name list-item-secondary-link"><a href="{{secondaryLink}}">{{artist}}</a></div>' +
    '{{/if}}'+
    '</div>' +
    '</div>' +
    '{{/each}}' +
    '</div>';


ThumbnailList.prototype.getData = function (cb) {
    $.ajax({
        url: this.options.url,
        context: document.body
    }).done(cb);
};

ThumbnailList.prototype.destroy = function () {
    this.element.remove();
    delete this;
};

function parse(s) {
    var div = document.createElement('div');
    div.innerHTML = s;
    return div.firstChild;
}