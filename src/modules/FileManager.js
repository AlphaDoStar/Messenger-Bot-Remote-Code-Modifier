'use strict';
module.exports = (function () {
    /**
     * @constructor
     * @author AlphaDo
     * @classdesc Manage files to save.
     * @param {String} path File path to save
     * @param {Boolean} isJson Whether or not to string when storing
     * @param {Boolean} createNewFile Whether to create a file if it does not exist in the specified path
     * @example new FileManager('Bot/Test.txt', true, true)
     */
    function FileManager(path, isJson, createNewFile) {
        this.path = path;
        this._isJson = isJson || false;
        this.value = isJson ? new Object() : '';
        this.load(createNewFile);
    }

    /**
     * Specifies that the file is converted to a string when it is saved.
     * 
     * @example new FileManager('Bot/Test.txt').setJson()
     */
    FileManager.prototype.setJson = function () {
        this._isJson = true;
    };

    /**
     * Specifies that the file is not converted to a string when it is saved.
     * 
     * @example new FileManager('Bot/Test.txt', true).releaseJson()
     */
    FileManager.prototype.releaseJson = function () {
        this._isJson = false;
    };

    /**
     * Returns whether the file is converted to a string when it is saved.
     * 
     * @return Whether or not to string when storing
     * @example new FileManager('Bot/Test.txt', true).isJson()
     */
    FileManager.prototype.isJson = function () {
        return this._isJson;
    };

    /**
     * Checks whether a file exists in the specified path.
     * 
     * @return Whether the file exists within the specified path
     * @example new FileManager('Bot/Test.txt').exists()
     */
    FileManager.prototype.exists = function () {
        const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();

        return new java.io.File(sdcard + '/' + this.path).exists();
    };

    /**
     * Stores the assigned values.
     * 
     * @example new FileManager('Bot/Test.txt', true).save()
     */
    FileManager.prototype.save = function () {
        const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();

        let a = new java.io.File(sdcard + '/' + this.path);

        if (!a.exists()) {
            a.getParentFile().mkdirs();
            a.createNewFile();
        }

        let b = new java.io.FileOutputStream(a),
            c = new java.lang.String(this._isJson ? JSON.stringify(this.value) : this.value);

        b.write(c.getBytes());
        b.close();
    };

    /**
     * Allocate stored values.
     * 
     * @param {Boolean} createNewFile Whether to create a file if it does not exist in the specified path
     * @example new FileManager('Bot/Test.txt', true, true).load()
     */
    FileManager.prototype.load = function (createNewFile) {
        const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();

        let a = new java.io.File(sdcard + '/' + this.path);

        if (!a.exists()) {
            if (!createNewFile) return false;

            this.save();
        }

        let b = new java.io.FileInputStream(a),
            c = new java.io.InputStreamReader(b),
            d = new java.io.BufferedReader(c),
            e = d.readLine(),
            f = '';

        while ((f = d.readLine()) !== null) e += ('\n' + f);

        b.close();
        c.close();
        d.close();
        
        return (this.value = (this._isJson ? JSON.parse(e) : e));
    };

    /**
     * Remove the stored value.
     * 
     * @return Whether to delete files
     * @example new FileManager('Bot/Test.txt', true).delete()
     */
    FileManager.prototype.delete = function () {
        const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();

        let file = new java.io.File(sdcard + '/' + this.path);

        if (!file.exists()) {
            throw new Error('The file on that path does not already exist.');
        }

        return file.delete();
    };

    /**
     * Allocate a value.
     * 
     * @param {any} value value to be allocated
     * @return assigned value
     * @example new FileManager('Bot/Test.txt', false).write('Hello, World!')
     */
    FileManager.prototype.write = function (value) {
        return (this.value = value);
    };

    /**
     * Empty the assigned value.
     * 
     * @return The value newly assigned after emptying
     * @example new FileManager('Bot/Test.txt', true).empty()
     */
    FileManager.prototype.empty = function () {
        return (this.value = this._isJson ? new Object() : '');
    };

    /**
     * Read the assigned values.
     * 
     * @return assigned value
     * @example new FileManager('Bot/Test.txt', true).read()
     */
    FileManager.prototype.read = function () {
        return this.value;
    };

    return FileManager;
})();