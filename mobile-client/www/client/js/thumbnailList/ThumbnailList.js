define(['jquery', 'handlebars', 'text!./thumbnailList.html'], function($, Handlebars, html){

    function ThumbnailList(options) {
        this.options = options;
        this.template = Handlebars.compile(html);

        this.element = parse('<div id="'+this.options.id+'" class="list-container" class="row"></div>');
        this.currentIndex = 0;


        $(this.element).scroll(function(e){
            if (this.element.offsetHeight + this.element.scrollTop >= this.element.scrollHeight) {
                this.loadItems(this.currentIndex);
            }
        }.bind(this));

        this.loadItems(0);
    }
    function parseLink(item, linkData){
        var url = linkData.url;
        linkData.property.forEach(function(prop){
            url = url.replace('{#}', item[prop]);
        });
        return url;
    }

    ThumbnailList.prototype.loadItems = function (index) {
        this.options.getData(index, this.options.perPage || 20, function (items) {
            if(this.options.primaryLink){
                items.forEach(function(item){
                    item.defaultImage = this.options.defaultImage;
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

            items.forEach(function(item){
                var element = this.addItem(item);
                this.getInfo(item, element);
            }.bind(this));


            this.currentIndex += items.length;
        }.bind(this));
    };

    ThumbnailList.prototype.getInfo = function(item, element){
        this.options.getInfo(item,
            function(data){
                if(data.imgUrl){
                    var img = element.querySelector('#item-img');

                    img.src = data.imgUrl;
                }

            });
    };

    ThumbnailList.prototype.addItem = function (item) {
        var html = this.template(item);
        var element = $.parseHTML(html)[0];
        this.element.appendChild(element);
        return element;
    };



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

    return ThumbnailList;
});
