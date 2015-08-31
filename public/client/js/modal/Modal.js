define(['jquery','text!./modal.html',  'handlebars', 'bootstrap'], function($, html, Handlebars){
    function Modal(options){

        this.$element = $('#modal');

        this.template = Handlebars.compile(html);
        $(document.body).append(this.template(options));
        //$('#modal').i18n();
        this.$element = $('#modal');
        this.modal = $('#modal').modal({
            backdrop: 'static',
            show: false
        });

        if(options.primary){
            this.$element.find('#modal-primary').click(function(){
                this.close();
                if(options.primary.action){
                    options.primary.action();
                }
            }.bind(this));
        }


    }

    Modal.prototype.close = function(){
        //debugger;
        this.modal.modal('hide');
    };

    Modal.prototype.show = function(){
        //debugger;
        this.modal.modal('show');
    };

    return Modal;
});