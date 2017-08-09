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
};

matchinfo = function (svg,field,data,width,height) {
    this.svg=svg;
    this.field=field;
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
                d3.select(this).select("#rect_g").attr("fill-opacity","0.5")
                d3.select(this).select("#align_g").attr("fill","gray").attr("fill-opacity","0.5")
                x=d3.select(this).select("circle")
                    .attr("cx");
                id=d3.select(this).select("circle").attr("id")
                d3.select(this).select("#arc_g").attr("fill","gray").attr("fill-opacity","0.5")
                g_mouse_field=d3.select(this).append("g")
                    .attr("id","mouse_field")
                var click_field= new Field(g_mouse_field,x-0.04*width,0.14*height,0.08*width,0.08*height,"click",0,0,1)
                var phase_click=new Sequence(click_field.fieldGroup,data[parseInt(id.substring(15))],3,"black",1);
            })
            .on("mouseleave",function () {
                d3.select(this).select("circle")
                    .attr("r",0.008*height);
                d3.select(this).select("#rect_g").attr("fill-opacity","0")
                d3.select(this).select("#align_g").attr("fill","white").attr("fill-opacity","1")
                id=d3.select(this).select("circle").attr("id")
                var color=d3.scaleLinear()
                    .domain([0,20])
                    .range(["red","blue"])
                d3.select(this).select("#arc_g").attr("fill",function () {
                    return color(parseInt(id.substring(15)))
                }).attr("fill-opacity","1")
                d3.select(this).select("#mouse_field").remove();
            })
            .on("click",function () {
                d3.select("#mainfield").select("#path_container").remove();
                d3.select("#mainfield").select("#node_container").remove();
                id=d3.select(this).select("circle").attr("id")
                if(cm != undefined) cm.clearAll();
                seq = new Sequence(field.fieldGroup, data[parseInt(id.substring(15))],10,"white",1);
                cm = new ClusterManager(field, seq);
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
    }
    this.viewtransform(0,0);
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
        var smallqurt= new Field(g_sequence,0.84*width,(num*0.08+0.01)*height,0.075*width,0.07*height,"smallfield"+num,0,0,1);
        g_sequence.append("rect")
            .attr("id","rect_g")
            .attr("x",0.84*width)
            .attr("y",(num*0.08+0.01)*height)
            .attr("width",0.075*width)
            .attr("height",0.07*height)
            .attr("fill","gray")
            .attr("fill-opacity","0")
        var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num],3,"black",0);
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
                    return (0.84+0.0075*i)*width
                })
                .attr("y",(num*0.08+0.01)*height)
                .attr("width",0.0075*width)
                .attr("height",function(d){
                    return (d/10)*0.07*height;
                })
                .attr("fill","steelblue")
                .attr("opacity","0.5")
                .attr("stroke","steelblue")
            this.g_court.selectAll("text")
                .data(datax)
                .enter().append("text")
                .attr("x",function (d,i) {
                    return (0.84+0.0075*i+0.001)*width
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
                .attr("x",0.84*width)
                .attr("width",function (d) {
                    return (d/6)*0.075*width;
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
        var smallqurt= new Field(g_sequence,0.84*width,(num*0.08+0.01)*height,0.075*width,0.07*height,"smallfield"+num,0,0,0);
        var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num],3,"black",0);
        this.g_align=g_sequence.append("g")
            .attr("id","align_g")
        this.g_align.append("rect")
            .attr("id","align_g")
            .attr("x",0.83*width)
            .attr("y",(num*0.05+0.01)*height)
            .attr("width",0.16*width)
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
matchinfo.prototype.point =function () {
    width=this.width;
    height=this.height;

    for(var num=0;num<this.data.length;num++) {
        var name = "#g_sequence" + (num + 1);
        var g_sequence = d3.select("#Sequence").select(name)
        var smallqurt= new Field(g_sequence,0.84*width,(num*0.08+0.01)*height,0.075*width,0.07*height,"smallfield"+num,0,0,1);
        g_sequence.append("rect")
            .attr("id","rect_g")
            .attr("x",0.84*width)
            .attr("y",(num*0.08+0.01)*height)
            .attr("width",0.075*width)
            .attr("height",0.07*height)
            .attr("fill","gray")
            .attr("fill-opacity","0")
        var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num],3,"black",0);
        phase_small.draw_node("node",3,"black");
    }
}
matchinfo.prototype.mark =function () {
    width=this.width;
    height=this.height;

    for(var num=0;num<this.data.length;num++) {
        var name = "#g_sequence" + (num + 1);
        var g_sequence = d3.select("#Sequence").select(name)
        var smallqurt= new Field(g_sequence,0.84*width,(num*0.08+0.01)*height,0.075*width,0.07*height,"smallfield"+num,0,0,1);
        g_sequence.append("rect")
            .attr("id","rect_g")
            .attr("x",0.84*width)
            .attr("y",(num*0.08+0.01)*height)
            .attr("width",0.075*width)
            .attr("height",0.07*height)
            .attr("fill","gray")
            .attr("fill-opacity","0")
        var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num],3,"black",0);
        phase_small.draw_node("node",3,"black");
        phase_small.draw_path("link",1)
    }
}
matchinfo.prototype.point_link =function () {
    width=this.width;
    height=this.height;

    for(var num=0;num<this.data.length;num++) {
        var name = "#g_sequence" + (num + 1);
        var g_sequence = d3.select("#Sequence").select(name)
        var smallqurt= new Field(g_sequence,0.84*width,(num*0.08+0.01)*height,0.075*width,0.07*height,"smallfield"+num,0,0,1);
        g_sequence.append("rect")
            .attr("id","rect_g")
            .attr("x",0.84*width)
            .attr("y",(num*0.08+0.01)*height)
            .attr("width",0.075*width)
            .attr("height",0.07*height)
            .attr("fill","gray")
            .attr("fill-opacity","0")
        var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num],3,"black",0);
        phase_small.draw_node("node",3,"black");
        phase_small.draw_path("link",0)
    }
}
matchinfo.prototype.worm =function () {
    width=this.width;
    height=this.height;

    for(var num=0;num<this.data.length;num++) {
        var name = "#g_sequence" + (num + 1);
        var g_sequence = d3.select("#Sequence").select(name)
        var smallqurt= new Field(g_sequence,0.84*width,(num*0.08+0.01)*height,0.075*width,0.07*height,"smallfield"+num,0,0,1);
        g_sequence.append("rect")
            .attr("id","rect_g")
            .attr("x",0.84*width)
            .attr("y",(num*0.08+0.01)*height)
            .attr("width",0.075*width)
            .attr("height",0.07*height)
            .attr("fill","gray")
            .attr("fill-opacity","0")
        var phase_small=new Sequence(smallqurt.fieldGroup,this.data[num],3,"black",0);
        phase_small.draw_path("link",1)
    }
}
matchinfo.prototype.clear = function (time) {
    for(var num=0;num<this.data.length;num++) {
        var name = "#g_sequence" + (num + 1);
        var name1="#smallfield"+num
        d3.select("#Sequence").select(name).select(name1).transition().duration(+time).remove();
        d3.select("#Sequence").select(name).selectAll("#rect_g").transition().duration(+time).remove();
        d3.select("#Sequence").select(name).selectAll("#align_g").transition().duration(+time).remove();
        d3.select("#Sequence").select(name).selectAll("#arc_g").transition().duration(+time).remove();
        d3.select("#Sequence").select(name).selectAll("#g_proj").transition().duration(+time).remove();
    }
}

matchinfo.prototype.viewtransform = function (type,time) {
    switch (+type)
    {
        case 0:this.clear(time);this.point();break;
        case 1:this.clear();this.point_link();break;
        case 2:this.clear();this.mark();break;
        case 3:this.clear();this.worm();break;
        case 4:this.clear();this.proj(1);break;
        case 5:this.clear();this.proj(0);break;
        case 6:this.clear();this.distancealign();break;
        case 7:this.clear();this.distancealign();break;
        case 8:this.clear();this.donut();break;
    }
}


