Helps = function() {
    this.helpList = new Array();
    this.helpNum = 0;
    this.currentHelp = 0;
    this.show = 5;

    this.clusterSettingHelp();
    this.showSettingHelp();
    this.sequenceSettingHelp();
    this.dataSettingHelp();
    this.universalHelp();

    this.createElements();
};
Helps.prototype.createElements = function() {
    let elements = '';
    elements += '<div id="help_container">';
    elements += '   <div id="help_titleDiv">';
    elements += '       <div id="help_upTriangle" class="help_triangle_normal"></div>';
    elements += '       <div id="help_titleList"></div>';
    elements += '       <div id="help_downTriangle" class="help_triangle_normal"></div>';
    elements += '   </div>';
    elements += '   <div id="help_pointerTriangle">';
    elements += '      <div id="help_pointerTriangle_after"></div>';
    elements += '      <div id="help_pointerTriangle_before"></div>';
    elements += '   </div>';
    elements += '   <div id="help_contentDiv">';
    elements += '      <div id="help_contentShow"></div>';
    elements += '   </div>';
    elements += '</div>';
    $('#help_content')[0].innerHTML = elements;

    let temp0 = $('#help_upTriangle');
    temp0.mousedown(()=>{
            if(temp0.attr("class") === "help_triangle_disabled") return;
            temp0.attr("class","help_triangle_press");
        })
        .mouseup(()=>{
            if(temp0.attr("class") === "help_triangle_disabled") return;
            temp0.attr("class","help_triangle_over");
            this.previousHelp();
        })
        .mouseover(()=>{
            if(temp0.attr("class") === "help_triangle_disabled") return;
            temp0.attr("class","help_triangle_over");
        })
        .mouseleave(()=>{
            if(temp0.attr("class") === "help_triangle_disabled") return;
            temp0.attr("class","help_triangle_normal");
        });

    let temp1 = $('#help_downTriangle');
    temp1.mousedown(()=>{
        if(temp1.attr("class") === "help_triangle_disabled") return;
        temp1.attr("class","help_triangle_press");
    })
        .mouseup(()=>{
            if(temp1.attr("class") === "help_triangle_disabled") return;
            temp1.attr("class","help_triangle_over");
            this.nextHelp();
        })
        .mouseover(()=>{
            if(temp1.attr("class") === "help_triangle_disabled") return;
            temp1.attr("class","help_triangle_over");
        })
        .mouseleave(()=>{
            if(temp1.attr("class") === "help_triangle_disabled") return;
            temp1.attr("class","help_triangle_normal");
        });

    console.log(this.helpNum);
    if(this.helpNum !== 0)
    {
        this.currentHelp = 1;

        for(let i = 1; i <= this.helpNum; i++)
            $('#help_titleList')[0].innerHTML += '<div id="help_title'+i+'" class="help_title">'+this.helpList[i].title+'</div>';

        this.checkButton();
        this.refreshList();
        this.refreshContent();
    }
};
Helps.prototype.previousHelp = function() {
    this.currentHelp--;
    this.checkButton();
    this.refreshList();
    this.refreshContent();
};
Helps.prototype.nextHelp = function() {
    this.currentHelp++;
    this.checkButton();
    this.refreshList();
    this.refreshContent();
};
Helps.prototype.checkButton = function() {
    if(this.currentHelp === 1 || this.currentHelp === 0) $('#help_upTriangle').attr("class","help_triangle_disabled");
    else $('#help_upTriangle').attr("class","help_triangle_normal");
    if(this.currentHelp === this.helpNum || this.currentHelp === 0) $('#help_downTriangle').attr("class","help_triangle_disabled");
    else $('#help_downTriangle').attr("class","help_triangle_normal");
};
Helps.prototype.refreshList = function() {
    for(let i = 1; i <= this.helpNum; i++) {
        let dif = i - this.currentHelp;

        let pos;
        let height;
        let opacity;
        let title_size;
        let duration = 700;
        let easing = "swing";

        switch(dif) {
            case -2:
                pos = 0;
                height = 40;
                opacity = '0.3';
                title_size = '14px';
                break;
            case -1:
                pos = 40;
                height = 40;
                opacity = '0.6';
                title_size = '18px';
                break;
            case 0:
                pos = 80;
                height = 52;
                opacity = '0.9';
                title_size = '21px';
                break;
            case 1:
                pos = 132;
                height = 40;
                opacity = '0.6';
                title_size = '18px';
                break;
            case 2:
                pos = 172;
                height = 40;
                opacity = '0.3';
                title_size = '14px';
                break;
            default:
                if(dif < -2) {
                    pos = -40;
                    height = 40;
                    opacity = '0';
                    title_size = '14px';
                }
                else {
                    pos = 212;
                    height = 40;
                    opacity = '0';
                    title_size = '14px';
                }
        }

        $('#help_title'+i)
            .stop()
            .animate({
                opacity: opacity,
                top: pos,
                fontSie: '=' + title_size,
                height: height,
                lineHeight: height,
            },duration,easing);
    }
};
Helps.prototype.refreshContent = function() {
    let that = this;
    let duration = 300;
    let easing = 'swing';

    hide();

    function show() {
        $('#help_contentShow')
            .stop()
            .animate({
                opacity: 1
            },duration,easing);
    }
    function hide() {
        $('#help_contentShow')
            .stop()
            .animate({
                opacity: 0
            },duration,easing, function(){
                $('#help_contentShow')[0].innerHTML = that.helpList[that.currentHelp].inner;
                $().ready(show());
            });
    }
};

Helps.prototype.clusterSettingHelp = function() {
    let params = {
        title:"聚团帮助",
        inner:  "<div>" +
                    "<ul>" +
                        "<li>聚团操作可以将短时间短距离内的运动聚合到一起，包括一般聚团、角球禁区聚团和射门聚团</li>" +
                        "<li>一般聚团样式包含普通、全场、蜂巢、矩阵、文字云五种，可供切换</li>" +
                        "<li>聚团布场包含推进布场、切入布场、螺旋布场</li>" +
                    "</ul>" +
                "</div>"
    };
    this.helpList[++this.helpNum] = new Help(params);
};
Helps.prototype.showSettingHelp = function(){
    let params = {
        title:"显示帮助",
        inner:  "<div>" +
                    "<ul>" +
                        "<li>飞点时间影响切换阶段的速度</li>" +
                        "<li>球员样式可以选择普通的圆或球衣</li>" +
                        "<li>您也可以切换中英文</li>" +
                    "</ul>" +
                "</div>"
    };
    this.helpList[++this.helpNum] = new Help(params);
};
Helps.prototype.sequenceSettingHelp = function(){
    let params = {
        title:"序列帮助",
        inner:  "<div>" +
                    "<ul>" +
                        "<li>这里可以改变阶段序列的样式</li>" +
                        "<li>序列可以分为点图、点线图、标识、虫图等九种</li>" +
                    "</ul>" +
                "</div>"
    };
    this.helpList[++this.helpNum] = new Help(params);
};
Helps.prototype.dataSettingHelp = function(){
    let params = {
        title:"数据帮助",
        inner:  "<div>" +
                    "<ul>" +
                        "<li>这里您可以改变比赛数据</li>" +
                        "<li>您可以在已有数据中挑选，也可以导入新的数据</li>" +
                    "</ul>" +
                "</div>"
    };
    this.helpList[++this.helpNum] = new Help(params);
};
Helps.prototype.universalHelp = function(){
    let params = {
        title:"全局帮助",
        inner:  "<div>" +
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
                "</div>"
    };
    this.helpList[++this.helpNum] = new Help(params);
};

Help = function(params) {
    this.title = params.title;
    this.inner = params.inner;
};