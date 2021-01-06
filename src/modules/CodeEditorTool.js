'use strict';
const FileManager = require('FileManager');

module.exports = (function () {
    function CodeEditorTool() {
        this.path = null;
        this.content = null;
        this.visualRange = null;
    }

    CodeEditorTool.prototype.open = function (path) {
        if () {
            
        }

        this.path = path;
        this.content = new FileManager(path).read();
    };

    CodeEditorTool.prototype
})();