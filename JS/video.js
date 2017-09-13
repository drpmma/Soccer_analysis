Video = function() {
    this.bufferTime = 5;

    let dialogId = 'video_player';
    this.dialog = new BootstrapDialog({
        id: dialogId,
        title: "实战视频",
        // message: "abc",
        draggable: true,
        dataBackdrop: false,
        closeByBackdrop: false,
        closeByKeyboard: false,
        buttons: [
            {
                label: '关闭',
                cssClass: 'btn-link',
                action: function () {

                }
            }
        ]
    });
    this.dialog.open();
};

Video.prototype.setVideo = function(path) {

};

Video.prototype.setBufferTime = function(sec) {
    this.bufferTime = +sec;
};

Video.prototype.playPart = function(time0, time1) {
    let time = new Array(2);
    time[0] = time0.min * 60 + (+time0.sec) - this.bufferTime;
    time[1] = time1.min * 60 + (+time1.sec) + this.bufferTime;
    console.log(time[0], time[1]);
};