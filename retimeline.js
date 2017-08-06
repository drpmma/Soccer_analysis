/**
 * Created by zf on 2017/7/27.
 */
timeline= function (svg,width,height) {
    this.svg=svg;
    this.width=width;
    this.height=height;

    this.g_timeline=svg.append("g")
        .attr("id","timeline");
    this.g_timeline.append("line")
        .attr("x1",0.2*width)
        .attr("y1",0.13*height)
        .attr("x2",0.8*width)
        .attr("y2",0.13*height)
        .attr("stroke","black")
        .attr("stroke-width","1.5px")
    this.g_timeline.append("line")
        .attr("x1",0.2*width)
        .attr("y1",0.15*height)
        .attr("x2",0.8*width)
        .attr("y2",0.15*height)
        .attr("stroke","black")
        .attr("stroke-width","1.5px")
    for(var i=0;i<7;i++) {
        this.g_timeline.append("line")
            .attr("x1", (0.2 + i * 0.1) * width)
            .attr("y1", 0.13 * height)
            .attr("x2", (0.2 + i * 0.1) * width)
            .attr("y2", 0.15 * height)
            .attr("stroke", "black")
            .attr("stroke-width", "1px")
    }
}

