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

sideSettingBar.prototype.clusterTimeSelect = function(k) {
    console.log("clusterTimeSelect"+k);
    this.clusterTimeSel = k;
};
sideSettingBar.prototype.clusterStyleSelect = function(k) {
    console.log("clusterStyleSelect"+k);
    this.clusterStyleSel = k;
};
sideSettingBar.prototype.nodeTimeSelect = function(k) {
    console.log("nodeTimeSelect"+k);
    this.nodeTimeSel = k;
};
sideSettingBar.prototype.playerStyleSelect = function(k) {
    console.log("playerStyleSelect"+k);
    this.playerStyleSel = k;
    switch (+k)
    {
        case 0: pm.changeToCircle();break;
        case 1: pm.changeToJersey();break;
    }
};
sideSettingBar.prototype.EnCnSelect = function(k) {
    console.log("EnCnSelect"+k);
    this.EnCnSel = k;
};
sideSettingBar.prototype.sequenceTimeSelect = function(k) {
    console.log("sequenceTimeSelect"+k);
    this.sequenceTimeSel = k;
};
sideSettingBar.prototype.sequenceStyleSelect = function(k) {
    console.log("sequenceStyleSelect"+k);
    this.sequenceStyleSel = k;
};
sideSettingBar.prototype.dataListSelect = function(k) {
    console.log("dataListSelect"+k);
    this.dataListSel = k;
};
sideSettingBar.prototype.clusterizeBtn = function() {
    if(cm != undefined) cm.clearAll();
    cm = new ClusterManager(mainfield, seq);
    cm.setDuration(this.clusterTimeOptions[this.clusterTimeSel]);
    var type;
    switch(+this.clusterStyleSel)
    {
        case 0:type = CT_Node_Link;break;
        case 1:type = CT_Node_Link_All;break;
        case 2:type = CT_Hive_Plot;break;
        case 3:type = CT_Matrix;break;
        case 4:type = CT_Tag_Cloud;break;
    }
    cm.clusterize(type);
    console.log("clusterizeBtn");
};
sideSettingBar.prototype.clusterChangeBtn = function() {
    if(cm != undefined)
    {
        cm.setDuration(this.clusterTimeOptions[this.clusterTimeSel]);
        var type;
        switch(+this.clusterStyleSel)
        {
            case 0:type = CT_Node_Link;break;
            case 1:type = CT_Node_Link_All;break;
            case 2:type = CT_Hive_Plot;break;
            case 3:type = CT_Matrix;break;
            case 4:type = CT_Tag_Cloud;break;
        }
        cm.change(type);
    }
    else console.log("Error: There is nothing to be changed.");
    console.log("clusterChangeBtn")
};
sideSettingBar.prototype.declusterizeBtn = function() {
    if(cm != undefined)
    {
        cm.setDuration(this.clusterTimeOptions[this.clusterTimeSel]);
        cm.deleteOne();
    }
    else console.log("Error: There is nothing to be deleted.");
    console.log("declusterizeBtn")
};
sideSettingBar.prototype.sequenceChangeBtn = function() {
    f3.viewtransform(this.sequenceStyleSel,this.sequenceTimeOptions[this.sequenceTimeSel]);
    console.log("sequenceChangeBtn")
};
sideSettingBar.prototype.dataChangeBtn = function() {
    var data_name = new Array();
    data_name[0] = "./data/dumpData_t178_m456391_agg0.json";
    data_name[1] = "./data/dumpData_t1_m483676_agg0.json";
    data_name[2] = "./data/dumpData_t120_m483683_agg0.json";
    data_name[3] = "./data/dumpData_t186_m456391_agg0.json";
    data_name[4] = "./data/dumpData_t178_m483675_agg0.json";
    data_name[5] = "./data/dumpData_t186_m486612_agg0.json";
    d3.select("#screen").remove();
    data_select.main(data_name[this.dataListSel]);
    console.log("dataChangeBtn")
};
sideSettingBar.prototype.dataUpdateBtn = function() {
    console.log("dataUpdateBtn")
};

sideSettingBar.prototype.CreateOptions = function() {
    var i;
    this.clusterTimeOptions = new Array();
    for(i = 0; i < 20; i++) this.clusterTimeOptions[i] = i*100;
    this.clusterTimeSel = 5;

    this.clusterStyleOptions = new Array();
    this.clusterStyleOptions[0] = "普通";
    this.clusterStyleOptions[1] = "全场";
    this.clusterStyleOptions[2] = "蜂巢";
    this.clusterStyleOptions[3] = "矩阵";
    this.clusterStyleOptions[4] = "文字云";
    this.clusterStyleSel = 0;

    this.nodeTimeOptions = new Array();
    for(i = 0; i < 20; i++) this.nodeTimeOptions[i] = i*100;
    this.nodeTimeSel = 2;

    this.playerStyleOptions = new Array();
    this.playerStyleOptions[0] = "圆";
    this.playerStyleOptions[1] = "球衣";
    this.playerStyleSel = 0;

    this.EnCnOptions = new Array();
    this.EnCnOptions[0] = "中文";
    this.EnCnOptions[1] = "英文";
    this.EnCnSel = 0;

    this.sequenceTimeOptions = new Array();
    for(i = 0; i < 20; i++) this.sequenceTimeOptions[i] = i*100;
    this.sequenceTimeSel = 2;

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
    this.sequenceStyleSel = 0;

    this.dataListOptions = new Array();
    this.dataListOptions[0] = "数据1";
    this.dataListOptions[1] = "数据2";
    this.dataListOptions[2] = "数据3";
    this.dataListOptions[3] = "数据4";
    this.dataListOptions[4] = "数据5";
    this.dataListOptions[5] = "数据6";
    this.dataListSel = 0;
};
sideSettingBar.prototype.CreateElements = function() {
    var that = this;
    this.clusterSetting = this.Bar.append("div")
        .attr("class", "col-md-3")
        .append("div")
        .attr("id", "clusterSetting")
        .attr("class", "bs-callout bs-callout-cluster");
    this.AddTitle("聚团设置",this.clusterSetting);
    this.AddSelection("聚团时间",this.clusterTimeOptions,this.clusterTimeSel,"default",this.clusterSetting,function(k){that.clusterTimeSelect(k)});
    this.AddSelection("聚团方式",this.clusterStyleOptions,this.clusterStyleSel,"default",this.clusterSetting,function(k){that.clusterStyleSelect(k)});
    var temp = this.AddButtonToolBar(this.clusterSetting);
    this.AddButton("聚团","default",this.AddButtonGroup(temp),function(){that.clusterizeBtn()});
    this.AddButton("改变样式","default",this.AddButtonGroup(temp),function(){that.clusterChangeBtn()});
    this.AddButton("取消聚团","default",this.AddButtonGroup(temp),function(){that.declusterizeBtn()});

    this.showSetting = this.Bar.append("div")
        .attr("class", "col-md-3")
        .append("div")
        .attr("id", "showSetting")
        .attr("class", "bs-callout bs-callout-show");
    this.AddTitle("显示设置",this.showSetting);
    this.AddSelection("飞点时间",this.nodeTimeOptions,this.nodeTimeSel,"default",this.showSetting,function(k){that.nodeTimeSelect(k)});
    this.AddSelection("球员样式",this.playerStyleOptions,this.playerStyleSel,"default",this.showSetting,function(k){that.playerStyleSelect(k)});
    this.AddSelection("中英文选择",this.EnCnOptions,this.EnCnSel,"default",this.showSetting,function(k){that.EnCnSelect(k)});

    this.sequenceSetting = this.Bar.append("div")
        .attr("class", "col-md-3")
        .append("div")
        .attr("id", "sequenceSetting")
        .attr("class", "bs-callout bs-callout-sequence");
    this.AddTitle("序列设置",this.sequenceSetting);
    this.AddSelection("变换时间",this.sequenceTimeOptions,this.sequenceTimeSel,"default",this.sequenceSetting,function(k){that.sequenceTimeSelect(k)});
    this.AddSelection("序列样式",this.sequenceStyleOptions,this.sequenceStyleSel,"default",this.sequenceSetting,function(k){that.sequenceStyleSelect(k)});
    temp = this.AddButtonToolBar(this.sequenceSetting);
    this.AddButton("变换序列样式","default",this.AddButtonGroup(temp),function(){that.sequenceChangeBtn()});

    this.dataSetting = this.Bar.append("div")
        .attr("class", "col-md-3")
        .append("div")
        .attr("id", "dataSetting")
        .attr("class", "bs-callout bs-callout-data");
    this.AddTitle("数据设置",this.dataSetting);
    this.AddSelection("数据选择",this.dataListOptions,this.dataListSel,"default",this.dataSetting,function(k){that.dataListSelect(k)});
    temp = this.AddButtonToolBar(this.dataSetting);
    this.AddButton("更换数据","default",this.AddButtonGroup(temp),function(){that.dataChangeBtn()});
    this.AddButton("导入数据","default",this.AddButtonGroup(temp),function(){that.dataUpdateBtn()});
};

sideSettingBar.prototype.AddTitle = function(t,g) {
    g.append("h4").text(t);
};
sideSettingBar.prototype.AddSelection = function(t,l,s,c,g,f) {
    var sel = g.append("p").text(t+"　：　");
    var but = sel.append("div")
        .attr("class","btn-group dropup");
    but.append("button")
        .attr("type","button")
        .attr("class","btn btn-"+c)
        .attr("data-toggle","dropdown")
        .text(l[s]);
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
    for(var i = 0; i < l.length; i++) {
        li.append("li")
            .append("a")
            .attr("href", "#")
            .attr("num",i)
            .text(l[i])
            .on("click", function() {
                but.select("button").text(l[this.getAttribute("num")]);
                if(f != undefined) f(this.getAttribute("num"));
            });
    }
};
sideSettingBar.prototype.AddButton = function(t,c,g,f) {
    g.append("button")
        .attr("type","button")
        .attr("class","btn btn-"+c)//default primary success info warning danger link
        .text(t)
        .on("click",f);

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
sideSettingBar.prototype.AddButtonToolBar = function(g) {
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
