/**
 * Created by WuJiang on 2017/7/18.
 */
var svg_setting = d3.select("#setting");

var set1 = svg_setting.append("div")
    .attr("id","setting1")
    .attr("style","border:1px solid #999;padding:3px;");
set1.append("button")
    .attr("type","button")
    .text("聚团")
    .on("click",function(){return clusterize(current_phase)});

