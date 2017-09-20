/**
 * Created by zf on 2017/9/18.
 */


var x_smallfield = 0.04
var x_timeline = 0
var x_width = 0.01
var y_timeline = 0.72
var width_smallfield=0.07
var width_timeline =0.094*6.5
var height_timeline = 0.05

timeline= function (div,width,height,data,field) {
    this.div=div;
    this.width=width;
    this.height=height;

    this.svg=div.select("#center").append("svg")
        .attr("id","timeline")
        .attr("x",x_timeline*width)
        .attr("y",y_timeline*height)
        .attr("width",width*width_timeline)
        .attr("height",height*height_timeline)
    this.g_timeline=this.svg.append("g")
        .attr("id","timeline");
    this.g_timeline.append("rect")
        .attr("transform","translate(0,0)")
        .attr("width",width*width_timeline)
        .attr("height",height*height_timeline*0.4)
        .attr("rx","10")
        .attr("ry","10")
        .attr("fill","rgb(255,255,255)")
    for(let i=0;i<7;i++) {
        this.g_timeline.append('text')
            .attr("transform",function () {
                return "translate("+(i*(width_timeline*6/6.5)/6)*width+","+height_timeline*0.9*height+")"
            })
            .attr('fill',"rgb(255,255,255)")
            .attr('font-size',0.025*height)
            .attr('text-align',"center" )
            .html(i*15);
    }
    this.g_circle=this.g_timeline.append("g").attr("id","g_circle");
    for(let i =0; i<data.length;i++)
    {
        this.g_circle.append("circle")
            .attr("id",function()
            {
                return "circle_timeline"+i
            })
            .attr("num",i)
            .attr("cx",((x_timeline+(data[i].endTime.min*1.0/90*6/6.5)*width_timeline))*width)
            .attr("cy",height*height_timeline*0.2)
            .attr("r","8")
            .attr("fill",function () {
            let len=data[i].actions.length -1;
            let color=getEventColor(data[i].actions[len].eid);
            return color;
            })
            .on("mouseenter",function () {
                var id =d3.select(this).attr("num")
                width = document.getElementById("svg_div").getBoundingClientRect().width;
                height = document.getElementById("svg_div").getBoundingClientRect().height;
                mouseenter(id,width,height);
            })
            .on("mouseleave",function () {
                var id =d3.select(this).attr("num")
                width = document.getElementById("svg_div").getBoundingClientRect().width;
                height = document.getElementById("svg_div").getBoundingClientRect().height;
                mouseleave(id,width,height);
            })
            .on("click",function () {
                var id =d3.select(this).attr("num")
                width = document.getElementById("svg_div").getBoundingClientRect().width;
                height = document.getElementById("svg_div").getBoundingClientRect().height;
                mouseclick(id,width,height,field)
            })
            .on("dblclick", function () {
                let time0 = data[d3.select(this).attr("num")].startTime,
                    time1 = data[d3.select(this).attr("num")].endTime;
                videoPlayer.playPart(time0, time1);
            });
    }
};
