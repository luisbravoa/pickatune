function Settings(options) {
    this.options = options;
    var template = Handlebars.compile(this.html);
    console.log(options);

    this.element = parse(template(options));
    //this.options.parentElement.appendChild(this.element);

    requestAnimationFrame(function(){

        $('#settings-save').click(function(e){
            var path = $('#musicFolder').val();
            if(path !== undefined && path !== ''){
                loader(true);

                global.eventBus.emit('config:musicFolder', path);
            }
        });
    }.bind(this));


}
Settings.prototype.html =
    '<div id="settings">' +
    '<div class="col-lg-12"> ' +
    '<h1>settings</h1> ' +
    '<p><input id="musicFolder" type="file" webkitdirectory /></p>' +
    '<p><button id="settings-save">Save</button></p>' +
    '</div>'+
    '</div>';


Settings.prototype.destroy = function () {
    this.element.remove();
    delete this;
};