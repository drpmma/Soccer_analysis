/**
 * Created by zf on 2017/7/27.
 */
var x_smallfield=0.813
var x_timeline = 0.16
var x_width = 0.1
var y_timeline = 0.72
var y_height = 0.02
var width_smallfield=0.065
var height_smallfield=0.07

timeline= function (svg,width,height) {
    this.svg=svg;
    this.width=width;
    this.height=height;

    // this.title=svg.append("rect")
    //     .attr("id","teamname")
    //     .attr("x",0.2*width)
    //     .attr("y",0.02*height)
    //     .attr("height",0.1*height)
    //     .attr("width",0.62*width)
    //     .attr("fill","white")
    //     .attr("stroke","black")
    //     .attr("stroke-width","0.5px")
    this.g_timeline=svg.append("g")
        .attr("id","timeline");
    this.g_timeline.append("line")
        .attr("x1",x_timeline*width)
        .attr("y1",y_timeline*height)
        .attr("x2",(x_timeline+x_width*6.5)*width)
        .attr("y2",y_timeline*height)
        .attr("stroke","black")
        .attr("stroke-width","1.5px")
    this.g_timeline.append("line")
        .attr("x1",x_timeline*width)
        .attr("y1",(y_timeline+y_height)*height)
        .attr("x2",(x_timeline+x_width*6.5)*width)
        .attr("y2",(y_timeline+y_height)*height)
        .attr("stroke","black")
        .attr("stroke-width","1.5px")
    this.g_timeline.append("line")
        .attr("x1", (x_timeline+x_width*6.5)* width)
        .attr("y1", y_timeline * height)
        .attr("x2", (x_timeline+x_width*6.5)* width)
        .attr("y2", (y_timeline+y_height) * height)
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
    for(var i=0;i<7;i++) {
        this.g_timeline.append("line")
            .attr("x1", (x_timeline + i * x_width) * width)
            .attr("y1", y_timeline * height)
            .attr("x2", (x_timeline + i * x_width) * width)
            .attr("y2", (y_timeline+y_height) * height)
            .attr("stroke", "black")
            .attr("stroke-width", "1px")
        this.g_timeline.append('text')
            .attr("x",(x_timeline + i * x_width) * width)
            .attr('y',(y_timeline+y_height*2)*height)
            .attr('fill',"black")
            .attr('font-size',"100%")
            .attr('text-align',"center" )
            .html(i*15);
    }
};

matchinfo = function (svg,field,data,width,height) {
    this.svg=svg;
    this.field=field;
    this.data=data;
    this.width=width;
    this.height=height;

    this.onTransition = new Array(data.length);
    for(var i = 0; i < this.onTransition.length; i++)
        this.onTransition[i] = 0;

    var that = this;
    
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
                d3.select(this).select("#rect_g").attr("fill-opacity","0.5")
                d3.select(this).select("#align_g").attr("fill","gray").attr("fill-opacity","0.5")
                x=d3.select(this).select("circle")
                    .attr("cx");
                id=parseInt(d3.select(this).select("circle").attr("id").substring(15));
                d3.select(this).select("#arc_g").attr("fill","gray").attr("fill-opacity","0.5")
                if(that.onTransition[id] === 0) {
                    that.repaint(d3.select(this), id, x);
                }
            })
            .on("mouseleave",function () {
                d3.select(this).select("circle")
                    .attr("r",0.008*height);
                d3.select(this).select("#rect_g").attr("fill-opacity","0")
                d3.select(this).select("#align_g").attr("fill","white").attr("fill-opacity","1")
                id=parseInt(d3.select(this).select("circle").attr("id").substring(15));
                var color=d3.scaleLinear()
                    .domain([0,20])
                    .range(["red","white"])
                d3.select(this).select("#arc_g").attr("fill",function () {
                    return "gray"
                }).attr("fill-opacity","0")
                if(that.onTransition[id] === 0)
                    d3.select(this).selectAll("#mouse_field").remove();
            })
            .on("click",function () {
                var val1 = nb.sideBar.nodeTimeOptions[nb.sideBar.nodeTimeSel],
                    val2 = nb.sideBar.sequenceStyleSel;
                time=val1;
                id=parseInt(d3.select(this).select("circle").attr("id").substring(15));
                x=d3.select(this).select("circle")
                    .attr("cx");
                if(click>=0)
                {
                    var name= "#g_sequence"+(click+1)
                    var name1 = "#rect_g_click"+click
                    var name2 = "#arc_g_click"+click
                    var name3 ="#align_g_click"+click
                    d3.select("#Sequence").select(name).select(name1).attr("fill-opacity",0).attr("fill","gray").attr("id",function () {
                        console.log("ffff",click)
                        return "rect_g"
                    })
                    d3.select("#Sequence").select(name).select(name2).attr("fill-opacity",0).attr("fill","gray").attr("id","arc_g")
                    d3.select("#Sequence").select(name).select(name3).attr("fill-opacity",0).attr("fill","gray").attr("id","align_g")
                }
                d3.select(this).select("#rect_g").attr("fill-opacity","0.5").attr("fill","red").attr("id",function () {
                    return "rect_g_click"+id
                })
                d3.select(this).select("#align_g").attr("fill-opacity","0.5").attr("fill","red").attr("id",function () {
                    return "align_g_click"+id
                })
                d3.select(this).select("#arc_g").attr("fill-opacity","0.5").attr("fill","red").attr("id",function () {
                    return "arc_g_click"+id
                })
                console.log("id clicl",id, click)
                click=id;
                // d3.select("#click_field").remove();
                // d3.select("#Sequence")
                //     .append("rect")
                //     .attr("id","click_field")
                //     .attr("x",x_smallfield*width)
                //     .attr("y",(id*0.08+0.01)*height)
                //     .attr("height",height_smallfield*height)
                //     .attr("width",width_smallfield*width)
                //     .attr("fill","red").attr("fill-opacity","0.5")
                // d3.selectAll("#mouse_field").remove();
                var phase = that.repaint(d3.select(this), id, x);

                d3.select("#mainfield").select("#path_container").remove();
                d3.select("#mainfield").select("#node_container").remove();

                if(cm != undefined) cm.clearAll();

                that.nodeMoveAnimation(phase.field, field, phase.seq, id);

                seq = new Sequence(field.fieldGroup, data[id]);
                seq.draw_path("link", 0, 1);
                seq.draw_node("node", 10, "white", 1, that.onTransition, id);
            });
        g.append("circle")
            .attr("id",function()
            {
                return "circle_timeline"+i
            })
            .attr("cx",function () {
                return (x_timeline+(data[i].endTime.min*1.0/90)*x_width*6)*width;
            })
            .attr("cy",(y_timeline+0.01)*height)
            .attr("r",0.008*height)
            .attr("fill",function () {
                var len=data[i].actions.length -1;
                var color=getEventColor(data[i].actions[len].eid);
                return color;
            })
    }
    this.viewtransform(0,0);
}

matchinfo.prototype.nodeMoveAnimation = function (oriField, desField, desSequence) {
    function moveNode(d) {
        console.log("a");
        coorX = desField.x + desField.x_scale(d.x) - oriField.x;
        coorY = desField.y + desField.y_scale(d.y) - oriField.y;
        return "translate(" + [coorX, coorY] + ")";
    }
    desSequence.node_container.selectAll("g")
        .transition()
        .duration(100)
        .transition()
        .delay(function (d, i) {
            return time * i;
        })
        .duration(function () {
            return time;
        })
        .attr("transform", function(d){return moveNode(d)});
}

matchinfo.prototype.repaint = function (selection, id, x) {
    g_mouse_field = selection.append("g")
        .attr("id","mouse_field");
    var phase_field = new Field(g_mouse_field, x - 0.04 * this.width, (y_timeline-0.1) * this.height,
        width_smallfield * this.width, height_smallfield * this.height, "click", 0, 0, 1)
    var phase_seq = new Sequence(phase_field.fieldGroup, this.data[id]);
    phase_seq.draw_node("node", 2, "black", 0);

    return {field:phase_field, seq:phase_seq};
}

matchinfo.prototype.donut =function () {
    width=this.width;
    height=this.height;

    var data =new Array();
    for(var i=0;i<this.data.length;i++)
    {
        var name = "#g_sequence" + (i+1);
        var g_court = d3.select("#Sequence").select(name)
        var smallqurt= new Field(g_court,x_smallfield*width,(i*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
        var phase_small=new Sequence(smallqurt.fieldGroup,this.data[i]);
        // if(i==0) time=this.data[i].endTime.min*60+this.data[i].endTime.sec;
        // else time=(this.data[i].endTime.min-this.data[i-1].endTime.min)*60+this.data[i].endTime.sec-this.data[i-1].endTime.sec+60
        var len=phase_small.nodes.length
        data.push(len+2)
        console.log("len",len)
        d3.select("#Sequence").select(name).select("#smallfield_remove").remove();
    }
    console.log(data)
    var color=["blue","yellow","red","pink","green","steelblue","purple","silver","maroon","lime"]
    var angele_data=d3.pie()(data);
    console.log(angele_data)
    for(var num=0;num<data.length;num++) {
        var name = "#g_sequence" + (num+1);
        var g_court = d3.select("#Sequence").select(name)
        var smallqurt= new Field(g_court,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield",0,0,0);
        var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
        var arc=d3.arc()
            .innerRadius(0)
            .outerRadius(0.07*width)
            .padAngle(0.005)
            .startAngle(angele_data[num].startAngle)
            .endAngle(angele_data[num].endAngle)
        var g=g_court.append("g")
            .attr("transform",function () {
                return "translate("+0.83*width+","+(0.05*num+0.02)*height+")"
            })
            .attr("id",function () {
                return "g_arc"+num
            });
        g.selectAll("circle")
            .data(phase_small.nodes)
            .enter().append("circle")
            .attr("id",function (d,i) {
                return "node"+i;
            })
            .attr("transform",function (d,i) {
                return "translate("+i*0.005*height+","+0+")"
            })
            .transition().duration(0*view_time)
            .delay(2*view_time)
            .attr('r',0.005*height)
            .attr("fill",function (d,i) {
                return getEventColor(d.eid)
            })
        g.transition().duration(0.5*view_time)
            .delay(2*view_time).attr("transform",function () {
            return "translate("+0.92*width+","+0.2*height+")"
        })
        g.append("path")
            .attr("d",arc)
            .attr("id","arc_g")
            .attr("stroke","none")
            .attr("fill","none")
            .transition().duration(0.8*view_time)
            .delay(2.2*view_time)
            .attr("stroke","gray")
            .attr("fill","white")
            .attr("fill-opacity",0)
        console.log("num",num,angele_data[num].startAngle)
        g.selectAll("circle")
            .transition().duration(0.8*view_time)
            .delay(2.2*view_time)
            .attr("transform",function () {
                var i=parseInt(d3.select(this).attr("id").substring(4))
                var k=(angele_data[num].endAngle-angele_data[num].startAngle)/(data[num]-1)
                console.log("k",angele_data[num].endAngle-angele_data[num].startAngle)
                var x=0.07*Math.sin(angele_data[num].startAngle+k*i)*width
                var y=-1*0.07*Math.cos(angele_data[num].startAngle+k*i)*width
                console.log("x,y",x,y)
                return "translate("+x+","+y+")"
            })
            .attr("r",function () {
                var i=parseInt(d3.select(this).attr("id").substring(4))
                var k=(angele_data[num].endAngle-angele_data[num].startAngle)
                var r=0.07*width*k/data[num]
                return r;
            })
            .attr("fill",function () {
                return color[num%10]
            })
        // g.append("text")
        //     .attr("id","arc_g")
        //     .text(function () {
        //         return num
        //     })
        //     .attr("transform",function()
        //     {
        //         return "translate("+arc.centroid(angele_data[num])+")"
        //     })
        //     .attr("text-anchor","middle")
        //     .attr("fill-opacity",0)
        //     .transition()
        //     .duration(view_time)
        //     .delay(2*view_time)
        //     .attr("fill-opacity",1)
        g_court.select("#smallfield").remove()
    }
}

matchinfo.prototype.proj = function (X) {
    width=this.width;
    height=this.height;

    for(var num=0;num<this.data.length;num++) {
        var name = "#g_sequence" + (num + 1);
        var g_sequence = d3.select("#Sequence").select(name)
        var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield"+num,0,0,1);
        g_sequence.append("rect")
            .attr("id","rect_g")
            .attr("x",x_smallfield*width)
            .attr("y",(num*0.08+0.01)*height)
            .attr("width",width_smallfield*width)
            .attr("height",height_smallfield*height)
            .attr("fill","gray")
            .attr("fill-opacity","0")
        var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
        var datax= [0,0,0,0,0,0,0,0,0,0];
        var datay= [0,0,0,0,0,0,0,0,0,0];
        for(var j=0;j<phase_small.nodes.length;j++)
        {
            datax[parseInt((phase_small.nodes[j].x-1)/10)]++
            datay[parseInt((phase_small.nodes[j].y-1)/10)]++
        }
        this.g_court=g_sequence.append("g")
            .attr("id","g_proj")
        if(X==1)
        {
            this.g_court.selectAll("rect")
                .data(datax)
                .enter().append("rect")
                .attr("x",function (d,i) {
                    return (x_smallfield+width_smallfield/10*(i))*width
                })
                .attr("y",(num*0.08+0.01)*height)
                .attr("width",width_smallfield/10*width)
                .attr("height",function(d){
                    return (d/10)*height_smallfield*height;
                })
                .attr("fill","steelblue")
                .attr("opacity","0")
                .attr("stroke","steelblue")
                .transition()
                .duration(0.5*view_time)
                .delay(2.5*view_time)
                .attr("opacity","0.5")
            this.g_court.selectAll("text")
                .data(datax)
                .enter().append("text")
                .attr("x",function (d,i) {
                    return (x_smallfield+width_smallfield/10*(i)+0.001)*width
                })
                .attr("y",(num*0.08+0.02)*height)
                .attr("font-size","80%")
                .attr("fill-opacity",0)
                .html(function (d) {
                    return d;
                })
                .transition()
                .duration(0.5*view_time)
                .delay(2.5*view_time)
                .attr("fill-opacity","1")
        }
        else
        {
            this.g_court.selectAll("rect")
                .data(datay)
                .enter().append("rect")
                .attr("y",function (d,i) {
                    return (num*0.08+height_smallfield/10*(i)+0.01)*height;
                })
                .attr("x",x_smallfield*width)
                .attr("width",function (d) {
                    return (d/6)*width_smallfield*width;
                })
                .attr("height",height_smallfield/10*height)
                .attr("fill","steelblue")
                .attr("opacity","0")
                .attr("stroke","steelblue")
                .transition()
                .duration(0.5*view_time)
                .delay(2.5*view_time)
                .attr("opacity","0.5")
            // this.g_court.selectAll("text")
            //     .data(datay)
            //     .enter().append("text")
            //     .attr("x",0.84*width)
            //     .attr("y",function (d,i) {
            //             return (num*0.08+0.007*i+0.01)*height;
            //         }
            //     )
            //     .attr("font-size","60%")
            //     .html(function (d) {
            //         return d;
            //     })
        }
    }
}
matchinfo.prototype.proj_move = function (X)  {
    for(var num=0;num<this.data.length;num++) {
        var name = "#g_sequence" + (num + 1);
        var name1 = "#smallfield" + num
        var rect=d3.select("#Sequence").select(name).selectAll("#rect_g")
        d3.select("#Sequence").select(name).select(name1).transition().duration(view_time / 5).delay(0).remove();
    }
}
matchinfo.prototype.distancealign =function () {
    width=this.width;
    height=this.height;

    for(var num=0;num<this.data.length;num++) {
        var name = "#g_sequence" + (num + 1);
        var g_sequence = d3.select("#Sequence").select(name)
        var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield",0,0,0);
        var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
        min=phase_small.nodes[0].x;
        for(var j=0;j<phase_small.nodes.length;j++)
        {
            if(phase_small.nodes[j].x<min) min=phase_small.nodes[j].x;
        }
        this.g_align=g_sequence.append("g")
            .attr("id",function () {
                return "align_g"+num
            })
        this.g_align.append("rect")
            .attr("id","align_g")
            .attr("x",(0.83+min/100*0.16)*width)
            .attr("y",(num*0.05+0.01)*height)
            .attr("width",(100-min)/100*0.16*width)
            .attr("height",0.02*height)
            .attr("fill","none")
            .attr("stroke","none")
            .attr("stroke-width","1px")
            .attr("fill-opacity",1)
            .transition().duration(0.3*view_time).delay(2.7*view_time)
            .attr("stroke","black")
            .attr("fill","white")
        this.g_align.selectAll("circle")
            .data(phase_small.links)
            .enter().append("circle")
            .transition().duration(0).delay(2*view_time)
            .attr("r",0.005*height)
            .attr("id",function (d,i) {
                return "align_circle"+i;
            })
            .attr("cx",function (d,i) {
                return (0.83+0.005*i)*width
            })
            .attr("cy",(num*0.05+0.02)*height)
            .attr("fill",function (d,i) {
                return getEventColor(d.eid)
            })
            .transition().duration(0.5*view_time).delay(0)
            .attr("cx",function (d) {
                return ((phase_small.nodes[d.source].x/100)*0.16+0.83)*width
            })
            .attr("cy",function () {
                return (num*0.05+0.02)*height
            })
            .attr("r",0.0045*height)
        g_sequence.select("#smallfield").remove()
    }
}
matchinfo.prototype.timealign =function () {
    width=this.width;
    height=this.height;

    for(var num=0;num<this.data.length;num++) {
        var name = "#g_sequence" + (num + 1);
        var g_sequence = d3.select("#Sequence").select(name)
        var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield",0,0,0);
        var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
        var len=phase_small.nodes.length;
        var max=(phase_small.nodes[len-1].time.min-phase_small.nodes[0].time.min)*60+phase_small.nodes[len-1].time.sec-phase_small.nodes[0].time.sec
        var len =max;
        if(max==0) max=1;
        if(max>40) len=40
        this.g_align=g_sequence.append("g")
            .attr("id",function () {
                return "align_g"+num
            })
            // .attr("transform",function (d,i) {
            //     return "translate("+(0.83)*width+","+(num*0.05+0.015)*height+")"
            // })
            .attr("x",0.83*width)
            .attr("y",(num*0.05+0.01)*height)
        this.g_align.append("rect")
            .attr("id","align_g")
            // .attr("transform",function () {
            //     return "translate("+(0.83)*width+","+0+")"
            // })
            .attr("x",0.83*width)
            .attr("y",(num*0.05+0.01)*height)
            .attr("width",(0.004*len)*width)
            .attr("height",0.02*height)
            .attr("fill","none")
            .attr("stroke","none")
            .attr("stroke-width","1px")
            .attr("fill-opacity",1)
            .transition().duration(0.5*view_time).delay(2.5*view_time)
            .attr("stroke","black")
            .attr("fill","white")
        this.g_align.selectAll("circle")
            .data(phase_small.links)
            .enter().append("circle")
            .transition().duration(0).delay(2*view_time)
            .attr("id",function (d,i) {
                return "align_circle"+i;
            })
            .attr("r",0.005*height)
            // .attr("transform",function (d,i) {
            //     return "translate("+(0.005*i)*width+","+0+")"
            // })
            .attr("cx",function (d,i) {
                return (0.83)*width+0.005*i*height
            })
            .attr("cy",(num*0.05+0.02)*height)
            .attr("fill",function (d,i) {
                return getEventColor(d.eid)
            })
            .transition().duration(0.5*view_time).delay(0)
            .attr("r",0.0045*height)
            .attr("cx",function (d) {
                var t=(phase_small.nodes[d.source].time.min-phase_small.nodes[0].time.min)*60+phase_small.nodes[d.source].time.sec-phase_small.nodes[0].time.sec
                return (t/max*0.004*len+0.83)*width
            })
        var s= "#smallfield"+num
        g_sequence.select("#smallfield").remove()
    }
}
matchinfo.prototype.point =function () {
    width=this.width;
    height=this.height;

    for(var num=0;num<this.data.length;num++) {
        var name = "#g_sequence" + (num + 1);
        var g_sequence = d3.select("#Sequence").select(name)
        var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield"+num,0,0,1);
        g_sequence.append("rect")
            .attr("id","rect_g")
            .attr("x",x_smallfield*width)
            .attr("y",(num*0.08+0.01)*height)
            .attr("width",width_smallfield*width)
            .attr("height",height_smallfield*height)
            .attr("fill","gray")
            .attr("fill-opacity","0")
        var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
        phase_small.draw_node("node",2,"black",2);
    }
}
matchinfo.prototype.point_move =function ()
{
    for(var num=0;num<this.data.length;num++) {
        var name = "#g_sequence" + (num + 1);
        var name1="#smallfield"+num
        d3.select("#Sequence").select(name).selectAll("#rect_g").transition().duration(view_time/5).delay(0).remove();
        d3.select("#Sequence").select(name).select(name1).transition().duration(view_time/5).delay(0).remove();
    }
}
matchinfo.prototype.mark =function () {
    width=this.width;
    height=this.height;

    for(var num=0;num<this.data.length;num++) {
        var name = "#g_sequence" + (num + 1);
        var g_sequence = d3.select("#Sequence").select(name)
        var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield"+num,0,0,1);
        g_sequence.append("rect")
            .attr("id","rect_g")
            .attr("x",x_smallfield*width)
            .attr("y",(num*0.08+0.01)*height)
            .attr("width",width_smallfield*width)
            .attr("height",height_smallfield*height)
            .attr("fill","gray")
            .attr("fill-opacity","0")
        var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
        phase_small.draw_path("link",1,2)
        phase_small.draw_node("node",2,"black",2);
    }
}
matchinfo.prototype.point_link =function () {
    width=this.width;
    height=this.height;

    for(var num=0;num<this.data.length;num++) {
        var name = "#g_sequence" + (num + 1);
        var g_sequence = d3.select("#Sequence").select(name)
        var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield"+num,0,0,1);
        g_sequence.append("rect")
            .attr("id","rect_g")
            .attr("x",x_smallfield*width)
            .attr("y",(num*0.08+0.01)*height)
            .attr("width",width_smallfield*width)
            .attr("height",height_smallfield*height)
            .attr("fill","gray")
            .attr("fill-opacity","0")
        var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
        phase_small.draw_path("link",0, 2)
        phase_small.draw_node("node",2,"black",2);
    }
}
matchinfo.prototype.worm =function () {
    width=this.width;
    height=this.height;

    for(var num=0;num<this.data.length;num++) {
        var name = "#g_sequence" + (num + 1);
        var g_sequence = d3.select("#Sequence").select(name)
        var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield"+num,0,0,1);
        g_sequence.append("rect")
            .attr("id","rect_g")
            .attr("x",x_smallfield*width)
            .attr("y",(num*0.08+0.01)*height)
            .attr("width",width_smallfield*width)
            .attr("height",height_smallfield*height)
            .attr("fill","gray")
            .attr("fill-opacity","0")
        var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
        phase_small.draw_path("link",1,2)
        phase_small.draw_node("node",0,"black",2);
    }
}
matchinfo.prototype.clear = function (type,oldtype) {
    width=this.width;
    height=this.height;

    for(var num=0;num<this.data.length;num++) {
        var name = "#g_sequence" + (num + 1);
        var name1 = "#smallfield" + num
        var g_sequence=d3.select(name)
        var name2 ="#g_arc"+num
        var arc_g = d3.select("#Sequence").select(name).select(name2)
        var rect_g = d3.select("#Sequence").select(name).selectAll("#rect_g")
        var align_g = d3.select("#Sequence").select(name).selectAll("#align_g")
        var g_proj = d3.select("#Sequence").select(name).selectAll("#g_proj")
        var field = d3.select("#Sequence").select(name).select(name1)
        var nodes = d3.select("#Sequence").select(name).select(name1).select("#node_container");
        var paths = d3.select("#Sequence").select(name).select(name1).select("#path_container")
        if (oldtype < 4 && oldtype >= 0) {
            if(paths != null)
            {
                console.log("paths")
                paths.transition().delay(0).duration(0.5*view_time).remove();
            }
            rect_g.remove();
            if (type < 4) {
                if (nodes != null) {
                    console.log("nodes", nodes);
                    nodes.selectAll(".node").transition().duration(0.8 * view_time).delay(0.2 * view_time)
                        .attr("opacity", 0)
                }
                if (paths != null) {

                    console.log("paths", paths);
                    paths.transition().duration(0.8 * view_time).delay(0.2 * view_time)
                        .attr("opacity", 0)
                }
                field.selectAll(".fieldLines").transition().duration(view_time).delay(view_time).attr("opacity", 0)
                field.selectAll(".fieldRect").transition().duration(view_time).delay(view_time).attr("opacity", 0)
                field.transition().delay(2*view_time).duration(0).remove()
            }
            else if (type == 4) {
                field.selectAll(".fieldLines").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                field.selectAll(".fieldRect").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                nodes.selectAll(".node").transition().duration(0.8 * view_time).delay(0.2 * view_time)
                    .attr("transform", function () {
                        var x = d3.select(this).attr("x")
                        console.log("x", this)

                        return "translate(" + x + "," + 0 + ")"
                    })
                    .transition().duration(view_time).delay(0)
                    .attr('opacity', 0)
                field.transition().delay(2*view_time).duration(0).remove()
            }
            else if (type == 5) {
                field.selectAll(".fieldLines").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                field.selectAll(".fieldRect").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                nodes.selectAll(".node").transition().duration(0.8 * view_time).delay(0.2 * view_time)
                    .attr("transform", function () {
                        var y = d3.select(this).attr("y")
                        console.log("y", this)

                        return "translate(" + 0 + "," + y + ")"
                    })
                    .transition().duration(view_time).delay(0)
                    .attr('opacity', 0)
                field.transition().delay(2*view_time).duration(0).remove()
            }
            else if (type == 6) {
                field.selectAll(".fieldLines").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                field.selectAll(".fieldRect").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                if (nodes != null) {
                    nodes.selectAll(".node").select("circle").attr("r", 2).transition().duration(0.5 * view_time).delay(0.2 * view_time).attr("r", 0.003 * height);
                    field.transition().duration(0.3 * view_time).delay(0.7 * view_time)
                        .attr("transform", function () {
                            var id = parseInt(d3.select(this).attr("id").substring(10))
                            var y = (id * 0.05 + 0.02) * height
                            return "translate(" + 0.83 * width + "," + y + ")"
                        })
                        .select("#node_container")
                        .selectAll(".node")
                        .transition().duration(0.8* view_time).delay(0)
                        .attr("transform", function () {
                            var y = d3.select(this).attr("y")
                            var id = parseInt(d3.select(this).attr("id").substring(4))
                            console.log("ybb")
                            return "translate(" + id * 0.005 * height + "," + 0 + ")"
                        })
                        .transition().duration(0.8*view_time).delay(0)
                        .attr('opacity', 0)
                }
                if (paths != null) {
                    paths.transition().duration(0.1 * view_time).delay(0.2 * view_time)
                        .attr("opacity", 0)
                }
                field.transition().delay(2*view_time).duration(0).remove()
            }

            else if (type == 7) {
                field.selectAll(".fieldLines").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                field.selectAll(".fieldRect").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                if (nodes != null) {
                    nodes.selectAll(".node").select("circle").attr("r", 2).transition().duration(0.5 * view_time).delay(0.2 * view_time).attr("r", 0.003 * height);
                    field.transition().duration(0.3 * view_time).delay(0.7 * view_time)
                        .attr("transform", function () {
                            var id = parseInt(d3.select(this).attr("id").substring(10))
                            var y = (id * 0.05 + 0.015) * height
                            return "translate(" + 0.83 * width + "," + y + ")"
                        })
                        .select("#node_container")
                        .selectAll(".node")
                        .transition().duration(0.8 * view_time).delay(0)
                        .attr("transform", function () {
                            var y = d3.select(this).attr("y")
                            var id = parseInt(d3.select(this).attr("id").substring(4))
                            console.log("ybb")
                            return "translate(" + id * 0.003 * height + "," + 0 + ")"
                        })
                        .transition().duration(view_time).delay(view_time)
                        .attr('opacity', 0)
                }
                if (paths != null) {
                    paths.transition().duration(0.1 * view_time).delay(0.2 * view_time)
                        .attr("opacity", 0)
                }
                field.transition().delay(2*view_time).duration(0).remove()
            }
            else
            {
                field.selectAll(".fieldLines").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                field.selectAll(".fieldRect").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                if (nodes != null) {
                    nodes.selectAll(".node").select("circle").attr("r", 2).transition().duration(0.5 * view_time).delay(0.2 * view_time).attr("r", 0.003 * height);
                    field.transition().duration(0.3 * view_time).delay(0.7 * view_time)
                        .attr("transform", function () {
                            var id = parseInt(d3.select(this).attr("id").substring(10))
                            var y = (id * 0.05 + 0.015) * height
                            return "translate(" + 0.83 * width + "," + y + ")"
                        })
                        .select("#node_container")
                        .selectAll(".node")
                        .transition().duration(0.8 * view_time).delay(0)
                        .attr("transform", function () {
                            var y = d3.select(this).attr("y")
                            var id = parseInt(d3.select(this).attr("id").substring(4))
                            return "translate(" + id * 0.003 * height + "," + 0 + ")"
                        })
                        .transition().duration(view_time).delay(view_time)
                        .attr('opacity', 0)
                }
                if (paths != null) {
                    paths.transition().duration(0.1 * view_time).delay(0.2 * view_time)
                        .attr("opacity", 0)
                }
                field.transition().delay(2*view_time).duration(0).remove()
            }
        }
        else if(oldtype==4)
        {
            rect_g.transition().delay(0).duration(0.5*view_time).remove()
            g_proj.transition().delay(0).duration(0.5*view_time).remove()
            // if(paths != null)
            // {
            //     console.log("paths")
            //     paths.transition().delay(0).duration(0.5*view_time).remove();
            // }
            if(type<4)
            {
                var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
                field.selectAll(".fieldLines").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                field.selectAll(".fieldRect").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                g_proj.transition().duration(0.2*view_time).delay(0).attr("opacity",0);
                field.append("g").attr("id","000").selectAll("circle")
                    .data(phase_small.nodes)
                    .enter().append("circle")
                    .attr("r",0.003*height)
                    .attr("transform",function (d,i) {
                        return "translate("+d.x/100*width_smallfield*width+","+0+")"
                    })
                    .attr("fill",function (d) {
                        return getEventColor(d.eid)
                    })
                    .attr("opacity",0)
                    .transition().duration(view_time).delay(0.2*view_time)
                    .attr("opacity",1)
                    .transition().duration(view_time).delay(0)
                    .attr("transform",function (d,i) {
                        return "translate(" + d.x / 100 * width_smallfield * width + "," + d.y/100* height_smallfield *height + ")"
                    })
                field.transition().delay(3*view_time).duration(0).remove();
                g_sequence.selectAll("#smallfield_remove").transition().delay(3*view_time).duration(0).remove()
            }
            else if(type==5)
            {
                var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
                field.selectAll(".fieldLines").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                field.selectAll(".fieldRect").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                g_proj.transition().duration(0.2*view_time).delay(0).attr("opacity",0);
                field.append("g").attr("id","000").selectAll("circle")
                    .data(phase_small.nodes)
                    .enter().append("circle")
                    .attr("r",0.003*height)
                    .attr("transform",function (d,i) {
                        return "translate("+d.x/100*width_smallfield*width+","+0+")"
                    })
                    .attr("fill",function (d) {
                        return getEventColor(d.eid)
                    })
                    .attr("opacity",0)
                    .transition().duration(view_time).delay(0.2*view_time)
                    .attr("opacity",1)
                    .transition().duration(view_time).delay(0)
                    .attr("transform",function (d,i) {
                        return "translate(" + 0 + "," + d.y/100* height_smallfield *height + ")"
                    })
                field.transition().delay(2.5*view_time).duration(0).remove();
                g_sequence.selectAll("#smallfield_remove").transition().delay(2.5*view_time).duration(0).remove()
            }
            else if(type==6)
            {
                var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
                field.selectAll(".fieldLines").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                field.selectAll(".fieldRect").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                g_proj.transition().duration(0.2*view_time).delay(0).attr("opacity",0);
                field.append("g").attr("id","gid").selectAll("circle")
                    .data(phase_small.nodes)
                    .enter().append("circle")
                    .attr("id",function (d,i) {
                        return i;
                    })
                    .attr("r",0.003*height)
                    // .attr("cx",function (d,i) {
                    //     return (d.x/100*width_smallfield+x_smallfield)*width
                    // })
                    // .attr("cy",function () {
                    //     return (num*0.08+0.01)*height
                    // })
                    .attr("transform",function (d,i) {
                        return "translate("+d.x/100*width_smallfield*width+","+0+")"
                    })
                    .attr("fill",function (d) {
                        return getEventColor(d.eid)
                    })
                    .attr("opacity",0)
                    .transition().duration(0.8*view_time).delay(0.2*view_time)
                    .attr("opacity",1)
                    .transition().duration(view_time).delay(0)
                    .attr("transform",function () {
                        var id=parseInt(d3.select(this).attr("id"))
                        console.log("id",id)
                        return "translate("+id*0.005*height+","+0+")"
                    })
                    .attr("r",0.005*height)

                field.transition().duration(0.5*view_time).delay(view_time).attr("transform",function () {
                    return "translate("+0.83*width+","+(num*0.05+0.01)*height+")"
                })
                field.select("#gid").selectAll("cirlce")
                    .transition().duration(0.5*view_time).delay(0)
                    .attr("transform",function () {
                        var id=parseInt(d3.select(this).attr("id"))
                        console.log("id",id)
                        return "translate("+id*0.003*height+","+0+")"
                    })
                field.transition().duration(0).delay(2*view_time).remove()
                g_sequence.selectAll("#smallfield_remove").transition().delay(2*view_time).duration(0).remove()
            }
            else if(type==7)
            {
                var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
                field.selectAll(".fieldLines").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                field.selectAll(".fieldRect").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                g_proj.transition().duration(0.2*view_time).delay(0).attr("opacity",0);
                field.append("g").attr("id","gid").selectAll("circle")
                    .data(phase_small.nodes)
                    .enter().append("circle")
                    .attr("id",function (d,i) {
                        return i;
                    })
                    .attr("r",0.003*height)
                    .attr("transform",function (d,i) {
                        return "translate("+d.x/100*width_smallfield*width+","+0+")"
                    })
                    .attr("fill",function (d) {
                        return getEventColor(d.eid)
                    })
                    .attr("opacity",0)
                    .transition().duration(0.8*view_time).delay(0.2*view_time)
                    .attr("opacity",1)
                    .transition().duration(view_time).delay(0)
                    .attr("transform",function () {
                        var id=parseInt(d3.select(this).attr("id"))
                        console.log("id",id)
                        return "translate("+id*0.005*height+","+0+")"
                    })
                    .attr("r",0.005*height)

                field.transition().duration(0.5*view_time).delay(view_time).attr("transform",function () {
                    return "translate("+0.83*width+","+(num*0.05+0.01)*height+")"
                })
                field.select("#gid").selectAll("cirlce")
                    .transition().duration(0.5*view_time).delay(0)
                    .attr("transform",function () {
                        var id=parseInt(d3.select(this).attr("id"))
                        console.log("id",id)
                        return "translate("+id*0.003*height+","+0+")"
                    })
                field.transition().duration(0).delay(2*view_time).remove()
                g_sequence.selectAll("#smallfield_remove").transition().delay(2*view_time).duration(0).remove()
            }
            else if(type==8)
            {
                var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
                field.selectAll(".fieldLines").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                field.selectAll(".fieldRect").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                g_proj.transition().duration(0.2*view_time).delay(0).attr("opacity",0);
                field.append("g").attr("id","gid").selectAll("circle")
                    .data(phase_small.nodes)
                    .enter().append("circle")
                    .attr("id",function (d,i) {
                        return i;
                    })
                    .attr("r",0.003*height)
                    .attr("transform",function (d,i) {
                        return "translate("+d.x/100*width_smallfield*width+","+0+")"
                    })
                    .attr("fill",function (d) {
                        return getEventColor(d.eid)
                    })
                    .attr("opacity",0)
                    .transition().duration(0.8*view_time).delay(0.2*view_time)
                    .attr("opacity",1)
                    .transition().duration(view_time).delay(0)
                    .attr("transform",function () {
                        var id=parseInt(d3.select(this).attr("id"))
                        console.log("id",id)
                        return "translate("+id*0.005*height+","+0+")"
                    })
                    .attr("r",0.005*height)

                field.transition().duration(0.5*view_time).delay(view_time).attr("transform",function () {
                    return "translate("+0.83*width+","+(num*0.05+0.01)*height+")"
                })
                field.select("#gid").selectAll("cirlce")
                    .transition().duration(0.5*view_time).delay(0)
                    .attr("transform",function () {
                        var id=parseInt(d3.select(this).attr("id"))
                        console.log("id",id)
                        return "translate("+id*0.003*height+","+0+")"
                    })
                field.transition().duration(0).delay(2*view_time).remove()
                g_sequence.selectAll("#smallfield_remove").transition().delay(2*view_time).duration(0).remove()
            }
        }
        else if(oldtype==5)
        {
            rect_g.transition().delay(0).duration(0.5*view_time).remove()
            g_proj.transition().delay(0).duration(0.5*view_time).remove()
            if(type<4)
            {
                var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
                field.selectAll(".fieldLines").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                field.selectAll(".fieldRect").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                g_proj.transition().duration(0.2*view_time).delay(0).attr("opacity",0);
                field.append("g").attr("id","000").selectAll("circle")
                    .data(phase_small.nodes)
                    .enter().append("circle")
                    .attr("r",0.003*height)
                    .attr("transform",function (d,i) {
                        return "translate("+0+","+d.y/100*height_smallfield*height+")"
                    })
                    .attr("fill",function (d) {
                        return getEventColor(d.eid)
                    })
                    .attr("opacity",0)
                    .transition().duration(view_time).delay(0.2*view_time)
                    .attr("opacity",1)
                    .transition().duration(view_time).delay(0)
                    .attr("transform",function (d,i) {
                        return "translate(" + d.x / 100 * width_smallfield * width + "," + d.y/100* height_smallfield *height + ")"
                    })
                field.transition().delay(3*view_time).duration(0).remove();
                g_sequence.selectAll("#smallfield_remove").transition().delay(3*view_time).duration(0).remove()
            }
            else if(type==4)
            {
                var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
                field.selectAll(".fieldLines").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                field.selectAll(".fieldRect").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                g_proj.transition().duration(0.2*view_time).delay(0).attr("opacity",0);
                field.append("g").attr("id","000").selectAll("circle")
                    .data(phase_small.nodes)
                    .enter().append("circle")
                    .attr("r",0.003*height)
                    .attr("transform",function (d,i) {
                        return "translate(" + 0 + "," + d.y/100* height_smallfield *height + ")"
                    })
                    .attr("fill",function (d) {
                        return getEventColor(d.eid)
                    })
                    .attr("opacity",0)
                    .transition().duration(view_time).delay(0.2*view_time)
                    .attr("opacity",1)
                    .transition().duration(view_time).delay(0)
                    .attr("transform",function (d,i) {
                        return "translate("+d.x/100*width_smallfield*width+","+0+")"
                    })
                field.transition().delay(2.5*view_time).duration(0).remove();
                g_sequence.selectAll("#smallfield_remove").transition().delay(2.5*view_time).duration(0).remove()
            }
            else if(type==6)
            {
                var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
                field.selectAll(".fieldLines").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                field.selectAll(".fieldRect").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                g_proj.transition().duration(0.2*view_time).delay(0).attr("opacity",0);
                field.append("g").attr("id","gid").selectAll("circle")
                    .data(phase_small.nodes)
                    .enter().append("circle")
                    .attr("id",function (d,i) {
                        return i;
                    })
                    .attr("r",0.003*height)
                    // .attr("cx",function (d,i) {
                    //     return (d.x/100*width_smallfield+x_smallfield)*width
                    // })
                    // .attr("cy",function () {
                    //     return (num*0.08+0.01)*height
                    // })
                    .attr("transform",function (d,i) {
                        return "translate(" + 0 + "," + d.y/100* height_smallfield *height + ")"
                    })
                    .attr("fill",function (d) {
                        return getEventColor(d.eid)
                    })
                    .attr("opacity",0)
                    .transition().duration(0.8*view_time).delay(0.2*view_time)
                    .attr("opacity",1)
                    .transition().duration(view_time).delay(0)
                    .attr("transform",function () {
                        var id=parseInt(d3.select(this).attr("id"))
                        console.log("id",id)
                        return "translate("+id*0.005*height+","+0+")"
                    })
                    .attr("r",0.005*height)

                field.transition().duration(0.5*view_time).delay(view_time).attr("transform",function () {
                    return "translate("+0.83*width+","+(num*0.05+0.01)*height+")"
                })
                field.select("#gid").selectAll("cirlce")
                    .transition().duration(0.5*view_time).delay(0)
                    .attr("transform",function () {
                        var id=parseInt(d3.select(this).attr("id"))
                        console.log("id",id)
                        return "translate("+id*0.003*height+","+0+")"
                    })
                field.transition().duration(0).delay(2*view_time).remove()
                g_sequence.selectAll("#smallfield_remove").transition().delay(2*view_time).duration(0).remove()
            }
            else if(type==7)
            {
                var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
                field.selectAll(".fieldLines").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                field.selectAll(".fieldRect").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                g_proj.transition().duration(0.2*view_time).delay(0).attr("opacity",0);
                field.append("g").attr("id","gid").selectAll("circle")
                    .data(phase_small.nodes)
                    .enter().append("circle")
                    .attr("id",function (d,i) {
                        return i;
                    })
                    .attr("r",0.003*height)
                    .attr("transform",function (d,i) {
                        return "translate(" + 0 + "," + d.y/100* height_smallfield *height + ")"
                    })
                    .attr("fill",function (d) {
                        return getEventColor(d.eid)
                    })
                    .attr("opacity",0)
                    .transition().duration(0.8*view_time).delay(0.2*view_time)
                    .attr("opacity",1)
                    .transition().duration(view_time).delay(0)
                    .attr("transform",function () {
                        var id=parseInt(d3.select(this).attr("id"))
                        console.log("id",id)
                        return "translate("+id*0.005*height+","+0+")"
                    })
                    .attr("r",0.005*height)

                field.transition().duration(0.5*view_time).delay(view_time).attr("transform",function () {
                    return "translate("+0.83*width+","+(num*0.05+0.01)*height+")"
                })
                field.select("#gid").selectAll("cirlce")
                    .transition().duration(0.5*view_time).delay(0)
                    .attr("transform",function () {
                        var id=parseInt(d3.select(this).attr("id"))
                        console.log("id",id)
                        return "translate("+id*0.003*height+","+0+")"
                    })
                field.transition().duration(0).delay(2*view_time).remove()
                g_sequence.selectAll("#smallfield_remove").transition().delay(2*view_time).duration(0).remove()
            }
            else if(type==8)
            {
                var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
                field.selectAll(".fieldLines").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                field.selectAll(".fieldRect").transition().duration(0.2 * view_time).delay(10).attr("opacity", 0)
                g_proj.transition().duration(0.2*view_time).delay(0).attr("opacity",0);
                field.append("g").attr("id","gid").selectAll("circle")
                    .data(phase_small.nodes)
                    .enter().append("circle")
                    .attr("id",function (d,i) {
                        return i;
                    })
                    .attr("r",0.003*height)
                    .attr("transform",function (d,i) {
                        return "translate(" + 0 + "," + d.y/100* height_smallfield *height + ")"
                    })
                    .attr("fill",function (d) {
                        return getEventColor(d.eid)
                    })
                    .attr("opacity",0)
                    .transition().duration(0.8*view_time).delay(0.2*view_time)
                    .attr("opacity",1)
                    .transition().duration(view_time).delay(0)
                    .attr("transform",function () {
                        var id=parseInt(d3.select(this).attr("id"))
                        console.log("id",id)
                        return "translate("+id*0.005*height+","+0+")"
                    })
                    .attr("r",0.005*height)

                field.transition().duration(0.5*view_time).delay(view_time).attr("transform",function () {
                    return "translate("+0.83*width+","+(num*0.05+0.01)*height+")"
                })
                field.select("#gid").selectAll("cirlce")
                    .transition().duration(0.5*view_time).delay(0)
                    .attr("transform",function () {
                        var id=parseInt(d3.select(this).attr("id"))
                        console.log("id",id)
                        return "translate("+id*0.003*height+","+0+")"
                    })
                field.transition().duration(0).delay(2*view_time).remove()
                g_sequence.selectAll("#smallfield_remove").transition().delay(2*view_time).duration(0).remove()
            }
        }
        else if(oldtype==6 )
        {
            if(type<6)
            {
                align_g.select("#align_g").transition().delay(0).duration(0.5*view_time).attr("opacity",0)
                align_g.selectAll("circle")
                    .transition().delay(0.3*view_time).duration(0.2*view_time)
                    .attr("cx",function () {
                        var id = parseInt(d3.select(this).attr("id").substring(12))
                        return (x_smallfield)*width+0.005*height*id
                    })
                    .transition().delay(0.1*view_time).duration(0.5*view_time)
                    .attr("cx",function () {
                        var id = parseInt(d3.select(this).attr("id").substring(12))
                        return (x_smallfield)*width+0.005*height*id
                    })
                    .attr("cy",(num*0.08+0.01)*height)
                    .transition().delay(0.5*view_time).duration(0.5*view_time)
                    .attr("opacity",0)
            }

            if(type<4)
            {
                var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
                align_g.append("g").selectAll("circle")
                    .data(phase_small.nodes)
                    .enter().append("circle")
                    .attr("r",0.005*height)
                    .attr("fill",function (d) {
                        return getEventColor(d.eid)
                    })
                    .attr("cx",function (d,i) {
                        return (x_smallfield)*width+0.005*height*i
                    })
                    .attr("cy",(num*0.08+0.01)*height)
                    .attr("opacity",0)
                    .transition().delay(view_time).duration(0)
                    .attr("opacity",1)
                    .transition().delay(0.5*view_time).duration(0.5*view_time)
                    .attr("cx",function (d,i) {
                        return (x_smallfield+d.x/100*width_smallfield)*width
                    })
                    .attr("cy",function (d,i) {
                        return (num*0.08+0.01+d.y/100*height_smallfield)*height
                    })
                    .attr("r",0.003*height)
                d3.select("#smallfield_remove").transition().delay(2*view_time).duration(0).remove()
            }
            else if(type==4)
            {
                var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
                align_g.append("g").selectAll("circle")
                    .data(phase_small.nodes)
                    .enter().append("circle")
                    .attr("r",0.005*height)
                    .attr("fill",function (d) {
                        return getEventColor(d.eid)
                    })
                    .attr("cx",function (d,i) {
                        return (x_smallfield)*width+0.005*height*i
                    })
                    .attr("cy",(num*0.08+0.01)*height)
                    .attr("opacity",0)
                    .transition().delay(view_time).duration(0)
                    .attr("opacity",1)
                    .transition().delay(0.5*view_time).duration(0.5*view_time)
                    .attr("cx",function (d,i) {
                        return (x_smallfield+d.x/100*width_smallfield)*width
                    })
                    .attr("cy",function (d,i) {
                        return (num*0.08+0.01)*height
                    })
                    .attr("r",0.003*height)
                    .transition().delay(0).duration(0.5*view_time)
                    .attr("opacity",0)
                d3.select("#smallfield_remove").transition().delay(2*view_time).duration(0).remove()
            }
            else if(type==5)
            {
                var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
                align_g.append("g").selectAll("circle")
                    .data(phase_small.nodes)
                    .enter().append("circle")
                    .attr("r",0.005*height)
                    .attr("fill",function (d) {
                        return getEventColor(d.eid)
                    })
                    .attr("cx",function (d,i) {
                        return (x_smallfield)*width+0.005*height*i
                    })
                    .attr("cy",(num*0.08+0.01)*height)
                    .attr("opacity",0)
                    .transition().delay(view_time).duration(0)
                    .attr("opacity",1)
                    .transition().delay(0.5*view_time).duration(0.5*view_time)
                    .attr("cx",function (d,i) {
                        return (x_smallfield)*width
                    })
                    .attr("cy",function (d,i) {
                        return (num*0.08+0.01+d.y/100*height_smallfield)*height
                    })
                    .attr("r",0.003*height)
                    .transition().delay(0).duration(0.5*view_time)
                    .attr("opacity",0)
                d3.select("#smallfield_remove").transition().delay(2*view_time).duration(0).remove()
            }
            else if(type==7)
            {
                align_g.select("#align_g").transition().delay(0).duration(0.5*view_time).attr("opacity",0)
                align_g.selectAll("circle")
                    .transition().delay(0.5*view_time).duration(0.5*view_time)
                    .attr("cx",function () {
                        var id = parseInt(d3.select(this).attr("id").substring(12))
                        return (0.83+0.005*id)*width
                    })
                    .attr("r",0.005*height)
                    .transition().delay(1*view_time).duration(0)
                    .attr("opacity",0)
            }
            else
            {
                align_g.select("#align_g").transition().delay(0).duration(0.5*view_time).attr("opacity",0)
                align_g.selectAll("circle")
                    .transition().delay(0.5*view_time).duration(0.5*view_time)
                    .attr("cx",function () {
                        var id = parseInt(d3.select(this).attr("id").substring(12))
                        return (0.83+0.005*id)*width
                    })
                    .attr("r",0.005*height)
                    .transition().delay(1*view_time).duration(0)
                    .attr("opacity",0)
            }
            align_g.transition().delay(3*view_time).duration(0).remove()


        }
        else if(oldtype==7)
        {
            if(type<6)
            {
                align_g.select("#align_g").transition().delay(0).duration(0.5*view_time).attr("opacity",0)
                align_g.selectAll("circle")
                    .transition().delay(0.3*view_time).duration(0.2*view_time)
                    .attr("cx",function () {
                        var id = parseInt(d3.select(this).attr("id").substring(12))
                        return (x_smallfield)*width+0.005*height*id
                    })
                    .transition().delay(0.1*view_time).duration(0.5*view_time)
                    .attr("cx",function () {
                        var id = parseInt(d3.select(this).attr("id").substring(12))
                        return (x_smallfield)*width+0.005*height*id
                    })
                    .attr("cy",(num*0.08+0.01)*height)
                    .transition().delay(0.5*view_time).duration(0.5*view_time)
                    .attr("opacity",0)
            }

            if(type<4)
            {
                var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
                align_g.append("g").selectAll("circle")
                    .data(phase_small.nodes)
                    .enter().append("circle")
                    .attr("r",0.005*height)
                    .attr("fill",function (d) {
                        return getEventColor(d.eid)
                    })
                    .attr("cx",function (d,i) {
                        return (x_smallfield)*width+0.005*height*i
                    })
                    .attr("cy",(num*0.08+0.01)*height)
                    .attr("opacity",0)
                    .transition().delay(view_time).duration(0)
                    .attr("opacity",1)
                    .transition().delay(0.5*view_time).duration(0.5*view_time)
                    .attr("cx",function (d,i) {
                        return (x_smallfield+d.x/100*width_smallfield)*width
                    })
                    .attr("cy",function (d,i) {
                        return (num*0.08+0.01+d.y/100*height_smallfield)*height
                    })
                    .attr("r",0.003*height)
                d3.select("#smallfield_remove").transition().delay(2*view_time).duration(0).remove()
            }
            else if(type==4)
            {
                var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
                align_g.append("g").selectAll("circle")
                    .data(phase_small.nodes)
                    .enter().append("circle")
                    .attr("r",0.005*height)
                    .attr("fill",function (d) {
                        return getEventColor(d.eid)
                    })
                    .attr("cx",function (d,i) {
                        return (x_smallfield)*width+0.005*height*i
                    })
                    .attr("cy",(num*0.08+0.01)*height)
                    .attr("opacity",0)
                    .transition().delay(view_time).duration(0)
                    .attr("opacity",1)
                    .transition().delay(0.5*view_time).duration(0.5*view_time)
                    .attr("cx",function (d,i) {
                        return (x_smallfield+d.x/100*width_smallfield)*width
                    })
                    .attr("cy",function (d,i) {
                        return (num*0.08+0.01)*height
                    })
                    .attr("r",0.003*height)
                    .transition().delay(0).duration(0.5*view_time)
                    .attr("opacity",0)
                d3.select("#smallfield_remove").transition().delay(2*view_time).duration(0).remove()
            }
            else if(type==5)
            {
                var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
                align_g.append("g").selectAll("circle")
                    .data(phase_small.nodes)
                    .enter().append("circle")
                    .attr("r",0.005*height)
                    .attr("fill",function (d) {
                        return getEventColor(d.eid)
                    })
                    .attr("cx",function (d,i) {
                        return (x_smallfield)*width+0.005*height*i
                    })
                    .attr("cy",(num*0.08+0.01)*height)
                    .attr("opacity",0)
                    .transition().delay(view_time).duration(0)
                    .attr("opacity",1)
                    .transition().delay(0.5*view_time).duration(0.5*view_time)
                    .attr("cx",function (d,i) {
                        return (x_smallfield)*width
                    })
                    .attr("cy",function (d,i) {
                        return (num*0.08+0.01+d.y/100*height_smallfield)*height
                    })
                    .attr("r",0.003*height)
                    .transition().delay(0).duration(0.5*view_time)
                    .attr("opacity",0)
                d3.select("#smallfield_remove").transition().delay(2*view_time).duration(0).remove()
            }
            else if(type==6)
            {
                align_g.select("#align_g").transition().delay(0).duration(0.5*view_time).attr("opacity",0)
                align_g.selectAll("circle")
                    .transition().delay(0.5*view_time).duration(0.5*view_time)
                    .attr("cx",function () {
                        var id = parseInt(d3.select(this).attr("id").substring(12))
                        return (0.83+0.005*id)*width
                    })
                    .attr("r",0.005*height)
                    .transition().delay(1*view_time).duration(0)
                    .attr("opacity",0)
            }
            else
            {
                align_g.select("#align_g").transition().delay(0).duration(0.5*view_time).attr("opacity",0)
                align_g.selectAll("circle")
                    .transition().delay(0.5*view_time).duration(0.5*view_time)
                    .attr("cx",function () {
                        var id = parseInt(d3.select(this).attr("id").substring(12))
                        return (0.83+0.005*id)*width
                    })
                    .attr("r",0.005*height)
                    .transition().delay(1*view_time).duration(0)
                    .attr("opacity",0)
            }
            align_g.transition().delay(3*view_time).duration(0).remove()
        }
        else if(oldtype==8)
        {
            if(type<4)
            {
                var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
                arc_g.select("path").transition().delay(0.2*view_time).duration(0.2*view_time).remove()
                arc_g.transition().delay(1.1*view_time).duration(0.3*view_time)
                    .attr("transform",function () {
                        return "translate("+0.83*width+","+ (num*0.05+0.01)*height+")"
                    })
                    .transition().delay(0.2*view_time).duration(0.3*view_time)
                    .attr("transform",function () {
                        return "translate("+x_smallfield*width+","+ (num*0.08+0.01)*height+")"
                    })
                arc_g.selectAll("circle")
                    .transition().delay(0.3*view_time).duration(0.2*view_time)
                    .attr("r",4)
                    .attr("fill",function () {
                        var id = parseInt(d3.select(this).attr("id").substring(4))
                        return getEventColor(phase_small.nodes[id].eid)
                    })
                    .transition().delay(0.4*view_time).duration(0.3*view_time)
                    .attr("transform",function () {
                        var id = parseInt(d3.select(this).attr("id").substring(4))
                        return "translate("+id*0.005*height+","+ 0+")"
                    })
                    .transition().delay(0.4*view_time).duration(0.4*view_time)
                    .attr("transform",function () {
                        var id = parseInt(d3.select(this).attr("id").substring(4))
                        var x=phase_small.nodes[id].x/100*width_smallfield*width
                        var y=phase_small.nodes[id].y/100*height_smallfield*height
                        return "translate("+x+","+ y+")"
                    })
                    .transition().delay(0.5*view_time).duration(0.5*view_time)
                    .attr("opacity",0)
                arc_g.transition().delay(3*view_time).duration(0).remove()
                g_sequence.select("#smallfield_remove").remove()
            }
            else if(type==4)
            {
                var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
                arc_g.select("path").transition().delay(0.2*view_time).duration(0.2*view_time).remove()
                arc_g.transition().delay(1.1*view_time).duration(0.3*view_time)
                    .attr("transform",function () {
                        return "translate("+0.83*width+","+ (num*0.05+0.01)*height+")"
                    })
                    .transition().delay(0.2*view_time).duration(0.3*view_time)
                    .attr("transform",function () {
                        return "translate("+x_smallfield*width+","+ (num*0.08+0.01)*height+")"
                    })
                arc_g.selectAll("circle")
                    .transition().delay(0.3*view_time).duration(0.2*view_time)
                    .attr("r",4)
                    .attr("fill",function () {
                        var id = parseInt(d3.select(this).attr("id").substring(4))
                        return getEventColor(phase_small.nodes[id].eid)
                    })
                    .transition().delay(0.4*view_time).duration(0.3*view_time)
                    .attr("transform",function () {
                        var id = parseInt(d3.select(this).attr("id").substring(4))
                        return "translate("+id*0.005*height+","+ 0+")"
                    })
                    .transition().delay(0.4*view_time).duration(0.4*view_time)
                    .attr("transform",function () {
                        var id = parseInt(d3.select(this).attr("id").substring(4))
                        var x=phase_small.nodes[id].x/100*width_smallfield*width
                        var y=phase_small.nodes[id].y/100*height_smallfield*height
                        return "translate("+x+","+ 0+")"
                    })
                    .transition().delay(0.5*view_time).duration(0.5*view_time)
                    .attr("opacity",0)
                arc_g.transition().delay(3*view_time).duration(0).remove()
                g_sequence.select("#smallfield_remove").remove()
            }
            else if(type == 5)
            {
                var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
                arc_g.select("path").transition().delay(0.2*view_time).duration(0.2*view_time).remove()
                arc_g.transition().delay(1.1*view_time).duration(0.3*view_time)
                    .attr("transform",function () {
                        return "translate("+0.83*width+","+ (num*0.05+0.01)*height+")"
                    })
                    .transition().delay(0.2*view_time).duration(0.3*view_time)
                    .attr("transform",function () {
                        return "translate("+x_smallfield*width+","+ (num*0.08+0.01)*height+")"
                    })
                arc_g.selectAll("circle")
                    .transition().delay(0.3*view_time).duration(0.2*view_time)
                    .attr("r",4)
                    .attr("fill",function () {
                        var id = parseInt(d3.select(this).attr("id").substring(4))
                        return getEventColor(phase_small.nodes[id].eid)
                    })
                    .transition().delay(0.4*view_time).duration(0.3*view_time)
                    .attr("transform",function () {
                        var id = parseInt(d3.select(this).attr("id").substring(4))
                        return "translate("+id*0.005*height+","+ 0+")"
                    })
                    .transition().delay(0.4*view_time).duration(0.4*view_time)
                    .attr("transform",function () {
                        var id = parseInt(d3.select(this).attr("id").substring(4))
                        var x=phase_small.nodes[id].x/100*width_smallfield*width
                        var y=phase_small.nodes[id].y/100*height_smallfield*height
                        return "translate("+0+","+ y+")"
                    })
                    .transition().delay(0.5*view_time).duration(0.5*view_time)
                    .attr("opacity",0)
                arc_g.transition().delay(3*view_time).duration(0).remove()
                g_sequence.select("#smallfield_remove").remove()
            }
            else if(type==6|| type==7)
            {
                var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
                arc_g.select("path").transition().delay(0.2*view_time).duration(0.2*view_time).remove()
                arc_g.transition().delay(1.1*view_time).duration(0.3*view_time)
                    .attr("transform",function () {
                        return "translate("+0.83*width+","+ (num*0.05+0.02)*height+")"
                    })
                    // .transition().delay(0.2*view_time).duration(0.3*view_time)
                    // .attr("transform",function () {
                    //     return "translate("+x_smallfield*width+","+ (num*0.08+0.01)*height+")"
                    // })
                arc_g.selectAll("circle")
                    .transition().delay(0.3*view_time).duration(0.2*view_time)
                    .attr("r",0.005*height)
                    .attr("fill",function () {
                        var id = parseInt(d3.select(this).attr("id").substring(4))
                        return getEventColor(phase_small.nodes[id].eid)
                    })
                    .transition().delay(0.4*view_time).duration(0.3*view_time)
                    .attr("transform",function () {
                        var id = parseInt(d3.select(this).attr("id").substring(4))
                        return "translate("+id*0.005*height+","+ 0+")"
                    })
                    // .transition().delay(0.4*view_time).duration(0.4*view_time)
                    // .attr("transform",function () {
                    //     var id = parseInt(d3.select(this).attr("id").substring(4))
                    //     var x=phase_small.nodes[id].x/100*width_smallfield*width
                    //     var y=phase_small.nodes[id].y/100*height_smallfield*height
                    //     return "translate("+x+","+ 0+")"
                    // })
                    // .transition().delay(0.5*view_time).duration(0.5*view_time)
                    // .attr("opacity",0)
                arc_g.transition().delay(2*view_time).duration(0).remove()
                g_sequence.select("#smallfield_remove").remove()
            }


        }
        // if(arc_g != null)
        // {
        //     arc_g.remove();
        // }
        // if(g_proj != null)
        // {
        //     g_proj.remove();
        // }

    }
}

matchinfo.prototype.viewtransform = function (type,time) {
    var val1 = nb.sideBar.sequenceTimeOptions[nb.sideBar.sequenceTimeSel],
        val2 = nb.sideBar.sequenceStyleSel;
    view_time=val1;
    view_transform=1;

    // if(type!=oldtype)
    // {
    //     // if(oldtype>0)
    //     // {
    //     //     switch (+oldtype)
    //     //     {
    //     //         case 0:this.point_move();break;
    //     //         case 1:this.point_move();break;
    //     //         case 2:this.point_move();break;
    //     //         case 3:this.point_move();break;
    //     //         case 4:this.proj_move(1);break;
    //     //         case 5:this.proj_move(0);break;
    //     //         case 6:this.distancealign_move();break;
    //     //         case 7:this.timealign_move();break;
    //     //         case 8:this.donut_move();break;
    //     //     }
    //     // }
    //     switch (+type)
    //     {
    //         case 0:this.clear();this.point();break;
    //         case 1:this.clear();this.point_link();break;
    //         case 2:this.clear();this.mark();break;
    //         case 3:this.clear();this.worm();break;
    //         case 4:this.clear();this.proj(1);break;
    //         case 5:this.clear();this.proj(0);break;
    //         case 6:this.clear();this.distancealign();break;
    //         case 7:this.clear();this.timealign();break;
    //         case 8:this.clear();this.donut();break;
    //     }
    // }
    if(oldtype!=type)
    {
        switch (+type)
        {
            case 0:this.clear(type,oldtype);this.point();break;
            case 1:this.clear(type,oldtype);this.point_link();break;
            case 2:this.clear(type,oldtype);this.mark();break;
            case 3:this.clear(type,oldtype);this.worm();break;
            case 4:this.clear(type,oldtype);this.proj(1);break;
            case 5:this.clear(type,oldtype);this.proj(0);break;
            case 6:this.clear(type,oldtype);this.timealign();break;
            case 7:this.clear(type,oldtype);this.distancealign();break;
            case 8:this.clear(type,oldtype);this.donut();break;
        }
        oldtype=type;
        view_transform=0;
    }
}


