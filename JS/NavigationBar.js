sideSettingBar = function()
{
    this.soh = 1;
    this.Bar = d3.select("body").insert("div","#svg_div")
        .attr("id", "settingBar")
        .attr("class", "navbar navbar-inverse navbar-fixed-bottom collapse")
        .attr("style", "margin-bottom:0")
        .append("div")
        .attr("class", "container-fluid")
        .append("div")
        .attr("class", "row box");

    this.clusterSetting = this.Bar.append("div")
        .attr("class", "col-md-3")
        .append("div")
        .attr("id", "clusterSetting")
        .attr("class", "bs-callout bs-callout-cluster")
        .text("聚团设置");
    this.showSetting = this.Bar.append("div")
        .attr("class", "col-md-3")
        .append("div")
        .attr("id", "showSetting")
        .attr("class", "bs-callout bs-callout-show")
        .text("显示设置");
    this.sequenceSetting = this.Bar.append("div")
        .attr("class", "col-md-3")
        .append("div")
        .attr("id", "sequenceSetting")
        .attr("class", "bs-callout bs-callout-sequence")
        .text("序列设置");
    this.dataSetting = this.Bar.append("div")
        .attr("class", "col-md-3")
        .append("div")
        .attr("id", "dataSetting")
        .attr("class", "bs-callout bs-callout-data")
        .text("数据设置");
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
