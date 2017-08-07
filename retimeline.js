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
        .attr("width",0.62*width)
        .attr("fill","white")
        .attr("stroke","black")
        .attr("stroke-width","0.5px")
    this.g_timeline=svg.append("g")
        .attr("id","timeline");
    this.g_timeline.append("line")
        .attr("x1",0.2*width)
        .attr("y1",0.13*height)
        .attr("x2",0.82*width)
        .attr("y2",0.13*height)
        .attr("stroke","black")
        .attr("stroke-width","1.5px")
    this.g_timeline.append("line")
        .attr("x1",0.2*width)
        .attr("y1",0.15*height)
        .attr("x2",0.82*width)
        .attr("y2",0.15*height)
        .attr("stroke","black")
        .attr("stroke-width","1.5px")
    this.g_timeline.append("line")
        .attr("x1", 0.82* width)
        .attr("y1", 0.13 * height)
        .attr("x2", 0.82* width)
        .attr("y2", 0.15 * height)
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
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
            .on("mouseenter",function () {
                d3.select(this).select("circle")
                    .attr("r",0.012*height);
                d3.select(this).select("rect")
                    .attr("fill-opacity","0.1")
                x=d3.select(this).select("circle")
                    .attr("cx");
                id=d3.select(this).select("circle").attr("id")
                g_mouse_field=d3.select(this).append("g")
                    .attr("id","mouse_field")
                var click_field= new Field(g_mouse_field,x-0.04*width,0.14*height,0.08*width,0.08*height,0,0)
                var phase_small=new Sequence(click_field.fieldGroup,data[parseInt(id[15])],4);
            })
            .on("mouseleave",function () {
                d3.select(this).select("circle")
                    .attr("r",0.008*height);
                d3.select(this).select("rect")
                    .attr("fill-opacity","1")
                d3.select(this).select("#mouse_field").remove();
            })
        g.append("circle")
            .attr("id",function()
            {
                return "circle_timeline"+i
            })
            .attr("cx",function () {
                return (0.2+(data[i].endTime.min*1.0/90)*0.6)*width;
            })
            .attr("cy",0.14*height)
            .attr("r",0.008*height)
            .attr("fill",function () {
                var len=data[i].actions.length -1;
                var color=getEventColor(data[i].actions[len].eid);
                return color;
            })
        var smallqurt= new Field(g,0.84*width,(i*0.08+0.01)*height,0.075*width,0.07*height,0,0)
        var phase_small=new Sequence(smallqurt.fieldGroup,data[i],3);
        g.append("rect")
            .attr("id","rect_g")
            .attr("x",0.84*width)
            .attr("y",(i*0.08+0.01)*height)
            .attr("width",0.1*width)
            .attr("height",0.07*height)
            .attr("fill","gray")
            .attr("fill-opacity","0")


    }
}

