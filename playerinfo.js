/**
 * Created by WuJiang on 2017/7/8.
 */

var field = document.getElementById("player_svg_field").getBoundingClientRect();
var field_w = field.width, field_h = field.height;

d3.csv("playerinfo.csv", function(error,csvdata){
    if(error) console.log(error);
    var str = d3.csv.toString( csvdata );
    console.log(str.length);
    console.log(str);

    var Player_pos = d3.select("#player_svg_field")
        .append("g")
        .attr("id", "player_pos");
    var Player_id = d3.select("#player_svg_field")
        .append("g")
        .attr("id", "player_id");
    var svg_player_pos = d3.select("#player_pos")
        .selectAll("g")
        .data(csvdata)
        .enter()
        .append("circle")
        .attr("class", "Player_pos")
        .attr("id", function(d,i){return i})
        .attr("cx", function(d,i){return 0.2*field_w+i*field_w*0.6})
        .attr("cy", 0.3*field_h)
        .attr("r", "5%")
        .append("text")
        .attr("class", "Player_id")
        .attr("id", function(d,i){return i})
        .attr("x", function(d,i){return 0.2*field_w+i*field_w*0.6})
        .attr("y", 0.3*field_h)
        .attr("textLength", field_w*0.4)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-family", "华文行楷")
        .attr("font-size", "30")
        .attr("color","black")
        .text(function(d){return d.team});
})