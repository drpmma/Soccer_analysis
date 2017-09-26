filesManager = function() {
    let that = this;

    d3.json("data/filesManager/files.json", function(error, fileList) {
        if(error) throw error;
        else {
            that.fileList = fileList;
            that.fileNum = fileList.length;
            sideSetting = new sideSettingBar();
            data_select = new dataselect();
        }
    });
};

filesManager.prototype.getFilePath = function (k) {
    return this.fileList[k].path + this.fileList[k].name + ".json";
};

filesManager.prototype.getFileName = function (k) {
    return this.fileList[k].info;
};

filesManager.prototype.loadFile = function() {
    const {dialog} = nodeRequire('electron').remote;
    const fileArray = dialog.showOpenDialog();
    const file = fileArray[0];

    let type = file.substring(file.lastIndexOf('.')+1);
    if(type !== "json") throwInfo(ERR_WRONGFILETYPE_JSON);

    this.refreshFiles();
};

filesManager.prototype.refreshFiles = function() {
    var path = nodeRequire('path');
    var _path = path.join(__dirname, '\\data\\filesManager\\files.json');

    var fs = nodeRequire('fs');
    fs.writeFile(_path, JSON.stringify(this.fileList), function (err) {
        if (!err) console.log("写入成功！");
        else console.error(err);
    })
};