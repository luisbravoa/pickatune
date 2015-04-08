var DOMUtils = {
    parse: function (s) {
        var div = document.createElement('div');
        div.innerHTML = s;
        return div.firstChild;
    },
    parseTable: function (s) {
        var div = document.createElement('div');
        div.innerHTML = s;
        return div.firstChild;
    },
    addClass: function (element, className) {
        var currentClassName = element.className;
        if (currentClassName.indexOf(className) === -1) {
            element.className += ' ' + className;
        }
    },
    removeClass: function (element, className) {
        var currentClassName = element.className;
        if (currentClassName.indexOf(className) !== -1) {
            element.className = currentClassName.replace(className, '').trim();
        }
    }
};


function TableLite(options) {

    "use strict";

    this.options = options;
    this.rows = [];

    // create the element
    this.element = DOMUtils.parse('<table class="TableLite">' + '</table>');
    console.log(this.element);

    // add DashLite to the parent element
    
    this.renderHeader();
    
    this.options.parentElement.appendChild(this.element);
    
    this.options.data.forEach(function(row){
        this.renderRow(row);
    }.bind(this));

}

TableLite.prototype.renderHeader = function(header){
    var rowString = '<thead><tr class="TableLite-header">';
    this.options.columns.forEach(function(col){
        rowString += '<th>' + col.name + '</th>';
    }.bind(this));
    rowString += '</tr></thead>';
    $(this.element).append(rowString);
};


TableLite.prototype.renderRow = function(data){
    var rowString = '<tr>'
    this.options.columns.forEach(function(col){
        rowString += '<td>' + data[col.property] + '</td>';
    }.bind(this));
    rowString += '</tr>';
    $(this.element).append(rowString);

};

