/**
 * Created by Zhouxiang on 2017/7/6.
 */
var player_select;
var field = document.getElementById("svg_field").getBoundingClientRect();
var field_w = field.width, field_h = field.height;

function svg_scale(data, id) {
    if(id == 0)     // width
        return data / 100 * field_w;
    else if(id == 1)
        return data / 70 * field_h;
    else
        return -1;
}

function path() {
    var data = phase_0[0].node;
    var path_d = phase_0[0].path;

    //var data = [{x:50, y:50}, {x:20, y:30}, {x:10, y:60}];
    //var path_d = [{target:data[0], source:data[1]}, {target:data[1], source:data[2]}];

    var path = d3.select("#svg_field")
        .select("g")
        .append("g")
        .attr("id", "path_container");

    var node = d3.select("#svg_field")
                    .select("g")
                    .append("g")
                    .attr("id", "node_container");

    var gnode = d3.select("#node_container")
                        .selectAll("g")
                        .data(data)
                        .enter()
                        .append("g")
                        .attr("class", "node")
                        .attr("id", function (d, i) {
                            return i;
                        })
                        .attr("transform", function(d){
                            return "translate" + "(" + d.coor.x / 100 * field_w
                                    + "," + d.coor.y / 70 * field_h + ")";
                        })
                        .on("click", function(d) {
                            setplayer(d.player);
                        });
    gnode.append("circle")
        .transition()
        .duration(100)
        .delay(function (d, i) {
            return (i) * 100;
        })
        .attr("r", 15)
        .attr("fill", "white")
        .attr("stroke", "black");
    gnode.append("text")
        .transition()
        .duration(100)
        .delay(function (d, i) {
            return (i) * 100;
        })
        .attr("text-anchor", "middle")
        .text(function(d) {
            return d.player;
        })
        .attr("color", "black")
        .attr("font-size", "100%")
        .attr("dominant-baseline", "middle")
        .attr("font-family", "Verdana");


    var svg_path = d3.select("#path_container")
                        .selectAll("g")
                        .data(path_d)
                        .enter()
                        .append("g")
                        .attr("class", "path")
                        .attr("id", function (d, i) {
                            return i;
                        })
                        .append("path")
                        .transition()
                        .duration(300)
                        .delay(function (d, i) {
                            return 100 + (i * 100);
                        })
                        .attr("d", function (d) {
                            return "M" + svg_scale(d.source.x, 0) + " " + svg_scale(d.source.y, 1)
                                + " L " + svg_scale(d.target.x, 0) + " " + svg_scale(d.target.y, 1);
                        })
                        .attr("stroke", function(d){
                            if(d.type == "s")
                                return "red";
                            else
                                return "black";
                        })
                        .attr("stroke-width", 2)
                        .attr("stroke-dasharray", function(d) {
                            if(d.type == "p")
                                return 5;
                            else if(d.type == "k" || d.type == "b")
                                return 0;
                        });
}