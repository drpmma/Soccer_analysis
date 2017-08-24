Helps = function() {
    this.clusterSettingHelp();
    this.showSettingHelp();
    this.sequenceSettingHelp();
    this.dataSettingHelp();
};
Helps.prototype.clusterSettingHelp = function() {
    var params = {
        div:d3.select("#clusterSetting"),
        top:20,
        bottom:undefined,
        left:undefined,
        right:20,
        id:"clusterSettingHelp",
        title:"聚团帮助",
        place:"top",
        content:function(){
            return  "<div style='width:260px;'>" +
                    "<ul>" +
                        "<li>聚团操作可以将短时间短距离内的运动聚合到一起</li>" +
                        "<li>聚团方式包含普通、全场、蜂巢、矩阵、文字云五种</li>" +
                        "<li>聚团布场包含推进布场、切入布场、螺旋布场</li>" +
                    "</ul>" +
                    "</div>";
        }
    };
    new Help(params);
};
Helps.prototype.showSettingHelp = function(){
    var params = {
        div:d3.select("#showSetting"),
        top:20,
        bottom:undefined,
        left:undefined,
        right:20,
        id:"showSettingHelp",
        title:"显示帮助",
        place:"left",
        content:function(){
            return  "<div style='width:260px;'>" +
                "<ul>" +
                "<li>飞点时间影响切换阶段的速度</li>" +
                "<li>球员样式可以选择普通的圆或球衣</li>" +
                "<li>您也可以切换中英文</li>" +
                "</ul>" +
                "</div>";
        }
    };
    new Help(params);
};
Helps.prototype.sequenceSettingHelp = function(){
    var params = {
        div:d3.select("#sequenceSetting"),
        top:20,
        bottom:undefined,
        left:undefined,
        right:20,
        id:"sequenceSettingHelp",
        title:"序列帮助",
        place:"right",
        content:function(){
            return  "<div style='width:260px;'>" +
                "<ul>" +
                "<li>这里可以改变阶段序列的样式</li>" +
                "<li>序列可以分为点图、点线图、标识、虫图等九种</li>" +
                "</ul>" +
                "</div>";
        }
    };
    new Help(params);
};
Helps.prototype.dataSettingHelp = function(){
    var params = {
        div:d3.select("#dataSetting"),
        top:20,
        bottom:undefined,
        left:undefined,
        right:20,
        id:"dataSettingHelp",
        title:"数据帮助",
        place:"bottom",
        content:function(){
            return  "<div style='width:260px;'>" +
                "<ul>" +
                "<li>这里您可以改变比赛数据</li>" +
                "<li>您可以在已有数据中挑选，也可以导入新的数据</li>" +
                "</ul>" +
                "</div>";
        }
    };
    new Help(params);
};

Help = function(params) {
    var div = params.div,
        top = params.top,
        bottom = params.bottom,
        left = params.left,
        right = params.right,
        id = params.id,
        title = params.title,
        place = params.place,
        content = params.content;
    div.attr("position","relative");
    var d = div.append("div")
        .style("position","absolute")
        .style("z-index","999")
        .style("top",top+"px")
        .style("bottom",bottom+"px")
        .style("left",left+"px")
        .style("right",right+"px")
        .style("width","16px")
        .style("height","16px")
        .style("padding-top",0);
    d.append("a")
        .attr("id",id)
        .attr("title",title)
        .append("img")
        .attr("src","./img/help.png");

    $("#"+id).popover({
                trigger:'manual',
                placement : place,
                html: 'true',
                content : content(),
                animation: true
            })
        .on("mouseenter", function () {
                var _this = this;
                $(this).popover("show");
                $(this).siblings(".popover").on("mouseleave", function () {
                    $(_this).popover('hide');
                });
            })
        .on("mouseleave", function () {
                var _this = this;
                setTimeout(function () {
                    if (!$(".popover:hover").length) {
                        $(_this).popover("hide")
                    }
                }, 200);
            });
};