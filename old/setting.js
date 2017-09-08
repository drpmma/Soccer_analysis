/**
 * Created by WuJiang on 2017/7/18.
 */
var svg_setting = d3.select("#setting");

var set1 = svg_setting.append("div")
    .attr("id","setting1")
    .attr("style","border:1px solid #999;padding:3px;");

set1.append("text")
    .attr("class","setting_title")
    .text("聚团设定");
set1.append("br");

set1.append("text")
    .attr("class","setting_subtitle")
    .text("聚团方式");
set1.append("br");
var sel1 = set1.append("select")
    .attr("id","select1")
    .attr("style","width:90%");
sel1.append("option")
    .attr("value","0")
    .text("普通聚团");
sel1.append("option")
    .attr("value","1")
    .text("全体球员");
sel1.append("option")
    .attr("value","2")
    .text("文字云");
sel1.append("option")
    .attr("value","3")
    .text("矩阵");
sel1.append("option")
    .attr("value","4")
    .text("蜂巢");
set1.append("br");

set1.append("text")
    .attr("class","setting_subtitle")
    .text("聚团速度");
set1.append("br");
var sel2 = set1.append("select")
    .attr("id","select2")
    .attr("style","width:90%");
for(var i=0; i<=19; i++)
    sel2.append("option")
        .attr("value",i*100)
        .text((i*100).toString());
set1.append("br");


set1.append("button")
    .attr("type","button")
    .text("聚团")
    .on("click",function(){
        var select1 = document.getElementById("select1");
        var select2 = document.getElementById("select2");
        return clusterize(current_phase, select1.options[select1.selectedIndex].value, select2.options[select2.selectedIndex].value)
    });
set1.append("br");
set1.append("br");
set1.append("br");

var set2 = svg_setting.append("div")
    .attr("id","setting2")
    .attr("style","border:1px solid #999;padding:3px;");
set2.append("text")
    .attr("class","setting_title")
    .text("视图变换");
set2.append("br");
set2.append("text")
    .attr("class","setting_subtitle")
    .text("变换方式");
set2.append("br");
var select_view = set2.append("select")
    .attr("id","select_view")
    .attr("style","width:90%");
select_view.append("option")
    .attr("value","0")
    .text("点");
select_view.append("option")
    .attr("value","1")
    .text("点线");
select_view.append("option")
    .attr("value","2")
    .text("点路径线");
select_view.append("option")
    .attr("value","3")
    .text("路径线");
select_view.append("option")
    .attr("value","4")
    .text("横坐标统计");
select_view.append("option")
    .attr("value","5")
    .text("纵坐标统计");
select_view.append("option")
    .attr("value","6")
    .text("距离对齐");
select_view.append("option")
    .attr("value","7")
    .text("phase的饼图");
set2.append("br");
set2.append("button")
    .attr("type","button")
    .text("视图变换")
    .on("click",function(){
        var select_view = document.getElementById("select_view");
        return timeline_transform(select_view.options[select_view.selectedIndex].value)
    });