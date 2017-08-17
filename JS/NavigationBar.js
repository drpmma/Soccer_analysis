sideSettingBar = function() {
    this.soh = 1;
    this.Bar = d3.select("body").insert("div", "#svg_div")
        .attr("id", "settingBar")
        .attr("class", "navbar navbar-inverse navbar-fixed-bottom collapse")
        .attr("style", "margin-bottom:0")
        .append("div")
        .attr("class", "container-fluid")
        .append("div")
        .attr("class", "row box");

    this.CreateOptions();
    this.CreateElements();
};

sideSettingBar.prototype.CreateOptions = function() {
    var i;
    this.clusterTimeOptions = new Array();
    for(i = 0; i < 20; i++) this.clusterTimeOptions[i] = i*100;

    this.clusterStyleOptions = new Array();
    this.clusterStyleOptions[0] = "普通";
    this.clusterStyleOptions[1] = "全场";
    this.clusterStyleOptions[2] = "蜂巢";
    this.clusterStyleOptions[3] = "矩阵";
    this.clusterStyleOptions[4] = "文字云";

    this.nodeTimeOptions = new Array();
    for(i = 0; i < 20; i++) this.nodeTimeOptions[i] = i*100;

    this.playerStyleOptions = new Array();
    this.playerStyleOptions[0] = "圆";
    this.playerStyleOptions[1] = "球衣";

    this.EnCnOptions = new Array();
    this.EnCnOptions[0] = "中文";
    this.EnCnOptions[1] = "英文";

    this.sequenceTimeOptions = new Array();
    for(i = 0; i < 20; i++) this.sequenceTimeOptions[i] = i*100;

    this.sequenceStyleOptions = new Array();
    this.sequenceStyleOptions[0] = "点图";
    this.sequenceStyleOptions[1] = "点线图";
    this.sequenceStyleOptions[2] = "标识";
    this.sequenceStyleOptions[3] = "虫图";
    this.sequenceStyleOptions[4] = "横坐标";
    this.sequenceStyleOptions[5] = "纵坐标";
    this.sequenceStyleOptions[6] = "时间对齐";
    this.sequenceStyleOptions[7] = "距离对齐";
    this.sequenceStyleOptions[8] = "饼图";

    this.dataList = new Array();
    this.dataList[0] = "数据1";
    this.dataList[1] = "数据2";
    this.dataList[2] = "数据3";
    this.dataList[3] = "数据4";
    this.dataList[4] = "数据5";
    this.dataList[5] = "数据6";
};

sideSettingBar.prototype.CreateElements = function() {
    this.clusterSetting = this.Bar.append("div")
        .attr("class", "col-md-3")
        .append("div")
        .attr("id", "clusterSetting")
        .attr("class", "bs-callout bs-callout-cluster");
    this.AddTitle("聚团设置",this.clusterSetting);
    this.AddSelection("聚团时间",this.clusterTimeOptions,"default",this.clusterSetting);
    this.AddSelection("聚团方式",this.clusterStyleOptions,"default",this.clusterSetting);
    var temp = this.AddButtonToolBar(this.clusterSetting);
    this.AddButton("聚团","default",this.AddButtonGroup(temp));
    this.AddButton("改变样式","default",this.AddButtonGroup(temp));
    this.AddButton("取消聚团","default",this.AddButtonGroup(temp));

    this.showSetting = this.Bar.append("div")
        .attr("class", "col-md-3")
        .append("div")
        .attr("id", "showSetting")
        .attr("class", "bs-callout bs-callout-show");
    this.AddTitle("显示设置",this.showSetting);
    this.AddSelection("飞点时间",this.nodeTimeOptions,"default",this.showSetting);
    this.AddSelection("球员样式",this.playerStyleOptions,"default",this.showSetting);
    this.AddSelection("中英文选择",this.EnCnOptions,"default",this.showSetting)

    this.sequenceSetting = this.Bar.append("div")
        .attr("class", "col-md-3")
        .append("div")
        .attr("id", "sequenceSetting")
        .attr("class", "bs-callout bs-callout-sequence");
    this.AddTitle("序列设置",this.sequenceSetting);
    this.AddSelection("变换时间",this.sequenceTimeOptions,"default",this.sequenceSetting);
    this.AddSelection("序列样式",this.sequenceStyleOptions,"default",this.sequenceSetting);
    temp = this.AddButtonToolBar(this.sequenceSetting);
    this.AddButton("变换序列样式","default",this.AddButtonGroup(temp));

    this.dataSetting = this.Bar.append("div")
        .attr("class", "col-md-3")
        .append("div")
        .attr("id", "dataSetting")
        .attr("class", "bs-callout bs-callout-data");
    this.AddTitle("数据设置",this.dataSetting);
    this.AddSelection("数据选择",this.dataList,"default",this.dataSetting);
    temp = this.AddButtonToolBar(this.dataSetting);
    this.AddButton("更换数据","default",this.AddButtonGroup(temp));
    this.AddButton("导入数据","default",this.AddButtonGroup(temp));
};

sideSettingBar.prototype.AddTitle = function(t,g) {
    g.append("h5").text(t);
};

sideSettingBar.prototype.AddSelection = function(t,l,c,g) {
    console.log(t,l,c,g);
    var sel = g.append("p").text(t+"　：　");
    var but = sel.append("div")
        .attr("class","btn-group dropup");
    but.append("button")
        .attr("type","button")
        .attr("class","btn btn-"+c)
        .text(t);
    but.append("button")
        .attr("type","button")
        .attr("class","btn btn-"+c+"dropdown-toggle")
        .attr("data-toggle","dropdown")
        .attr("aria-haspopup","true")
        .attr("aria-expanded",false)
        .append("span")
        .attr("class","caret");
    var li = but.append("ul")
        .attr("class","dropdown-menu");
    for(var i = 0; i < l.length; i++)
        li.append("li")
            .append("a")
            .attr("href","#")
            .text(l[i]);
};

sideSettingBar.prototype.AddButton = function(t,c,g) {
    g.append("button")
        .attr("type","button")
        .attr("class","btn btn-"+c)//default primary success info warning danger link
        .text(t);

// <div class="btn-group" role="group" aria-label="...">
//     <button type="button" class="btn btn-default">Left</button>
//     <button type="button" class="btn btn-default">Middle</button>
//     <button type="button" class="btn btn-default">Right</button>
// </div>
};

sideSettingBar.prototype.AddButtonGroup = function(g) {
    return g.append("div")
        .attr("class", "btn-group")
        .attr("role", "group");
};

sideSettingBar.prototype.AddButtonToolBar = function(g)
{
    return g.append("div")
        .attr("class", "btn-toolbar")
        .attr("role", "toolbar");
};

navigationBar = function() {
    var that = this;
    d3.select("body").insert("nav","#svg_div")
        .attr("class", "navbar navbar-default navbar-inverse")
        .attr("style", "margin-bottom:0");

    this.headBar = d3.select("body").insert("nav","#svg_div")
        .attr("class", "navbar navbar-inverse navbar-fixed-top")
        .attr("style", "margin-bottom:0")
        .append("div")
        .attr("class", "container-fluid")
        .append("div")
        .attr("class", "row box");
    this.sideBar = new sideSettingBar();

    this.head = this.headBar.append("div")
        .attr("id", "navigationHead")
        .attr("class", "col-md-2 navbar-header");

    this.head.append("a")
        .attr("class","navbar-brand")
        .attr("href","#")
        .append("img")
        .attr("alt","Brand")
        .attr("src","./img/soccer.ico");
    this.head.append("a")
        .attr("class","navbar-brand")
        .attr("href","#")
        .text("足球可视化系统");

    this.match = this.headBar.append("div")
        .attr("id", "navigationMatch")
        .attr("class", "col-md-5 col-md-offset-2")
        .append("ul")
        .attr("class","nav navbar-nav");
    this.match.append("li")
        .attr("class","navigationTextTeam")
        .append("a")
        .attr("href","#")
        .text("队伍1　　　　　2");
    this.match.append("li")
        .attr("class","disabled navigationTextVS")
        .append("a")
        .attr("href","#")
        .text("VS");
    this.match.append("li")
        .attr("class","navigationTextTeam")
        .append("a")
        .attr("href","#")
        .text("3　　　　　队伍2");

    this.date = this.headBar.append("div")
        .attr("id", "navigationDate")
        .attr("class", "col-md-2 navigationTextDate")
        .text("比赛时间： 2017-10-10");

    this.setting = this.headBar.append("div")
        .attr("id", "navigationSetting")
        .attr("class", "col-md-1 navigationTextSetting collapsed")
        .attr("data-toggle","collapse")
        .attr("data-target","#settingBar");

    this.setting
        .insert("span","text")
        .attr("class","glyphicon glyphicon-menu-hamburger")
        .attr("aria-hidden","true")
        .text("设置");
    this.setting
        .append("span")
        .attr("class", "sr-only")
        .text("　设置");
};
