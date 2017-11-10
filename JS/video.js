Video = function () {
    let that = this;

    this.specialArray = [2, 5, 6, 10];

    this.bufferTime = 1;

    this.player = document.getElementById('VideoPlayer');

    this.time = new Array(2);
    this.time[0] = 0;
    this.time[1] = this.player.duration;
    this.pause = 0;

    this.minEvent();
    this.repeatEvent();
    // this.moveEvent();
    // this.dblclickEvent();

    this.player.addEventListener("timeupdate", function() {
        if(that.pause === 0) return;
        let t = parseInt(that.player.currentTime);
        if(t === parseInt(that.time[1])) {
            that.player.pause();
            that.pause = 0;
        }
    });
};

Video.prototype.inSpecialArray = function (element) {
    for(let e of this.specialArray){
        if(e === element)
            return true
    }
    return false
}

Video.prototype.setVideo = function (path) {
    if(document.getElementById("VideoPlayer").hasAttribute("src"))
        document.getElementById("VideoPlayer").setAttribute("src",path);
    else document.getElementById("VideoPlayer").src = path;
};

Video.prototype.setBufferTime = function (sec) {
    this.bufferTime = +sec;
};

Video.prototype.playPart = function (time0, time1) {
    this.time[0] = time0.min * 60 + (+time0.sec) - this.bufferTime;
    this.time[1] = time1.min * 60 + (+time1.sec) + this.bufferTime;

    console.log(this.time[0],this.time[1]);

    let div = $("#video_player");
    let temp = $('.panel_video_min');
    let video_body = $('#collapse_video');
    if(temp.hasClass("glyphicon-plus")) {
        temp.removeClass("glyphicon-plus");
        temp.addClass("glyphicon-minus");
        div.animate({"top":"10%", "left":"10%", "width":"80%"});
    }
    if(!video_body.hasClass("in")) video_body.addClass("in");

    this.pause = 1;
    this.player.currentTime = parseInt(this.time[0]).toString();
    this.player.play();
};

Video.prototype.minEvent = function() {
    let div = $("#video_player");
    let temp = $('.panel_video_min');
    let video_body = $('#collapse_video');
    temp.click(()=>{
        if(temp.hasClass("glyphicon-minus")) {
            temp.removeClass("glyphicon-minus");
            temp.addClass("glyphicon-plus");
            this.player.pause();
            div.animate({"top":"81.5%", "left":"65%", "width":"20%"});
        }
        else {
            temp.removeClass("glyphicon-plus");
            temp.addClass("glyphicon-minus");
            this.player.play();
            div.animate({"top":"10%", "left":"10%", "width":"80%"});
        }

        if(video_body.hasClass("in")) video_body.removeClass("in");
        else video_body.addClass("in");
    })
};
Video.prototype.repeatEvent = function() {
    let that = this;
    let temp = $('.panel_video_repeat');
    temp.click(function () {
        that.pause = 1;
        that.player.currentTime = parseInt(that.time[0]).toString();
        that.player.play();
    })
};
Video.prototype.moveEvent = function() {
    $(document).ready(function(){
        let $head = $("div.panel_video_head");
        let $all = $("div#video_player");
        /* 绑定鼠标左键按住事件 */
        $head.bind("mousedown",function(event){
            /* 获取需要拖动节点的坐标 */
            let offset_x = $all[0].offsetLeft;//x坐标
            let offset_y = $all[0].offsetTop;//y坐标
            console.log(offset_x,offset_y);
            /* 获取当前鼠标的坐标 */
            let mouse_x = event.pageX;
            let mouse_y = event.pageY;
            /* 绑定拖动事件 */
            /* 由于拖动时，可能鼠标会移出元素，所以应该使用全局（document）元素 */
            $(document).bind("mousemove",function(ev){
                /* 计算鼠标移动了的位置 */
                let _x = ev.pageX - mouse_x;
                let _y = ev.pageY - mouse_y;
                /* 设置移动后的元素坐标 */
                let now_x = (offset_x + _x ) + "px";
                let now_y = (offset_y + _y ) + "px";
                /* 改变目标元素的位置 */
                $all.css({
                    top:now_y,
                    left:now_x
                });
            });
        });
        /* 当鼠标左键松开，接触事件绑定 */
        $(document).bind("mouseup",function(){
            $(this).unbind("mousemove");
        });
    })
};
Video.prototype.dblclickEvent = function() {
    $(document).ready(function(){
        let $head = $("div.panel_video_head");
        let $all = $("div#video_player");
        /* 绑定鼠标左键按住事件 */
        $head.bind("mousedown",function(event){
            /* 获取需要拖动节点的坐标 */
            let offset_x = $all[0].offsetLeft;//x坐标
            let offset_y = $all[0].offsetTop;//y坐标
            console.log(offset_x,offset_y);
            /* 获取当前鼠标的坐标 */
            let mouse_x = event.pageX;
            let mouse_y = event.pageY;
            /* 绑定拖动事件 */
            /* 由于拖动时，可能鼠标会移出元素，所以应该使用全局（document）元素 */
            $(document).bind("mousemove",function(ev){
                /* 计算鼠标移动了的位置 */
                let _x = ev.pageX - mouse_x;
                let _y = ev.pageY - mouse_y;
                /* 设置移动后的元素坐标 */
                let now_x = (offset_x + _x ) + "px";
                let now_y = (offset_y + _y ) + "px";
                /* 改变目标元素的位置 */
                $all.css({
                    top:now_y,
                    left:now_x
                });
            });
        });
        /* 当鼠标左键松开，接触事件绑定 */
        $(document).bind("mouseup",function(){
            $(this).unbind("mousemove");
        });
    })
};