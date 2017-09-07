sideSettingBar = function() {
    this.soh = 1;
    this.showSetting = d3.select("#showSetting");
    this.clusterSetting = d3.select("#clusterSetting");
    this.sequenceSetting = d3.select("#sequenceSetting");
    this.dataSetting = d3.select("#dataSetting");

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
sideSettingBar.prototype.clusterLayoutSelect = function(k) {
    this.clusterLayoutSel = k;
    if(cm != undefined)
    {
        cm.relayout(k);
    }
    else console.log("Error: There is nothing to relayout.");
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

sideSettingBar.prototype.AbstractMethodsSelect = function(k) {
    console.log("AbstractSelect"+k);
    this.abstractMethodSel = k;
    ChangeClusterAlgorithmMode(k);
};

sideSettingBar.prototype.AbstractLayerSelect = function(k) {
    console.log("AbstractLayerSelect"+k);
    this.abstractLayerSel = k;
    abstractDraw(10*k);
};

sideSettingBar.prototype.SingleOrAll = function() {
    console.log("SingleOrAll");
    ChangeAllFlag();
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
    d3.select("#mainfield").selectAll(".node").attr("opacity", 1);
    d3.select("#mainfield").selectAll("text").attr("opacity", 1);
    cm = new ClusterManager(mainfield, seq);
    cm.setDuration(this.clusterTimeOptions[this.clusterTimeSel]);
    let type;
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
        let type;
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
    let data_name = new Array();
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
    let i;
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

    this.clusterLayoutOptions = new Array();
    this.clusterLayoutOptions[0] = "推进布场";
    this.clusterLayoutOptions[1] = "切入布场";
    this.clusterLayoutOptions[2] = "顺序布场";
    this.clusterLayoutSel = 0;

    this.nodeTimeOptions = new Array();
    for(i = 0; i < 20; i++) this.nodeTimeOptions[i] = i*100;
    this.nodeTimeSel = 2;

    this.abstractLayers = new Array();
    for(i = 0; i < 22; i++) this.abstractLayers[i] = i*10;
    this.abstractLayerSel = 0;

    this.abstractMethods = new Array();
    this.abstractMethods = ["k-means","k-medoids"];
    this.abstractMethodSel = 0;

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
    this.sequenceTimeSel = 0;

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
    let that = this;
    this.AddSelection("聚团时间",this.clusterTimeOptions,this.clusterTimeSel,"default",this.clusterSetting,function(k){that.clusterTimeSelect(k)});
    this.AddSelection("聚团样式",this.clusterStyleOptions,this.clusterStyleSel,"default",this.clusterSetting,function(k){that.clusterStyleSelect(k)});
    this.AddSelection("聚团布场",this.clusterLayoutOptions,this.clusterLayoutSel,"default",this.clusterSetting,function(k){that.clusterLayoutSelect(k)});
    let temp = this.AddButtonToolBar(this.clusterSetting);
    this.AddButton("聚团","default",this.AddButtonGroup(temp),function(){that.clusterizeBtn()});
    this.AddButton("改变样式","default",this.AddButtonGroup(temp),function(){that.clusterChangeBtn()});
    this.AddButton("取消聚团","default",this.AddButtonGroup(temp),function(){that.declusterizeBtn()});

    this.AddSelection("飞点时间",this.nodeTimeOptions,this.nodeTimeSel,"default",this.showSetting,function(k){that.nodeTimeSelect(k)});
    this.AddSelection("球员样式",this.playerStyleOptions,this.playerStyleSel,"default",this.showSetting,function(k){that.playerStyleSelect(k)});
    this.AddSelection("中英文选择",this.EnCnOptions,this.EnCnSel,"default",this.showSetting,function(k){that.EnCnSelect(k)});
    this.AddSelection("抽象方法",this.abstractMethods,this.abstractMethodSel,"default",this.showSetting,function(k){that.AbstractMethodsSelect(k) });
    this.AddSelection("抽象程度",this.abstractLayers,this.abstractLayerSel,"default",this.showSetting,function(k){that.AbstractLayerSelect(k)});
    temp = this.AddButtonToolBar(this.showSetting);
    this.AddButton("显示所有/单次进攻","default",this.AddButtonGroup(temp),function () {
        that.SingleOrAll()
    });

    this.AddSelection("变换时间",this.sequenceTimeOptions,this.sequenceTimeSel,"default",this.sequenceSetting,function(k){that.sequenceTimeSelect(k)});
    this.AddSelection("序列样式",this.sequenceStyleOptions,this.sequenceStyleSel,"default",this.sequenceSetting,function(k){that.sequenceStyleSelect(k)});
    temp = this.AddButtonToolBar(this.sequenceSetting);
    this.AddButton("变换序列样式","default",this.AddButtonGroup(temp),function(){that.sequenceChangeBtn()});

    this.AddSelection("数据选择",this.dataListOptions,this.dataListSel,"default",this.dataSetting,function(k){that.dataListSelect(k)});
    temp = this.AddButtonToolBar(this.dataSetting);
    this.AddButton("更换数据","default",this.AddButtonGroup(temp),function(){that.dataChangeBtn()});
    this.AddButton("导入数据","default",this.AddButtonGroup(temp),function(){that.dataUpdateBtn()});
};

sideSettingBar.prototype.AddTitle = function(t,g) {
    g.append("h4").text(t);
};
sideSettingBar.prototype.AddSelection = function(t,l,s,c,g,f) {
    let sel = g.append("p").text(t+"　：　");
    let but = sel.append("div")
        .attr("class","btn-group");
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
    let li = but.append("ul")
        .attr("class","dropdown-menu setting_list");
    for(let i = 0; i < l.length; i++) {
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
    $(function () {
        $('#navigationHead').click(function(){
            let stgbar = $('#settingBar');
            let mnwid = $('#svg_div');
            if(sideSetting.soh === 1) {
                stgbar.animate({left:'-25%'});
                mnwid.animate({left:'0'});
                sideSetting.soh = 0;
            } else {
                mnwid.animate({left: '25%'});
                stgbar.animate({left:'0'});
                sideSetting.soh = 1;
            }
        })
    });

    $(function ()
    { $("#identifier").modal({keyboard: true});
    });
};
navigationBar.prototype.setTitle = function(team0, team1, score0, score1, year, month, day) {
    $('#nav_team0')[0].innerHTML = team0;
    $('#nav_score0')[0].innerHTML = score0;
    $('#nav_vs')[0].innerHTML = "VS";
    $('#nav_score1')[0].innerHTML = score1;
    $('#nav_team1')[0].innerHTML = team1;
    $('#navigationDate')[0].innerHTML = '比赛时间： '+year+'-'+month+'-'+day;
    $('#vir_nav_team0')[0].innerHTML = team0;
    $('#vir_nav_score0')[0].innerHTML = score0;
    $('#vir_nav_vs')[0].innerHTML = "VS";
    $('#vir_nav_score1')[0].innerHTML = score1;
    $('#vir_nav_team1')[0].innerHTML = team1;
    $('#vir_navigationDate')[0].innerHTML = '比赛时间： '+year+'-'+month+'-'+day;
};