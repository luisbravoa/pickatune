define(['jquery','text!./modal.html',  'handlebars', 'bootstrap'], function($, html, Handlebars){
    function Modal(options){

        options.title = options.title || 'Cannot find server';
        options.content = 'Cannot find server, please make your that Pickatune is running on your computer.';
        this.$element = $('#modal');

        this.template = Handlebars.compile(html);
        $(document.body).append(this.template(options));
        //debugger;
        this.$element = $('#modal');
        this.$element.modal({backdrop: 'static'});

        this.$element.find('#modal-retry').click(function(){
            this.close();
            if(options.onAction){
                options.onAction();
            }

        }.bind(this));

    }

    Modal.prototype.close = function(){
        this.$element.modal('hide');
    };

    Modal.prototype.show = function(){
        this.$element.modal('show');
    };

    return Modal;
});