sideSettingBar = function() {
    this.soh = 1;
    this.showSetting = d3.select("#showSetting");
    this.clusterSetting = d3.select("#clusterSetting");
    this.abstractSetting = d3.select("#abstractSetting")
    this.sequenceSetting = d3.select("#sequenceSetting");
    this.dataSetting = d3.select("#dataSetting");

    this.CreateOptions();
    this.CreateElements();
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
    this.AbstractLayerSelect(this.abstractLayerParams.value);
};
sideSettingBar.prototype.AbstractLayerSelect = function(k) {
    console.log("AbstractLayerSelect"+k);
    if(k == 0) abstractDraw(0);
    else if(this.abstractMethodSel == 0) abstractDraw(k);
    else abstractDraw((+k)+110);
};
sideSettingBar.prototype.SingleOrAll = function() {
    console.log("SingleOrAll");
    ChangeAllFlag();
    this.AbstractLayerSelect(this.abstractLayerParams.value);
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
    cm.setDuration(this.clusterTimeParams.value);
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
        cm.setDuration(this.clusterTimeParams.value);
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
        cm.setDuration(this.clusterTimeParams.value);
        cm.deleteOne();
    }
    else console.log("Error: There is nothing to be deleted.");
    console.log("declusterizeBtn")
};
sideSettingBar.prototype.sequenceChangeBtn = function() {
    f3.viewtransform(this.sequenceStyleSel,this.sequenceTimeParams.value);
    console.log("sequenceChangeBtn")
};
sideSettingBar.prototype.dataChangeBtn = function() {
    let data_name = new Array();
    data_name[0] = "./data/MatchData_合并.json";
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
    let that = this;

    this.clusterTimeParams = {
        title: "聚团时间",
        name: "cluster_duration",
        min: 0,
        max: 2000,
        value: 500,
        g: this.clusterSetting,
        step: 10,
        callback: function(k) {
            that.clusterTimeParams.value = k;
        }
    };
    this.videoBufferTimeParams = {
        title: "视频缓冲时间",
        name: "video_buffer_time",
        min: 0,
        max: 60,
        value: 5,
        g: this.showSetting,
        step: 1,
        callback: function(k) {
            that.videoBufferTimeParams.value = k;
            videoPlayer.setBufferTime(k);
        }
    };

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

    this.showTimeParams = {
        title: "显示变换时间",
        name: "show_duration",
        min: 0,
        max: 2000,
        value: 200,
        g: this.showSetting,
        step: 10,
        callback: function(k) {
            that.showTimeParams.value = k;
        }
    };

    this.abstractLayerParams = {
        title: "抽象程度",
        name: "abstract_layer",
        min: 0,
        max: 100,
        value: 0,
        g: this.abstractSetting,
        step: 10,
        callback: function(k) {
            that.abstractLayerParams.value = k;
            that.AbstractLayerSelect(k);
        }
    };

    this.abstractMethods = new Array();
    this.abstractMethods = ["简化","平均聚合","中位聚合"];
    this.abstractMethodSel = 0;

    this.playerStyleOptions = new Array();
    this.playerStyleOptions[0] = "圆";
    this.playerStyleOptions[1] = "球衣";
    this.playerStyleSel = 0;

    this.EnCnOptions = new Array();
    this.EnCnOptions[0] = "中文";
    this.EnCnOptions[1] = "英文";
    this.EnCnSel = 0;

    this.sequenceTimeParams = {
        title: "序列变换时间",
        name: "sequence_duration",
        min: 0,
        max: 2000,
        value: 500,
        g: this.sequenceSetting,
        step: 10,
        callback: function(k) {
            that.sequenceTimeParams.value = k;
        }
    };

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
    this.AddSlider(this.clusterTimeParams);
    this.AddSelection("聚团样式",this.clusterStyleOptions,this.clusterStyleSel,"default",this.clusterSetting,function(k){that.clusterStyleSelect(k)});
    this.AddSelection("聚团布场",this.clusterLayoutOptions,this.clusterLayoutSel,"default",this.clusterSetting,function(k){that.clusterLayoutSelect(k)});
    let temp = this.AddButtonToolBar(this.clusterSetting);
    this.AddButton("聚团","default",this.AddButtonGroup(temp),function(){that.clusterizeBtn()});
    this.AddButton("改变样式","default",this.AddButtonGroup(temp),function(){that.clusterChangeBtn()});
    this.AddButton("取消聚团","default",this.AddButtonGroup(temp),function(){that.declusterizeBtn()});

    this.AddSlider(this.showTimeParams);
    this.AddSlider(this.videoBufferTimeParams);
    this.AddSelection("球员样式",this.playerStyleOptions,this.playerStyleSel,"default",this.showSetting,function(k){that.playerStyleSelect(k)});
    this.AddSelection("中英文选择",this.EnCnOptions,this.EnCnSel,"default",this.showSetting,function(k){that.EnCnSelect(k)});

    this.AddSelection("抽象方法",this.abstractMethods,this.abstractMethodSel,"default",this.abstractSetting,function(k){that.AbstractMethodsSelect(k) });
    this.AddSlider(this.abstractLayerParams);
    temp = this.AddButtonToolBar(this.abstractSetting);
    this.AddButton("显示所有/单次进攻","default",this.AddButtonGroup(temp),function () {
        that.SingleOrAll()
    });

    this.AddSlider(this.sequenceTimeParams);
    this.AddSelection("序列样式",this.sequenceStyleOptions,this.sequenceStyleSel,"default",this.sequenceSetting,function(k){that.sequenceStyleSelect(k)});
    temp = this.AddButtonToolBar(this.sequenceSetting);
    this.AddButton("变换序列样式","default",this.AddButtonGroup(temp),function(){that.sequenceChangeBtn()});

    this.AddSelection("数据选择",this.dataListOptions,this.dataListSel,"default",this.dataSetting,function(k){that.dataListSelect(k)});
    temp = this.AddButtonToolBar(this.dataSetting);
    this.AddButton("更换数据","default",this.AddButtonGroup(temp),function(){that.dataChangeBtn()});
    this.AddButton("导入数据","default",this.AddButtonGroup(temp),function(){that.dataUpdateBtn()});
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
sideSettingBar.prototype.AddSlider = function(params) {
    let t = params.title,
        slidername = params.name,
        min = params.min,
        value = params.value,
        max = params.max,
        step = params.step,
        g = params.g,
        callback = params.callback;

    g.append("p").attr("id","setting_slider_title_"+slidername).text(t+"　：　"+value)
        .append("div").attr("id","setting_slider_"+slidername).style("margin-top","5px");

    $( "#setting_slider_"+slidername)
        .slider({
        range: "min",
        value: value,
        min: min,
        max: max,
        step: step,
        slide: function( event, ui ) {
            document.getElementById("setting_slider_title_"+slidername).firstChild.nodeValue = t+"　：　"+ui.value;
            callback(ui.value);
        }
    });
};