function Party(options) {
    this.options = options;
    var template = Handlebars.compile(this.html);
    console.log(options);

    this.element = parse(template(options));
    //this.options.parentElement.appendChild(this.element);

}
Party.prototype.html =
    '<div id="party">' +
        '<div class="col-lg-12"> ' +
            '<h1>Join the party</h1> ' +
            '<div style="background-color:white; width:200px; text-align: center; margin-left:auto; margin-right:auto;"> ' +
                '<img id="qr" src="{{url}}/qr" height="200" width="200" /> ' +
            '</div> ' +
        '<p>{{url}}</p>' +
        '</div>'+
    '</div>';


Party.prototype.destroy = function () {
    this.element.remove();
    delete this;
};