/**
 * Created by Zhouxiang on 2017/7/6.
 */
var field = document.getElementById("svg_field").getBoundingClientRect();;
var field_w = field.width, field_h = field.height;
var data = [{x:50, y:50}, {x:20, y:30}];
var path_d = [{target:data[0], source:data[1]}];

function svg_scale(data, id) {
    if(id == 0)     // width
        return data / 100 * field_w;
    else if(id == 1)
        return data / 70 * field_h;
    else
        return -1;
}

var node = d3.select("#svg_field")
                .select("g")
                .append("g")
                .attr("id", "node_container");
var path = d3.select("#svg_field")
                .select("g")
                .append("g")
                .attr("id", "path_container");

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
                    .attr("d", function (d) {
                        return "M" + svg_scale(d.source.x, 0) + " " + svg_scale(d.source.y, 1)
                            + " L " + svg_scale(d.target.x, 0) + " " + svg_scale(d.target.y, 1);
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2);

var svg_point = d3.select("#node_container")
                    .selectAll("g")
                    .data(data)
                    .enter()
                    .append("g")
                    .attr("class", "node")
                    .attr("id", function (d, i) {
                        return i;
                    })
                    .append("circle")
                    .attr("cx", function (d) {
                        return d.x / 100 * field_w;
                    })
                    .attr("cy", function (d) {
                        return d.y / 70 * field_h;
                    })
                    .attr("r", 10)
                    .attr("fill", "steelblue");

