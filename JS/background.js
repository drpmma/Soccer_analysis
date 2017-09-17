function drawback() {
    width = document.getElementById("svg_div").getBoundingClientRect().width;
    height = document.getElementById("svg_div").getBoundingClientRect().height;
    d3.select("#screen").append("rect")
        .attr("x",(x_smallfield-0.01)*width)
        .attr("y",0.002*height)
        .attr("width",(width_smallfield+0.02)*width)
        .attr("height",0.995*height)
        .attr("rx","6")
        .attr("ry","6")
        .attr("fill","rgb(36,40,51)")
    d3.select("#screen").append("rect")
        .attr("x",(x_timeline-0.01)*width)
        .attr("y",0.002*height)
        .attr("width",(0.94*0.65+0.02)*width)
        .attr("height",0.995*height)
        .attr("rx","6")
        .attr("ry","6")
        .attr("fill","rgb(36,40,51)")
}