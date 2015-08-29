define(['jquery','text!./modal.html',  'handlebars', 'bootstrap'], function($, html, Handlebars){
    function Modal(options){

        this.$element = $('#modal');

        this.template = Handlebars.compile(html);
        $(document.body).append(this.template(options));
        //debugger;
        $('#modal').i18n();
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