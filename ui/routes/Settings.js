function Settings(options) {
    this.options = options;
    var template = Handlebars.compile(this.html);
    console.log(options);

    this.element = parse(template(options));

    requestAnimationFrame(function () {
        global.db.getConfig('musicFolder')
            .then(function (musicFolder) {
                if(musicFolder!== undefined){
                    console.log(musicFolder);
                    $('#musicFolder').attr('filename', musicFolder);
                }
            });
        $('#settings-save').click(function (e) {
            var path = $('#musicFolder').val();
            if (path !== undefined && path !== '') {

                global.eventBus.emit('config:musicFolder', path);
            }
        });
    }.bind(this));


}
Settings.prototype.html =
    '<div id="settings" class="form-group">' +
    '<div class="col-lg-12"> ' +
    '<h1>Settings</h1> ' +
    '<div class="form-group"> ' +
    '<label for="exampleInputFile">Music Folder</label>' +
    '<input type="file" id="musicFolder" webkitdirectory>' +
    '<p class="help-block">Choose the folder where your music is in.</p>' +
    '</div>' +
    '<p><button id="settings-save" class="btn btn-default">Save</button></p>' +
    '</div>' +
    '</div>';

Settings.prototype.destroy = function () {
    this.element.remove();
    delete this;
};