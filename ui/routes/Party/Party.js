define(['jquery', 'handlebars', 'text!./template.html'], function ($, Handlebars, html) {
    function Party(options) {
        this.options = options;
        var template = Handlebars.compile(this.html);

        this.element = parse(template(options));
        //this.options.parentElement.appendChild(this.element);

    }

    Party.prototype.html =html;


    Party.prototype.destroy = function () {
        this.element.remove();
        delete this;
    };

    return Party;

});