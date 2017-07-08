/**
 * Created by WuJiang on 2017/7/8.
 */

d3.csv("gameinfo.csv",function(error,csvdata){

    if(error){
        console.log(error);
    }
    console.log(csvdata);

});

d3.select(".chart")
    .selectAll("div")
    .data(data)
    .enter().append("div")
    .style("width", function(d) { return d * 10 + "px"; })
    .text(function(d) { return d; });

var chart = d3.select(".chart");
var bar = chart.selectAll("div");
var barUpdate = bar.data(data);
var barEnter = barUpdate.enter().append("div");
barEnter.style("width", function(d) { return d * 10 + "px"; });
barEnter.text(function(d) { return d; });