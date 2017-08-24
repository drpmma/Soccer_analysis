Helps = function() {
    this.test();
};
Helps.prototype.test = function() {
    var params = {
        div:d3.select("#settingBar"),
        x:100,
        y:100,
        id:"test",
        title:"test",
        place:"bottom",
        content:function(){
            return "abc";
        }
    };
    var h = new Help(params);
};

Help = function(params) {
    var div = params.div,
        x = params.x,
        y = params.y,
        id = params.id,
        title = params.title,
        place = params.place,
        content = params.content;
    var d = div.append("div")
        .style("position","absolute")
        .style("z-index","999")
        .style("top",y+"px")
        .style("left",x+"px")
        .style("width","2%")
        .style("height","2%");
    var b = d.append("button")
        .attr("id",id)
        .attr("type","button")
        .attr("class","glyphicon glyphicon-question-sign circle-btn")
        .attr("title",title);

    $("#"+id).popover({
                trigger:'manual',//manual 触发方式
                placement : place,
                html: 'true',
                content : content(),  //这里可以直接写字符串，也可以 是一个函数，该函数返回一个字符串；
                animation: false
            }) .on("mouseenter", function () {
                var _this = this;
                $(this).popover("show");
                $(this).siblings(".popover").on("mouseleave", function () {
                    $(_this).popover('hide');
                });
            }).on("mouseleave", function () {
                var _this = this;
                setTimeout(function () {
                    if (!$(".popover:hover").length) {
                        $(_this).popover("hide")
                    }
                }, 200);
            });
};