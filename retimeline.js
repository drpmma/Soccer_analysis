/**
 * Created by zf on 2017/7/27.
 */
timeline= function (svg,width,height) {
    this.svg=svg;
    this.width=width;
    this.height=height;

    this.title=svg.append("rect")
        .attr("id","teamname")
        .attr("x",0.2*width)
        .attr("y",0.02*height)
        .attr("height",0.1*height)
        .attr("width",0.6*width)
        .attr("fill","white")
        .attr("stroke","black")
        .attr("stroke-width","0.5px")
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
        this.g_timeline.append('text')
            .attr("x",(0.2 + i * 0.1) * width)
            .attr('y',0.17*height)
            .attr('fill',"black")
            .attr('font-size',"100%")
            .attr('text-align',"center" )
            .html(i*15);
    }
}

matchinfo = function (svg,data,width,height) {
    this.svg=svg;
    this.data=data;
    this.width=width;
    this.height=height;

    this.g_sequence=svg.append("g")
        .attr("id","Sequence")
    for(var i=0;i<data.length;i++)
    {
        var g=this.g_sequence.append("g")
            .attr("id",function () {
                return "g_sequence"+(i+1)
            })
        g.append("circle")
            .attr("rx",function () {
                
            })
    }
}

