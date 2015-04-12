var uiUtils = {
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