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
                    .range(["red","blue"])
                d3.select(this).select("#arc_g").attr("fill",function () {
                    return color(id)
                }).attr("fill-opacity","1")
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

                d3.selectAll("#mouse_field").remove();
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
        if(i==0) time=this.data[i].endTime.min*60+this.data[i].endTime.sec;
        else time=(this.data[i].endTime.min-this.data[i-1].endTime.min)*60+this.data[i].endTime.sec-this.data[i-1].endTime.sec
        data.push(time)
    }
    console.log(data)
    var color=d3.scaleLinear()
        .domain([0,20])
        .range(["red","blue"])
    var angele_data=d3.pie()(data);
    console.log(angele_data)
    for(var num=0;num<data.length;num++) {
        var name = "#g_sequence" + (num+1);
        var g_court = d3.select("#Sequence").select(name)
        var arc=d3.arc()
            .innerRadius(0)
            .outerRadius(0.07*width)
            .padAngle(0.05)
            .startAngle(angele_data[num].startAngle)
            .endAngle(angele_data[num].endAngle)
        var g=g_court.append("g")
            .attr("transform",function () {
                return "translate("+0.92*width+","+0.2*height+")"
            })
            .attr("id",function () {
                return "g_arc"+num
            })
        g.append("path")
            .attr("d",arc)
            .attr("id","arc_g")
            .attr("fill",function () {
                return color(num)
            })
        g.append("text")
            .attr("id","arc_g")
            .text(function () {
                return num+1
            })
            .attr("transform",function()
            {
                return "translate("+arc.centroid(angele_data[num])+")"
            })
            .attr("text-anchor","middle")

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
                .attr("opacity","0.5")
                .attr("stroke","steelblue")
            this.g_court.selectAll("text")
                .data(datax)
                .enter().append("text")
                .attr("x",function (d,i) {
                    return (x_smallfield+width_smallfield/10*(i)+0.001)*width
                })
                .attr("y",(num*0.08+0.02)*height)
                .attr("font-size","80%")
                .html(function (d) {
                    return d;
                })
        }
        else
        {
            this.g_court.selectAll("rect")
                .data(datay)
                .enter().append("rect")
                .attr("y",function (d,i) {
                    return (num*0.08+0.007*i)*height;
                })
                .attr("x",x_smallfield*width)
                .attr("width",function (d) {
                    return (d/6)*width_smallfield*width;
                })
                .attr("height",0.007*height)
                .attr("fill","steelblue")
                .attr("opacity","0.5")
                .attr("stroke","steelblue")
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
matchinfo.prototype.distancealign =function () {
    width=this.width;
    height=this.height;

    for(var num=0;num<this.data.length;num++) {
        var name = "#g_sequence" + (num + 1);
        var g_sequence = d3.select("#Sequence").select(name)
        var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield"+num,0,0,0);
        var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
        min=phase_small.nodes[0].x;
        for(var j=0;j<phase_small.nodes.length;j++)
        {
            if(phase_small.nodes[j].x<min) min=phase_small.nodes[j].x;
        }
        this.g_align=g_sequence.append("g")
            .attr("id","align_g")
        this.g_align.append("rect")
            .attr("id","align_g")
            .attr("x",(0.83+min/100*0.16)*width)
            .attr("y",(num*0.05+0.01)*height)
            .attr("width",(100-min)/100*0.16*width)
            .attr("height",0.025*height)
            .attr("fill","white")
            .attr("stroke","black")
            .attr("stroke-width","1px")
            .attr("fill-opacity",1);
        this.g_align.selectAll("circle")
            .data(phase_small.links)
            .enter().append("circle")
            .attr("cx",function (d) {
                return ((phase_small.nodes[d.source].x/100)*0.16+0.83)*width
            })
            .attr("cy",function () {
                return (num*0.05+0.02)*height
            })
            .attr("r",0.008*height)
            .attr("fill",function (d,i) {
                return getEventColor(d.eid)
            })
    }
}
matchinfo.prototype.timealign =function () {
    width=this.width;
    height=this.height;

    for(var num=0;num<this.data.length;num++) {
        var name = "#g_sequence" + (num + 1);
        var g_sequence = d3.select("#Sequence").select(name)
        var smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield"+num,0,0,0);
        var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
        console.log(phase_small.nodes);
        var len=phase_small.nodes.length;
        var max=(phase_small.nodes[len-1].time.min-phase_small.nodes[0].time.min)*60+phase_small.nodes[len-1].time.sec-phase_small.nodes[0].time.sec
        if(max>10) max=10;
        this.g_align=g_sequence.append("g")
            .attr("id","align_g")
        this.g_align.append("rect")
            .attr("id","align_g")
            .attr("x",0.83*width)
            .attr("y",(num*0.05+0.01)*height)
            .attr("width",(0.016*max+0.005)*width)
            .attr("height",0.025*height)
            .attr("fill","white")
            .attr("stroke","black")
            .attr("stroke-width","1px")
            .attr("fill-opacity",1);
        this.g_align.selectAll("circle")
            .data(phase_small.links)
            .enter().append("circle")
            .attr("cx",function (d) {
                var t=(phase_small.nodes[d.source].time.min-phase_small.nodes[0].time.min)*60+phase_small.nodes[d.source].time.sec-phase_small.nodes[0].time.sec
                return (t*0.016+0.83)*width
            })
            .attr("cy",function () {
                return (num*0.05+0.02)*height
            })
            .attr("r",0.008*height)
            .attr("fill",function (d,i) {
                return getEventColor(d.eid)
            })
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
        phase_small.draw_node("node",2,"black");
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
        phase_small.draw_node("node",2,"black");
        phase_small.draw_path("link",1)
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
        phase_small.draw_node("node",2,"black");
        phase_small.draw_path("link",0)
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
        phase_small.draw_path("link",1)
    }
}
matchinfo.prototype.clear = function () {
    for(var num=0;num<this.data.length;num++) {
        var name = "#g_sequence" + (num + 1);
        var name1="#smallfield"+num
        d3.select("#Sequence").select(name).select(name1).remove();
        d3.select("#Sequence").select(name).selectAll("#rect_g").remove();
        d3.select("#Sequence").select(name).selectAll("#align_g").remove();
        d3.select("#Sequence").select(name).selectAll("#arc_g").remove();
        d3.select("#Sequence").select(name).selectAll("#g_proj").remove();
    }
}

matchinfo.prototype.viewtransform = function (type,time) {
    switch (+type)
    {
        case 0:this.clear();this.point();break;
        case 1:this.clear();this.point_link();break;
        case 2:this.clear();this.mark();break;
        case 3:this.clear();this.worm();break;
        case 4:this.clear();this.proj(1);break;
        case 5:this.clear();this.proj(0);break;
        case 6:this.clear();this.distancealign();break;
        case 7:this.clear();this.timealign();break;
        case 8:this.clear();this.donut();break;
    }
}


