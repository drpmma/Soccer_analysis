navigationBar = function() {
    d3.select("body").insert("nav","#svg_div")
        .attr("class", "navbar navbar-default")
        .attr("style", "margin-bottom:0");

    this.Bar = d3.select("body").insert("nav","#svg_div")
        .attr("class", "navbar navbar-default navbar-fixed-top")
        .attr("style", "margin-bottom:0")
        .append("div")
        .attr("class", "container-fluid")
        .append("div")
        .attr("class", "row box");

    this.head = this.Bar.append("div")
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

    this.match = this.Bar.append("div")
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

    this.date = this.Bar.append("div")
        .attr("id", "navigationDate")
        .attr("class", "col-md-3 navigationTextDate")
        .text("比赛时间： 2017-10-10");
};
