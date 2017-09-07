Helps = function() {
    this.clusterSettingHelp();
    this.showSettingHelp();
    this.sequenceSettingHelp();
    this.dataSettingHelp();
    this.universalHelp();
};
Helps.prototype.clusterSettingHelp = function() {
    let params = {
        div:d3.select("#clusterSetting"),
        top:20,
        bottom:undefined,
        left:undefined,
        right:30,
        id:"clusterSettingHelp",
        title:"聚团帮助",
        place:"bottom",
        content:function(){
            return  "<div style='width:260px;'>" +
                    "<ul>" +
                        "<li>聚团操作可以将短时间短距离内的运动聚合到一起，包括一般聚团、角球禁区聚团和射门聚团</li>" +
                        "<li>一般聚团样式包含普通、全场、蜂巢、矩阵、文字云五种，可供切换</li>" +
                        "<li>聚团布场包含推进布场、切入布场、螺旋布场</li>" +
                    "</ul>" +
                    "</div>";
        }
    };
    new Help(params);
};
Helps.prototype.showSettingHelp = function(){
    let params = {
        div:d3.select("#showSetting"),
        top:20,
        bottom:undefined,
        left:undefined,
        right:20,
        id:"showSettingHelp",
        title:"显示帮助",
        place:"top",
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
    let params = {
        div:d3.select("#sequenceSetting"),
        top:20,
        bottom:undefined,
        left:undefined,
        right:20,
        id:"sequenceSettingHelp",
        title:"序列帮助",
        place:"top",
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
    let params = {
        div:d3.select("#dataSetting"),
        top:20,
        bottom:undefined,
        left:undefined,
        right:20,
        id:"dataSettingHelp",
        title:"数据帮助",
        place:"top",
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
Helps.prototype.universalHelp = function(){
    let params = {
        div:d3.select("#svg_div"),
        top:5,
        bottom:undefined,
        left:undefined,
        right:5,
        id:"universalHelp",
        title:"全局帮助",
        place:"bottom",
        content:function(){
            return  "<div style='width:260px;'>" +
                "<ul>" +
                    "<li>可以点击左上角的“足球可视化系统”查看详细系统介绍（开发中）</li>" +
                    "<li>点击队伍名可以切换队伍视角（开发中）</li>" +
                    "<li>点击设置可以展开/收起控制台</li>" +
                    "<li>将鼠标放至<a><img src='../img/help.png'></a>上可以查看提示</li>" +
                    "<br>" +
                    "<li>左方是球员信息区，主要展示球员的位置、比赛数据信息</li>" +
                    "<li>中间为主展示区，用于放大分析某个阶段的战况</li>" +
                    "<li>右方为阶段列表，将比赛分为一个个阶段，用各种视图去展示</li>" +
                    "<br>" +
                    "<li>特殊颜色说明：<br>" +
                        "<div style='position:relative;top:5px;width:15px;height:10px;background:red;stroke:none;border-radius:3px;float:left'></div>" +
                        "<p style='margin-bottom:0'>　射偏</p>" +
                        "<div style='position:relative;top:5px;width:15px;height:10px;background:pink;stroke:none;border-radius:3px;float:left'></div>" +
                        "<p style='margin-bottom:0'>　射中门框/角球</p>" +
                        "<div style='position:relative;top:5px;width:15px;height:10px;background:blue;stroke:none;border-radius:3px;float:left'></div>" +
                        "<p style='margin-bottom:0'>　射门被扑救</p>" +
                        "<div style='position:relative;top:5px;width:15px;height:10px;background:green;stroke:none;border-radius:3px;float:left'></div>" +
                        "<p style='margin-bottom:0'>　成功射门</p>" +
                        "<div style='position:relative;top:5px;width:15px;height:10px;background:orange;stroke:none;border-radius:3px;float:left'></div>" +
                        "<p style='margin-bottom:0'>　遗失射门机会</p>" +
                    "</li>" +
                "</ul>" +
                "</div>";
        }
    };
    new Help(params);
};


Help = function(params) {
    let div = params.div,
        top = params.top,
        bottom = params.bottom,
        left = params.left,
        right = params.right,
        id = params.id,
        title = params.title,
        place = params.place,
        content = params.content;
    div.attr("position","relative");
    let d = div.append("div")
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
                let _this = this;
                $(this).popover("show");
                $(this).siblings(".popover").on("mouseleave", function () {
                    $(_this).popover('hide');
                });
            })
        .on("mouseleave", function () {
                let _this = this;
                setTimeout(function () {
                    if (!$(".popover:hover").length) {
                        $(_this).popover("hide")
                    }
                }, 200);
            });
};