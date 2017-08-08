Setting = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.margin = "2px";
    this.settingGroup = d3.select("body")
        .append("div")
        .attr("id","settingGroup")
        .attr("style","position:absolute; left:"+x+"px;top:"+y+"px;width:"+width+"px;height:"+height+"px;");

    this.addClusterSetting();
    this.addFieldSetting();
    this.addSequenceSetting();

    this.optionList();
    this.addElement();
};

Setting.prototype.func1 = function() {
    var sel1 = document.getElementById("clusterSettingSelect0"),
        sel2 = document.getElementById("clusterSettingSelect1");
    var val1 = sel1.options[sel1.selectedIndex].value,
        val2 = sel2.options[sel2.selectedIndex].value;
    if(cm != undefined) cm.clearAll();
    cm = new ClusterManager(mainfield, seq);
    cm.setDuration(val1);
    var type;
    switch(+val2)
    {
        case 0:type = CT_Node_Link;break;
        case 1:type = CT_Node_Link_All;break;
        case 2:type = CT_Hive_Plot;break;
        case 3:type = CT_Matrix;break;
        case 4:type = CT_Tag_Cloud;break;
    }
    cm.clusterize(type);
};

Setting.prototype.func2 = function() {
    var sel1 = document.getElementById("clusterSettingSelect0"),
        sel2 = document.getElementById("clusterSettingSelect1");
    var val1 = sel1.options[sel1.selectedIndex].value,
        val2 = sel2.options[sel2.selectedIndex].value;
    if(cm != undefined)
    {
        cm.setDuration(val1);
        cm.delete();
    }
    else console.log("Error: There is nothing to be deleted.");
};

Setting.prototype.func3 = function() {
    var sel1 = document.getElementById("clusterSettingSelect0"),
        sel2 = document.getElementById("clusterSettingSelect1");
    var val1 = sel1.options[sel1.selectedIndex].value,
        val2 = sel2.options[sel2.selectedIndex].value;
    if(cm != undefined)
    {
        cm.setDuration(val1);
        var type;
        switch(+val2)
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
};

Setting.prototype.func4 = function() {
    console.log("this.funct4");
    var sel1 = document.getElementById("fieldSettingSelect0"),
        sel2 = document.getElementById("fieldSettingSelect1");
    var val1 = sel1.options[sel1.selectedIndex].value,
        val2 = sel2.options[sel2.selectedIndex].value;
};

Setting.prototype.func5 = function() {
    console.log("this.funct5");
    var sel1 = document.getElementById("sequenceSettingSelect0"),
        sel2 = document.getElementById("sequenceSettingSelect1");
    var val1 = sel1.options[sel1.selectedIndex].value,
        val2 = sel2.options[sel2.selectedIndex].value;
    f3.viewtransform(val2,val1);
};

Setting.prototype.addSelect = function(options, setting) {
    setting.selectList[setting.selNum] = setting.G.append("select")
        .attr("id",setting.ID + "Select"+setting.selNum)
        .attr("style","margin:"+this.margin);
    for(var i = 0; i < options.length; i++)
    {
        setting.selectList[setting.selNum].append("option")
            .attr("value",options[i].value)
            .text(options[i].text);
    }
    setting.selNum++;
};

Setting.prototype.addText = function(text, setting) {
    setting.textList[setting.textNum] = setting.G.append("text")
        .attr("style","margin:"+this.margin)
        .text(text);
};

Setting.prototype.addButton = function(text, func, setting) {
    setting.buttonList[setting.buttonNum] = setting.G.append("button")
        .attr("style","margin:"+this.margin)
        .text(text)
        .on("click", func);
};

Setting.prototype.addBr = function(setting) {
    setting.G.append("br");
};

Setting.prototype.addClusterSetting = function() {
    var x = 0,
        y = 0,
        width = this.width*0.32,
        height = this.height;
    this.clusterSetting = new ClusterSetting(this.settingGroup,x,y,width,height);
};

Setting.prototype.addFieldSetting = function() {
    var x = this.width*0.34,
        y = 0,
        width = this.width*0.32,
        height = this.height;
    this.fieldSetting = new FieldSetting(this.settingGroup,x,y,width,height);
};

Setting.prototype.addSequenceSetting = function() {
    var x = this.width*0.68,
        y = 0,
        width = this.width*0.32,
        height = this.height;
    this.sequenceSetting = new SequenceSetting(this.settingGroup,x,y,width,height);
};

Setting.prototype.addElement = function() {
    var that = this;
    this.addText("聚团时间：",this.clusterSetting);this.addSelect(this.clusterDurationOptions,this.clusterSetting);
    this.addBr(this.clusterSetting);
    this.addText("聚团方式：",this.clusterSetting);this.addSelect(this.clusterStyleOptions,this.clusterSetting);
    this.addBr(this.clusterSetting);
    this.addButton("聚团",function(){that.func1();},this.clusterSetting);
    this.addButton("取消聚团",function(){that.func2();},this.clusterSetting);
    this.addButton("改变样式",function(){that.func3();},this.clusterSetting);

    this.addText("飞点时间：",this.fieldSetting);this.addSelect(this.fieldDurationOptions,this.fieldSetting);
    this.addBr(this.fieldSetting);
    this.addText("球员样式：",this.fieldSetting);this.addSelect(this.playerStyleOptions,this.fieldSetting);
    this.addBr(this.fieldSetting);
    this.addButton("变换球员样式",function(){that.func4();},this.fieldSetting);

    this.addText("序列变换时间：",this.sequenceSetting);this.addSelect(this.sequenceDurationOptions,this.sequenceSetting);
    this.addBr(this.sequenceSetting);
    this.addText("序列样式：",this.sequenceSetting);this.addSelect(this.sequenceStyleOptions,this.sequenceSetting);
    this.addBr(this.sequenceSetting);
    this.addButton("变换序列样式",function(){that.func5();},this.sequenceSetting);
};

Setting.prototype.optionList = function() {
    var i;
    this.clusterDurationOptions = new Array();
    for(i = 0; i < 20; i++) this.clusterDurationOptions[i] = {value: i*100,text: i*100};

    this.clusterStyleOptions = new Array();
    this.clusterStyleOptions[0] = {value:0,text:"普通"};
    this.clusterStyleOptions[1] = {value:1,text:"全场"};
    this.clusterStyleOptions[2] = {value:2,text:"蜂巢"};
    this.clusterStyleOptions[3] = {value:3,text:"矩阵"};
    this.clusterStyleOptions[4] = {value:4,text:"文字云"};

    this.fieldDurationOptions = new Array();
    for(i = 0; i < 20; i++) this.fieldDurationOptions[i] = {value: i*100,text: i*100};

    this.playerStyleOptions = new Array();
    this.playerStyleOptions[0] = {value:0,text:"圆"};
    this.playerStyleOptions[1] = {value:1,text:"球衣"};

    this.sequenceStyleOptions = new Array();
    this.sequenceStyleOptions[0] = {value:0,text:"点图"};
    this.sequenceStyleOptions[1] = {value:1,text:"点线图"};
    this.sequenceStyleOptions[2] = {value:2,text:"标识"};
    this.sequenceStyleOptions[3] = {value:3,text:"虫图"};
    this.sequenceStyleOptions[4] = {value:4,text:"横坐标"};
    this.sequenceStyleOptions[5] = {value:5,text:"纵坐标"};
    this.sequenceStyleOptions[6] = {value:6,text:"时间对齐"};
    this.sequenceStyleOptions[7] = {value:7,text:"距离对齐"};
    this.sequenceStyleOptions[8] = {value:8,text:"饼图"};

    this.sequenceDurationOptions = new Array();
    for(i = 0; i < 20; i++) this.sequenceDurationOptions[i] = {value: i*100,text: i*100};
};

ClusterSetting = function(g, x, y, width, height){
    this.x = x; this.y = y; this.width = width; this.height = height;
    this.G = g.append("div")
        .attr("id","clusterSettingFrame")
        .attr("style","background:whitesmoke; border:2px solid black;"+
                      "position:absolute; left:"+x+"px; top:"+y+"px;"+
                      "width:"+width+"px; height:"+height+"px;");
    this.selectList = new Array();
    this.selNum = 0;
    this.textList = new Array();
    this.textNum = 0;
    this.buttonList = new Array();
    this.buttonNum = 0;
    this.ID = "clusterSetting";
};

FieldSetting = function(g, x, y, width, height){
    this.x = x; this.y = y; this.width = width; this.height = height;
    this.G = g.append("div")
        .attr("id","fieldSettingFrame")
        .attr("style","background:whitesmoke; border:2px solid black;"+
            "position:absolute; left:"+x+"px; top:"+y+"px;"+
            "width:"+width+"px; height:"+height+"px;");
    this.selectList = new Array();
    this.selNum = 0;
    this.textList = new Array();
    this.textNum = 0;
    this.buttonList = new Array();
    this.buttonNum = 0;
    this.ID = "fieldSetting";
};

SequenceSetting = function(g, x, y, width, height){
    this.x = x; this.y = y; this.width = width; this.height = height;
    this.G = g.append("div")
        .attr("id","sequenceSettingFrame")
        .attr("style","background:whitesmoke; border:2px solid black;"+
            "position:absolute; left:"+x+"px; top:"+y+"px;"+
            "width:"+width+"px; height:"+height+"px;");
    this.selectList = new Array();
    this.selNum = 0;
    this.textList = new Array();
    this.textNum = 0;
    this.buttonList = new Array();
    this.buttonNum = 0;
    this.ID = "sequenceSetting";
};

