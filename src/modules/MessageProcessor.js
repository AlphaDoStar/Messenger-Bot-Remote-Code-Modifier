'use strict';
module.exports = (function () {
    const MessageProcessor = function () {
        this.prefix = '/';
        this.separator = ' ';
        this.analyzedData = null;
    };

    MessageProcessor.prototype.setPrefix = function (prefix) {
        this.prefix = prefix;
    };

    MessageProcessor.prototype.setSeparator = function (separator) {
        this.separator = separator;
    };

    MessageProcessor.prototype.build = function (msg) {
        const AnalyzedData = function (msg, command, datas) {
            this.msg = msg;
            this.command = command;
            this.datas = datas;
        };

        let data = (msg = (msg.startsWith(this.prefix) ? msg.replace(this.prefix, '') : '')).split(this.separator),
            command = data[0],
            datas = data.slice(1);

        this.analyzedData = new AnalyzedData(msg, command, datas);
    };

    MessageProcessor.prototype.getMsg = function () {
        return this.analyzedData.msg;
    };

    MessageProcessor.prototype.isMsg = function (msg) {
        return (this.getMsg() === msg);
    };

    MessageProcessor.prototype.getCmd = function () {
        return this.analyzedData.command;
    };

    MessageProcessor.prototype.isCmd = function (command) {
        return (this.getCmd() === command);
    };

    MessageProcessor.prototype.getArg = function (index) {
        return this.analyzedData.datas[index];
    };

    MessageProcessor.prototype.isArg = function (index, value) {
        return (this.getArg(index) === value);
    };

    MessageProcessor.prototype.getArgs = function (start, end) {
        return this.analyzedData.datas.slice(start, end);
    };

    MessageProcessor.prototype.getData = function () {
        return this.analyzedData.datas.join(this.separator);
    };

    return MessageProcessor;
})();