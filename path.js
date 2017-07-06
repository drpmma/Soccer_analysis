/**
 * Created by Zhouxiang on 2017/7/6.
 */
var field = document.getElementById("svg_field").getBoundingClientRect();;
var field_w = field.width, field_h = field.height;
var data = [{x:50, y:50}, {x:20, y:30}];
var svg_point = d3.select("#svg_field")
                    .select("g")
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
