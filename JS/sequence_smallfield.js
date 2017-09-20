/**
 * Created by zf on 2017/9/18.
 */

var x_smallfield = 0.01
var width_smallfield=0.07
var height_smallfield=0.075
var x_donut=0.06
var r_donut=0.05
var length_align=0.11
var height_alignrect=0.015
var heightbetween_rect=0.04
var height_seqbody=0.8
var y_mousefield=0.35

var type = new Array();
type[0]={
    status:0,
    name:"ATK_CENTER"
}
type[1]={
    status:0,
    name:"ATK_SIDE"
}
type[2]={
    status:0,
    name:"ATK_TRANSFER"
}
type[3]={
    status:0,
    name:"ATK_BREAKAWAY"
}
type[4]={
    status:0,
    name:"ATK_BREAKAWAY"
}
function mouseenter(id,width,height) {
    id=parseInt(id);
    var circle="#circle_timeline"+id;
    var g="#g_sequence"+(id+1)
    d3.select("#g_circle").select(circle).attr("r",15)
    d3.select(g).select("#rect_g").attr("fill-opacity", "0.3")
    d3.select(g).select("#align_g").attr("fill", "gray").attr("fill-opacity", "0.3")
    x = d3.select("#g_circle").select(circle)
        .attr("cx");
    d3.select(g).select("#arc_g").attr("fill", "gray").attr("fill-opacity", "0.3")
    if (onTransition[id] === 0) {
        repaint(d3.select(g), id, x,width,height);
    }

}
function mouseleave(id,width,height) {
    id=parseInt(id);
    var circle="#circle_timeline"+id;
    var g="#g_sequence"+(id+1)
    d3.select("#g_circle").select(circle).attr("r",8)
    d3.select(g).select("#rect_g").attr("fill-opacity", "0")
    d3.select(g).select("#align_g").attr("fill", "white").attr("fill-opacity", "1")
    x = d3.select("#g_circle").select(circle)
        .attr("cx");
    d3.select(g).select("#arc_g").attr("fill", "gray").attr("fill-opacity", "0")
    if (onTransition[id] === 0) {
        d3.select("#center").selectAll("#mouse_field").remove();
    }

}
function mouseclick(id,width,height,field) {
    id=parseInt(id);
    var circle="#circle_timeline"+id;
    var g="#g_sequence"+(id+1)
    let val1 = sideSetting.showTimeParams.value,
        val2 = sideSetting.sequenceStyleSel;
    time = val1;
    if (click >= 0) {
        let name = "#g_sequence" + (click + 1)
        let name1 = "#rect_g_click" + click
        let name2 = "#arc_g_click" + click
        let name3 = "#align_g_click" + click
        d3.select("#Sequence").select(name).select(name1).attr("fill-opacity", 0).attr("fill", "gray").attr("id", function () {
            console.log("ffff", click)
            return "rect_g"
        })
        d3.select("#Sequence").select(name).select(name2).attr("fill-opacity", 0).attr("fill", "gray").attr("id", "arc_g")
        d3.select("#Sequence").select(name).select(name3).attr("fill-opacity", 0).attr("fill", "gray").attr("id", "align_g")
    }
    d3.select(g).select("#rect_g").attr("fill-opacity", "0.6").attr("fill", "rgb(36,40,51)").attr("id", function () {
        return "rect_g_click" + id
    })
    d3.select(g).select("#align_g").attr("fill-opacity", "0.6").attr("fill", "rgb(36,40,51)").attr("id", function () {
        return "align_g_click" + id
    })
    d3.select(g).select("#arc_g").attr("fill-opacity", "0.6").attr("fill", "rgb(36,40,51)").attr("id", function () {
        return "arc_g_click" + id
    })
    click = id;
    // d3.select("#click_field").remove();
    // d3.select("#Sequence")
    //     .append("rect")
    //     .attr("id","click_field")
    //     .attr("x",x_smallfield*width)
    //     .attr("y",(id*0.08+0.01)*height)
    //     .attr("height",height_smallfield*height)
    //     .attr("width",width_smallfield*width)
    //     .attr("fill","red").attr("fill-opacity","0.5")
    d3.select("#mainfield").selectAll("#mouse_field").remove();
    x = d3.select("#g_circle").select(circle)
        .attr("cx");
    let phase =repaint(d3.select(g), id, x,width,height);
    d3.select("#mainfield").select("#path_container").remove();
    d3.select("#mainfield").select("#node_container").remove();

    if (cm != undefined) cm.clearAll();

    nodeMoveAnimation(phase.field, field, phase.seq, id);

    seq = new Sequence(field.fieldGroup, data.sequences[id]);
    seq.draw_path("link", 0, 1);
    seq.draw_node("node", 10, "white", 1, onTransition, id);
}
function filter() {
    var sequence= new Array(data.sequences.length);
    let temp=0;
    for(var i=0;i<5;i++)
    {
        if(type[i].status ==1)
        {
            temp=1;
            break;
        }
    }
    for(var i =0;i<sequence.length;i++)
        sequence[i] = 0;
    if(temp==0)
    {
        for(var i =0;i<sequence.length;i++)
            sequence[i] = 1;
    }
    for(var num=0; num<5;num++)
    {
        if(type[num].status ==1)
        {
            var name = "#seq_filter_"+num;
            for(var i =0;i<sequence.length;i++)
                if(data.sequences[i].type[type[num].name] == true)
                    sequence[i]=1;
        }
    }
    console.log("sequence",sequence);
    let g_sequence = d3.select("#Sequence").selectAll("g").remove();
    for(let num=0;num<data.sequences.length;num++) {
        if(sequence[num]==1)
        {
            d3.select("#Sequence").append("g").attr("id",function () {
                return "g_sequence"+(num+1);
            })
        }
    }
    let count =0;
    for(let num=0;num<data.sequences.length;num++) {
        if(sequence[num]==1)
        {
            let name = "#g_sequence" + (num + 1);
            let g_sequence = d3.select("#Sequence").select(name)
            let smallqurt= new Field(g_sequence,x_smallfield*width,(count++*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield"+num,0,0,1);
            g_sequence.append("rect")
                .attr("id","rect_g")
                .attr("x",x_smallfield*width)
                .attr("y",(num*0.08+0.01)*height)
                .attr("width",width_smallfield*width)
                .attr("height",height_smallfield*height)
                .attr("fill","gray")
                .attr("fill-opacity","0")
            let phase_small=new Sequence(smallqurt.fieldGroup,data.sequences[num]);
            phase_small.draw_node("node",2,"black",2);
        }
    }
}
sequenceinfo = function (div,field,data,width,height) {
    this.svg_div = div;
    this.field=field;
    this.data= data;
    this.width=width;
    this.height=height;

    console.log("field",field)
    this.div=this.svg_div.select("#sequences")
    this.svg=this.div.append("svg")
        .attr("id","sequence")
        .attr("width","100%")
        .attr("height",height_seqbody*height)
    this.g_sequence=this.svg.append("g")
        .attr("id","Sequence")
    for(let i=0;i<data.length;i++) {
        let g = this.g_sequence.append("g")
            .attr("id", function () {
                return "g_sequence" + (i + 1)
            })
            .attr("num", i)
            .on("mouseenter",function () {
                var id =d3.select(this).attr("num")
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
            // .on("mouseenter", function () {
            //     d3.select(this).select("circle")
            //         .attr("r", 0.012 * height);
            //     d3.select(this).select("#rect_g").attr("fill-opacity", "0.3")
            //     d3.select(this).select("#align_g").attr("fill", "gray").attr("fill-opacity", "0.3")
            //     x = d3.select(this).select("circle")
            //         .attr("cx");
            //     id = parseInt(d3.select(this).select("circle").attr("id").substring(15));
            //     d3.select(this).select("#arc_g").attr("fill", "gray").attr("fill-opacity", "0.3")
            //     if (that.onTransition[id] === 0) {
            //         that.repaint(d3.select(this), id, x);
            //     }
            // })
            // .on("mouseleave", function () {
            //     d3.select(this).select("circle")
            //         .attr("r", 0.008 * height);
            //     d3.select(this).select("#rect_g").attr("fill-opacity", "0")
            //     d3.select(this).select("#align_g").attr("fill", "white").attr("fill-opacity", "1")
            //     id = parseInt(d3.select(this).select("circle").attr("id").substring(15));
            //     let color = d3.scaleLinear()
            //         .domain([0, 20])
            //         .range(["red", "white"])
            //     d3.select(this).select("#arc_g").attr("fill", function () {
            //         return "gray"
            //     }).attr("fill-opacity", "0")
            //     if (that.onTransition[id] === 0)
            //         d3.select(this).selectAll("#mouse_field").remove();
            // })
            // .on("click", function () {
            //     let val1 = sideSetting.showTimeParams.value,
            //         val2 = sideSetting.sequenceStyleSel;
            //     time = val1;
            //     id = parseInt(d3.select(this).select("circle").attr("id").substring(15));
            //     x = d3.select(this).select("circle")
            //         .attr("cx");
            //     if (click >= 0) {
            //         let name = "#g_sequence" + (click + 1)
            //         let name1 = "#rect_g_click" + click
            //         let name2 = "#arc_g_click" + click
            //         let name3 = "#align_g_click" + click
            //         d3.select("#Sequence").select(name).select(name1).attr("fill-opacity", 0).attr("fill", "gray").attr("id", function () {
            //             console.log("ffff", click)
            //             return "rect_g"
            //         })
            //         d3.select("#Sequence").select(name).select(name2).attr("fill-opacity", 0).attr("fill", "gray").attr("id", "arc_g")
            //         d3.select("#Sequence").select(name).select(name3).attr("fill-opacity", 0).attr("fill", "gray").attr("id", "align_g")
            //     }
            //     d3.select(this).select("#rect_g").attr("fill-opacity", "0.6").attr("fill", "rgb(36,40,51)").attr("id", function () {
            //         return "rect_g_click" + id
            //     })
            //     d3.select(this).select("#align_g").attr("fill-opacity", "0.6").attr("fill", "rgb(36,40,51)").attr("id", function () {
            //         return "align_g_click" + id
            //     })
            //     d3.select(this).select("#arc_g").attr("fill-opacity", "0.6").attr("fill", "rgb(36,40,51)").attr("id", function () {
            //         return "arc_g_click" + id
            //     })
            //     console.log("id clicl", id, click)
            //     click = id;
            //     // d3.select("#click_field").remove();
            //     // d3.select("#Sequence")
            //     //     .append("rect")
            //     //     .attr("id","click_field")
            //     //     .attr("x",x_smallfield*width)
            //     //     .attr("y",(id*0.08+0.01)*height)
            //     //     .attr("height",height_smallfield*height)
            //     //     .attr("width",width_smallfield*width)
            //     //     .attr("fill","red").attr("fill-opacity","0.5")
            //     d3.selectAll("#mouse_field").remove();
            //     let phase = that.repaint(d3.select(this), id, x);
            //
            //     d3.select("#mainfield").select("#path_container").remove();
            //     d3.select("#mainfield").select("#node_container").remove();
            //
            //     if (cm != undefined) cm.clearAll();
            //
            //     that.nodeMoveAnimation(phase.field, field, phase.seq, id);
            //
            //     seq = new Sequence(field.fieldGroup, data[id]);
            //     seq.draw_path("link", 0, 1);
            //     seq.draw_node("node", 10, "white", 1, that.onTransition, id);
            // })
            // .on("dblclick", function () {
            //     let time0 = data[d3.select(this).attr("num")].startTime,
            //         time1 = data[d3.select(this).attr("num")].endTime;
            //     videoPlayer.playPart(time0, time1);
            // });
    }
    this.viewtransform(0,0)
}
sequenceinfo.prototype.addBody = function() {
    d3.select("#sequences").append("div")
        .attr("id","seq_body")
        .attr("class","part header");
};

sequenceinfo.prototype.addFilters = function() {
    d3.select("#sequences").append("div")
        .attr("id","seq_filter")
        .attr("class","part footer");

    this.filterList = new Array(5);
    this.filterList[0] = {
        num: 0,
        content: "中路进攻"
    };
    this.filterList[1] = {
        num: 1,
        content: "边路进攻"
    };
    this.filterList[2] = {
        num: 2,
        content: "进攻点转移"
    };
    this.filterList[3] = {
        num: 3,
        content: "快速反击"
    };
    this.filterList[4] = {
        num: 4,
        content: "定位球进攻"
    };
    for(let i = 0; i < this.filterList.length; i++)
        this.addFilter(this.filterList[i]);
};
sequenceinfo.prototype.addFilter = function(params) {
    d3.select("#seq_filter")
        .append("input")
        .attr("type","checkbox")
        .attr("id","seq_filter_"+params.num)
        .attr("width","0")
        .attr("height","0")
        .on("click",function () {
            var num = parseInt(d3.select(this).attr("id").substring(11));
            type[num].status=1-type[num].status;
            filter();
        });
    d3.select("#seq_filter")
        .append("label")
        .attr("for","seq_filter_"+params.num)
        .append("span")
        .text(params.content);
};
function nodeMoveAnimation (oriField, desField, desSequence) {
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
 function repaint (selection, id, x,width,height) {
    console.log("width",x-width_smallfield/2*width-5)
    g_mouse_field = d3.select("#center").select("#mainfield").append("g")
        .attr("id","mouse_field")
    g_mouse_field.append("rect")
        .attr("x",x-width_smallfield/2*width-5)
        .attr("y",(y_timeline-height_smallfield-0.03)*height-5)
        .attr("width", width_smallfield * width+10)
        .attr("height",height*height_smallfield+10)
        .attr("rx","6")
        .attr("ry","6")
        .attr("fill","rgb(49,36,51)")
    g_mouse_field.append("path")
        .attr("d",()=> {
        return "M"+(x)+" "+(y_timeline-0.02)*height+"l-30 -20 l 60 0 Z";
})
    .attr("fill","rgb(49,36,51)")
    let phase_field = new Field(g_mouse_field, x - width_smallfield/2 * width, (y_timeline-height_smallfield-0.03) * height,
        width_smallfield * width, height_smallfield * height, "click", 0, 0, 1)
    let phase_seq = new Sequence(phase_field.fieldGroup, data.sequences[id]);
    phase_seq.draw_node("node", 2, "black", 0);



    return {field:phase_field, seq:phase_seq};
}

sequenceinfo.prototype.donut =function () {
    width=this.width;
    height=this.height;

    let data =new Array();
    for(let i=0;i<this.data.length;i++)
    {
        let name = "#g_sequence" + (i+1);
        let g_court = d3.select("#Sequence").select(name)
        let smallqurt= new Field(g_court,x_smallfield*width,(i*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
        let phase_small=new Sequence(smallqurt.fieldGroup,this.data[i]);
        // if(i==0) time=this.data[i].endTime.min*60+this.data[i].endTime.sec;
        // else time=(this.data[i].endTime.min-this.data[i-1].endTime.min)*60+this.data[i].endTime.sec-this.data[i-1].endTime.sec+60
        let len=phase_small.nodes.length
        data.push(len+2)
        console.log("len",len)
        d3.select("#Sequence").select(name).select("#smallfield_remove").remove();
    }
    console.log(data)
    let color=["blue","yellow","red","pink","green","steelblue","purple","silver","maroon","lime"]
    let angele_data=d3.pie()(data);
    console.log(angele_data)
    for(let num=0;num<data.length;num++) {
        let name = "#g_sequence" + (num+1);
        let g_court = d3.select("#Sequence").select(name)
        let smallqurt= new Field(g_court,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield",0,0,0);
        let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
        let arc=d3.arc()
            .innerRadius(0)
            .outerRadius(r_donut*width)
            .padAngle(0.005)
            .startAngle(angele_data[num].startAngle)
            .endAngle(angele_data[num].endAngle)
        let g=g_court.append("g")
            .attr("transform",function () {
                return "translate("+x_smallfield*width+","+(0.05*num+0.02)*height+")"
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
            return "translate("+(x_donut)*width+","+0.2*height+")"
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
                let i=parseInt(d3.select(this).attr("id").substring(4))
                let k=(angele_data[num].endAngle-angele_data[num].startAngle)/(data[num]-1)
                console.log("k",angele_data[num].endAngle-angele_data[num].startAngle)
                let x=r_donut*Math.sin(angele_data[num].startAngle+k*i)*width
                let y=-1*r_donut*Math.cos(angele_data[num].startAngle+k*i)*width
                console.log("x,y",x,y)
                return "translate("+x+","+y+")"
            })
            .attr("r",function () {
                let i=parseInt(d3.select(this).attr("id").substring(4))
                let k=(angele_data[num].endAngle-angele_data[num].startAngle)
                let r=r_donut*width*k/data[num]
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

sequenceinfo.prototype.proj = function (X) {
    width=this.width;
    height=this.height;

    for(let num=0;num<this.data.length;num++) {
        let name = "#g_sequence" + (num + 1);
        let g_sequence = d3.select("#Sequence").select(name)
        let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield"+num,0,0,1);
        g_sequence.append("rect")
            .attr("id","rect_g")
            .attr("x",x_smallfield*width)
            .attr("y",(num*0.08+0.01)*height)
            .attr("width",width_smallfield*width)
            .attr("height",height_smallfield*height)
            .attr("fill","gray")
            .attr("fill-opacity","0")
        let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
        let datax= [0,0,0,0,0,0,0,0,0,0];
        let datay= [0,0,0,0,0,0,0,0,0,0];
        for(let j=0;j<phase_small.nodes.length;j++)
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
                    return (d/6)*width_smallf16ield*width;
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
sequenceinfo.prototype.proj_move = function (X)  {
    for(let num=0;num<this.data.length;num++) {
        let name = "#g_sequence" + (num + 1);
        let name1 = "#smallfield" + num
        let rect=d3.select("#Sequence").select(name).selectAll("#rect_g")
        d3.select("#Sequence").select(name).select(name1).transition().duration(view_time / 5).delay(0).remove();
    }
}
sequenceinfo.prototype.distancealign =function () {
    width=this.width;
    height=this.height;

    for(let num=0;num<this.data.length;num++) {
        let name = "#g_sequence" + (num + 1);
        let g_sequence = d3.select("#Sequence").select(name)
        let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield",0,0,0);
        let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
        min=phase_small.nodes[0].x;
        for(let j=0;j<phase_small.nodes.length;j++)
        {
            if(phase_small.nodes[j].x<min) min=phase_small.nodes[j].x;
        }
        this.g_align=g_sequence.append("g")
            .attr("id",function () {
                return "align_g"+num
            })
        this.g_align.append("rect")
            .attr("id","align_g")
            .attr("x",(x_smallfield+min/100*length_align)*width)
            .attr("y",(num*heightbetween_rect+0.01)*height)
            .attr("width",(100-min)/100*length_align*width)
            .attr("height",height_alignrect*height)
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
                return (x_smallfield+0.005*i)*width
            })
            .attr("cy",(num*heightbetween_rect+0.02)*height)
            .attr("fill",function (d,i) {
                return getEventColor(d.eid)
            })
            .transition().duration(0.5*view_time).delay(0)
            .attr("cx",function (d) {
                return ((phase_small.nodes[d.source].x/100)*length_align+x_smallfield)*width
            })
            .attr("cy",function () {
                return (num*heightbetween_rect+0.017)*height
            })
            .attr("r",0.0045*height)
        g_sequence.select("#smallfield").remove()
    }
}
sequenceinfo.prototype.timealign =function () {
    width=this.width;
    height=this.height;

    for(let num=0;num<this.data.length;num++) {
        let name = "#g_sequence" + (num + 1);
        let g_sequence = d3.select("#Sequence").select(name)
        let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield",0,0,0);
        let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
        let len=phase_small.nodes.length;
        let max=(phase_small.nodes[len-1].time.min-phase_small.nodes[0].time.min)*60+phase_small.nodes[len-1].time.sec-phase_small.nodes[0].time.sec
        if(max==0) max=1;
        if(len>20) len=20;
        this.g_align=g_sequence.append("g")
            .attr("id",function () {
                return "align_g"+num
            })
            // .attr("transform",function (d,i) {
            //     return "translate("+(0.83)*width+","+(num*0.05+0.015)*height+")"
            // })
            .attr("x",x_smallfield*width)
            .attr("y",(num*heightbetween_rect+0.01)*height)
        this.g_align.append("rect")
            .attr("id","align_g")
            .attr("x",x_smallfield*width)
            .attr("y",(num*heightbetween_rect+0.01)*height)
            .attr("width",(length_align*len/20)*width)
            .attr("height",height_alignrect*height)
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
                return (x_smallfield)*width+0.005*i*height
            })
            .attr("cy",(num*heightbetween_rect+0.017)*height)
            .attr("fill",function (d,i) {
                return getEventColor(d.eid)
            })
            .transition().duration(0.5*view_time).delay(0)
            .attr("r",0.0045*height)
            .attr("cx",function (d) {
                let t=(phase_small.nodes[d.source].time.min-phase_small.nodes[0].time.min)*60+phase_small.nodes[d.source].time.sec-phase_small.nodes[0].time.sec
                return (t/max*len/20*length_align+x_smallfield)*width
            })
        let s= "#smallfield"+num
        g_sequence.select("#smallfield").remove()
    }
}
sequenceinfo.prototype.point =function () {
    width=this.width;
    height=this.height;

    for(let num=0;num<this.data.length;num++) {
        let name = "#g_sequence" + (num + 1);
        let g_sequence = d3.select("#Sequence").select(name)
        let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield"+num,0,0,1);
        g_sequence.append("rect")
            .attr("id","rect_g")
            .attr("x",x_smallfield*width)
            .attr("y",(num*0.08+0.01)*height)
            .attr("width",width_smallfield*width)
            .attr("height",height_smallfield*height)
            .attr("fill","gray")
            .attr("fill-opacity","0")
        let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
        phase_small.draw_node("node",2,"black",2);
    }
}
sequenceinfo.prototype.point_move =function ()
{
    for(let num=0;num<this.data.length;num++) {
        let name = "#g_sequence" + (num + 1);
        let name1="#smallfield"+num
        d3.select("#Sequence").select(name).selectAll("#rect_g").transition().duration(view_time/5).delay(0).remove();
        d3.select("#Sequence").select(name).select(name1).transition().duration(view_time/5).delay(0).remove();
    }
}
sequenceinfo.prototype.mark =function () {
    width=this.width;
    height=this.height;

    for(let num=0;num<this.data.length;num++) {
        let name = "#g_sequence" + (num + 1);
        let g_sequence = d3.select("#Sequence").select(name)
        let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield"+num,0,0,1);
        g_sequence.append("rect")
            .attr("id","rect_g")
            .attr("x",x_smallfield*width)
            .attr("y",(num*0.08+0.01)*height)
            .attr("width",width_smallfield*width)
            .attr("height",height_smallfield*height)
            .attr("fill","gray")
            .attr("fill-opacity","0")
        let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
        phase_small.draw_path("link",1,2)
        phase_small.draw_node("node",2,"black",2);
    }
}
sequenceinfo.prototype.point_link =function () {
    width=this.width;
    height=this.height;

    for(let num=0;num<this.data.length;num++) {
        let name = "#g_sequence" + (num + 1);
        let g_sequence = d3.select("#Sequence").select(name)
        let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield"+num,0,0,1);
        g_sequence.append("rect")
            .attr("id","rect_g")
            .attr("x",x_smallfield*width)
            .attr("y",(num*0.08+0.01)*height)
            .attr("width",width_smallfield*width)
            .attr("height",height_smallfield*height)
            .attr("fill","gray")
            .attr("fill-opacity","0")
        let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
        phase_small.draw_path("link",0, 2)
        phase_small.draw_node("node",2,"black",2);
    }
}
sequenceinfo.prototype.worm =function () {
    width=this.width;
    height=this.height;

    for(let num=0;num<this.data.length;num++) {
        let name = "#g_sequence" + (num + 1);
        let g_sequence = d3.select("#Sequence").select(name)
        let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield"+num,0,0,1);
        g_sequence.append("rect")
            .attr("id","rect_g")
            .attr("x",x_smallfield*width)
            .attr("y",(num*0.08+0.01)*height)
            .attr("width",width_smallfield*width)
            .attr("height",height_smallfield*height)
            .attr("fill","gray")
            .attr("fill-opacity","0")
        let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
        phase_small.draw_path("link",1,2)
        phase_small.draw_node("node",0,"black",2);
    }
}
sequenceinfo.prototype.clear = function (type,oldtype) {
    width=this.width;
    height=this.height;

    for(let num=0;num<this.data.length;num++) {
        let name = "#g_sequence" + (num + 1);
        let name1 = "#smallfield" + num
        let g_sequence=d3.select(name)
        let name2 ="#g_arc"+num
        let name3 = "#align_g"+num
        let arc_g = d3.select("#Sequence").select(name).select(name2)
        let rect_g = d3.select("#Sequence").select(name).selectAll("#rect_g")
        let align_g = d3.select("#Sequence").select(name).select(name3)
        let g_proj = d3.select("#Sequence").select(name).selectAll("#g_proj")
        let field = d3.select("#Sequence").select(name).select(name1)
        let nodes = d3.select("#Sequence").select(name).select(name1).select("#node_container");
        let paths = d3.select("#Sequence").select(name).select(name1).select("#path_container")
        let name4 = "#rect_g_click"+num
        let name5 = "#arc_g_click"+num
        let name6 ="#align_g_click"+num
        d3.select("#Sequence").select(name).select(name4).attr("fill-opacity",0).attr("fill","gray").attr("id","rect_g")
        d3.select("#Sequence").select(name).select(name5).attr("fill-opacity",0).attr("fill","gray").attr("id","arc_g")
        d3.select("#Sequence").select(name).select(name6).attr("fill-opacity",0).attr("fill","gray").attr("id","align_g")
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
                        let x = d3.select(this).attr("x")
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
                        let y = d3.select(this).attr("y")
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
                            let id = parseInt(d3.select(this).attr("id").substring(10))
                            let y = (id * 0.05 + 0.02) * height
                            return "translate(" + 0.83 * width + "," + y + ")"
                        })
                        .select("#node_container")
                        .selectAll(".node")
                        .transition().duration(0.8* view_time).delay(0)
                        .attr("transform", function () {
                            let y = d3.select(this).attr("y")
                            let id = parseInt(d3.select(this).attr("id").substring(4))
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
                            let id = parseInt(d3.select(this).attr("id").substring(10))
                            let y = (id * 0.05 + 0.015) * height
                            return "translate(" + x_smallfield * width + "," + y + ")"
                        })
                        .select("#node_container")
                        .selectAll(".node")
                        .transition().duration(0.8 * view_time).delay(0)
                        .attr("transform", function () {
                            let y = d3.select(this).attr("y")
                            let id = parseInt(d3.select(this).attr("id").substring(4))
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
                            let id = parseInt(d3.select(this).attr("id").substring(10))
                            let y = (id * 0.05 + 0.015) * height
                            return "translate(" + x_smallfield * width + "," + y + ")"
                        })
                        .select("#node_container")
                        .selectAll(".node")
                        .transition().duration(0.8 * view_time).delay(0)
                        .attr("transform", function () {
                            let y = d3.select(this).attr("y")
                            let id = parseInt(d3.select(this).attr("id").substring(4))
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
                let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
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
                let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
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
                let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
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
                        let id=parseInt(d3.select(this).attr("id"))
                        console.log("id",id)
                        return "translate("+id*0.005*height+","+0+")"
                    })
                    .attr("r",0.005*height)

                field.transition().duration(0.5*view_time).delay(view_time).attr("transform",function () {
                    return "translate("+x_smallfield*width+","+(num*0.05+0.01)*height+")"
                })
                field.select("#gid").selectAll("cirlce")
                    .transition().duration(0.5*view_time).delay(0)
                    .attr("transform",function () {
                        let id=parseInt(d3.select(this).attr("id"))
                        console.log("id",id)
                        return "translate("+id*0.003*height+","+0+")"
                    })
                field.transition().duration(0).delay(2*view_time).remove()
                g_sequence.selectAll("#smallfield_remove").transition().delay(2*view_time).duration(0).remove()
            }
            else if(type==7)
            {
                let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
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
                        let id=parseInt(d3.select(this).attr("id"))
                        console.log("id",id)
                        return "translate("+id*0.005*height+","+0+")"
                    })
                    .attr("r",0.005*height)

                field.transition().duration(0.5*view_time).delay(view_time).attr("transform",function () {
                    return "translate("+x_smallfield*width+","+(num*0.05+0.01)*height+")"
                })
                field.select("#gid").selectAll("cirlce")
                    .transition().duration(0.5*view_time).delay(0)
                    .attr("transform",function () {
                        let id=parseInt(d3.select(this).attr("id"))
                        console.log("id",id)
                        return "translate("+id*0.003*height+","+0+")"
                    })
                field.transition().duration(0).delay(2*view_time).remove()
                g_sequence.selectAll("#smallfield_remove").transition().delay(2*view_time).duration(0).remove()
            }
            else if(type==8)
            {
                let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
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
                        let id=parseInt(d3.select(this).attr("id"))
                        console.log("id",id)
                        return "translate("+id*0.005*height+","+0+")"
                    })
                    .attr("r",0.005*height)

                field.transition().duration(0.5*view_time).delay(view_time).attr("transform",function () {
                    return "translate("+x_smallfield*width+","+(num*0.05+0.01)*height+")"
                })
                field.select("#gid").selectAll("cirlce")
                    .transition().duration(0.5*view_time).delay(0)
                    .attr("transform",function () {
                        let id=parseInt(d3.select(this).attr("id"))
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
                let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
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
                let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
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
                let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
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
                        let id=parseInt(d3.select(this).attr("id"))
                        console.log("id",id)
                        return "translate("+id*0.005*height+","+0+")"
                    })
                    .attr("r",0.005*height)

                field.transition().duration(0.5*view_time).delay(view_time).attr("transform",function () {
                    return "translate("+x_smallfield*width+","+(num*0.05+0.01)*height+")"
                })
                field.select("#gid").selectAll("cirlce")
                    .transition().duration(0.5*view_time).delay(0)
                    .attr("transform",function () {
                        let id=parseInt(d3.select(this).attr("id"))
                        console.log("id",id)
                        return "translate("+id*0.003*height+","+0+")"
                    })
                field.transition().duration(0).delay(2*view_time).remove()
                g_sequence.selectAll("#smallfield_remove").transition().delay(2*view_time).duration(0).remove()
            }
            else if(type==7)
            {
                let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
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
                        let id=parseInt(d3.select(this).attr("id"))
                        console.log("id",id)
                        return "translate("+id*0.005*height+","+0+")"
                    })
                    .attr("r",0.005*height)

                field.transition().duration(0.5*view_time).delay(view_time).attr("transform",function () {
                    return "translate("+x_smallfield*width+","+(num*0.05+0.01)*height+")"
                })
                field.select("#gid").selectAll("cirlce")
                    .transition().duration(0.5*view_time).delay(0)
                    .attr("transform",function () {
                        let id=parseInt(d3.select(this).attr("id"))
                        console.log("id",id)
                        return "translate("+id*0.003*height+","+0+")"
                    })
                field.transition().duration(0).delay(2*view_time).remove()
                g_sequence.selectAll("#smallfield_remove").transition().delay(2*view_time).duration(0).remove()
            }
            else if(type==8)
            {
                let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
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
                        let id=parseInt(d3.select(this).attr("id"))
                        console.log("id",id)
                        return "translate("+id*0.005*height+","+0+")"
                    })
                    .attr("r",0.005*height)

                field.transition().duration(0.5*view_time).delay(view_time).attr("transform",function () {
                    return "translate("+x_smallfield*width+","+(num*0.05+0.01)*height+")"
                })
                field.select("#gid").selectAll("cirlce")
                    .transition().duration(0.5*view_time).delay(0)
                    .attr("transform",function () {
                        let id=parseInt(d3.select(this).attr("id"))
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
                        let id = parseInt(d3.select(this).attr("id").substring(12))
                        return (x_smallfield)*width+0.005*height*id
                    })
                    .transition().delay(0.1*view_time).duration(0.5*view_time)
                    .attr("cx",function () {
                        let id = parseInt(d3.select(this).attr("id").substring(12))
                        return (x_smallfield)*width+0.005*height*id
                    })
                    .attr("cy",(num*0.08+0.01)*height)
                    .transition().delay(0.5*view_time).duration(0.5*view_time)
                    .attr("opacity",0)
            }

            if(type<4)
            {
                let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
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
                let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
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
                let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
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
                        let id = parseInt(d3.select(this).attr("id").substring(12))
                        return (x_smallfield+0.005*id)*width
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
                        let id = parseInt(d3.select(this).attr("id").substring(12))
                        return (x_smallfield+0.005*id)*width
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
                        let id = parseInt(d3.select(this).attr("id").substring(12))
                        return (x_smallfield)*width+0.005*height*id
                    })
                    .transition().delay(0.1*view_time).duration(0.5*view_time)
                    .attr("cx",function () {
                        let id = parseInt(d3.select(this).attr("id").substring(12))
                        return (x_smallfield)*width+0.005*height*id
                    })
                    .attr("cy",(num*0.08+0.01)*height)
                    .transition().delay(0.5*view_time).duration(0.5*view_time)
                    .attr("opacity",0)
            }

            if(type<4)
            {
                let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
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
                let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
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
                let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
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
                        let id = parseInt(d3.select(this).attr("id").substring(12))
                        return (x_smallfield+0.005*id)*width
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
                        let id = parseInt(d3.select(this).attr("id").substring(12))
                        return (x_smallfield+0.005*id)*width
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
                let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
                arc_g.select("path").transition().delay(0.2*view_time).duration(0.2*view_time).remove()
                arc_g.transition().delay(1.1*view_time).duration(0.3*view_time)
                    .attr("transform",function () {
                        return "translate("+x_smallfield*width+","+ (num*0.05+0.01)*height+")"
                    })
                    .transition().delay(0.2*view_time).duration(0.3*view_time)
                    .attr("transform",function () {
                        return "translate("+x_smallfield*width+","+ (num*0.08+0.01)*height+")"
                    })
                arc_g.selectAll("circle")
                    .transition().delay(0.3*view_time).duration(0.2*view_time)
                    .attr("r",4)
                    .attr("fill",function () {
                        let id = parseInt(d3.select(this).attr("id").substring(4))
                        return getEventColor(phase_small.nodes[id].eid)
                    })
                    .transition().delay(0.4*view_time).duration(0.3*view_time)
                    .attr("transform",function () {
                        let id = parseInt(d3.select(this).attr("id").substring(4))
                        return "translate("+id*0.005*height+","+ 0+")"
                    })
                    .transition().delay(0.4*view_time).duration(0.4*view_time)
                    .attr("transform",function () {
                        let id = parseInt(d3.select(this).attr("id").substring(4))
                        let x=phase_small.nodes[id].x/100*width_smallfield*width
                        let y=phase_small.nodes[id].y/100*height_smallfield*height
                        return "translate("+x+","+ y+")"
                    })
                    .transition().delay(0.5*view_time).duration(0.5*view_time)
                    .attr("opacity",0)
                arc_g.transition().delay(3*view_time).duration(0).remove()
                g_sequence.select("#smallfield_remove").remove()
            }
            else if(type==4)
            {
                let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
                arc_g.select("path").transition().delay(0.2*view_time).duration(0.2*view_time).remove()
                arc_g.transition().delay(1.1*view_time).duration(0.3*view_time)
                    .attr("transform",function () {
                        return "translate("+x_smallfield*width+","+ (num*0.05+0.01)*height+")"
                    })
                    .transition().delay(0.2*view_time).duration(0.3*view_time)
                    .attr("transform",function () {
                        return "translate("+x_smallfield*width+","+ (num*0.08+0.01)*height+")"
                    })
                arc_g.selectAll("circle")
                    .transition().delay(0.3*view_time).duration(0.2*view_time)
                    .attr("r",4)
                    .attr("fill",function () {
                        let id = parseInt(d3.select(this).attr("id").substring(4))
                        return getEventColor(phase_small.nodes[id].eid)
                    })
                    .transition().delay(0.4*view_time).duration(0.3*view_time)
                    .attr("transform",function () {
                        let id = parseInt(d3.select(this).attr("id").substring(4))
                        return "translate("+id*0.005*height+","+ 0+")"
                    })
                    .transition().delay(0.4*view_time).duration(0.4*view_time)
                    .attr("transform",function () {
                        let id = parseInt(d3.select(this).attr("id").substring(4))
                        let x=phase_small.nodes[id].x/100*width_smallfield*width
                        let y=phase_small.nodes[id].y/100*height_smallfield*height
                        return "translate("+x+","+ 0+")"
                    })
                    .transition().delay(0.5*view_time).duration(0.5*view_time)
                    .attr("opacity",0)
                arc_g.transition().delay(3*view_time).duration(0).remove()
                g_sequence.select("#smallfield_remove").remove()
            }
            else if(type == 5)
            {
                let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
                arc_g.select("path").transition().delay(0.2*view_time).duration(0.2*view_time).remove()
                arc_g.transition().delay(1.1*view_time).duration(0.3*view_time)
                    .attr("transform",function () {
                        return "translate("+x_smallfield*width+","+ (num*0.05+0.01)*height+")"
                    })
                    .transition().delay(0.2*view_time).duration(0.3*view_time)
                    .attr("transform",function () {
                        return "translate("+x_smallfield*width+","+ (num*0.08+0.01)*height+")"
                    })
                arc_g.selectAll("circle")
                    .transition().delay(0.3*view_time).duration(0.2*view_time)
                    .attr("r",4)
                    .attr("fill",function () {
                        let id = parseInt(d3.select(this).attr("id").substring(4))
                        return getEventColor(phase_small.nodes[id].eid)
                    })
                    .transition().delay(0.4*view_time).duration(0.3*view_time)
                    .attr("transform",function () {
                        let id = parseInt(d3.select(this).attr("id").substring(4))
                        return "translate("+id*0.005*height+","+ 0+")"
                    })
                    .transition().delay(0.4*view_time).duration(0.4*view_time)
                    .attr("transform",function () {
                        let id = parseInt(d3.select(this).attr("id").substring(4))
                        let x=phase_small.nodes[id].x/100*width_smallfield*width
                        let y=phase_small.nodes[id].y/100*height_smallfield*height
                        return "translate("+0+","+ y+")"
                    })
                    .transition().delay(0.5*view_time).duration(0.5*view_time)
                    .attr("opacity",0)
                arc_g.transition().delay(3*view_time).duration(0).remove()
                g_sequence.select("#smallfield_remove").remove()
            }
            else if(type==6|| type==7)
            {
                let smallqurt= new Field(g_sequence,x_smallfield*width,(num*0.08+0.01)*height,width_smallfield*width,height_smallfield*height,"smallfield_remove",0,0,0);
                let phase_small=new Sequence(smallqurt.fieldGroup,this.data[num]);
                arc_g.select("path").transition().delay(0.2*view_time).duration(0.2*view_time).remove()
                arc_g.transition().delay(1.1*view_time).duration(0.3*view_time)
                    .attr("transform",function () {
                        return "translate("+x_smallfield*width+","+ (num*0.05+0.02)*height+")"
                    })
                // .transition().delay(0.2*view_time).duration(0.3*view_time)
                // .attr("transform",function () {
                //     return "translate("+x_smallfield*width+","+ (num*0.08+0.01)*height+")"
                // })
                arc_g.selectAll("circle")
                    .transition().delay(0.3*view_time).duration(0.2*view_time)
                    .attr("r",0.005*height)
                    .attr("fill",function () {
                        let id = parseInt(d3.select(this).attr("id").substring(4))
                        return getEventColor(phase_small.nodes[id].eid)
                    })
                    .transition().delay(0.4*view_time).duration(0.3*view_time)
                    .attr("transform",function () {
                        let id = parseInt(d3.select(this).attr("id").substring(4))
                        return "translate("+id*0.005*height+","+ 0+")"
                    })
                // .transition().delay(0.4*view_time).duration(0.4*view_time)
                // .attr("transform",function () {
                //     let id = parseInt(d3.select(this).attr("id").substring(4))
                //     let x=phase_small.nodes[id].x/100*width_smallfield*width
                //     let y=phase_small.nodes[id].y/100*height_smallfield*height
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

sequenceinfo.prototype.viewtransform = function (type,time) {
    let val1 = sideSetting.sequenceTimeParams.value,
        val2 = sideSetting.sequenceStyleSel;
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
        // console.log("oldtype",oldtype)
        switch (+type)
        {
            case 0:this.clear(type,oldtype);this.point();break;
            case 1:this.clear(type,oldtype);this.point_link();break;
            case 2:this.clear(type,oldtype);this.mark();break;
            case 3:this.clear(type,oldtype);this.worm();break;
            case 4:this.clear(type,oldtype);this.proj(1);break;
            // case 5:this.clear(type,oldtype);this.proj(0);break;
            case 6:this.clear(type,oldtype);this.timealign();break;
            case 7:this.clear(type,oldtype);this.distancealign();break;
            case 8:this.clear(type,oldtype);this.donut();break;
        }
        oldtype=type;
        view_transform=0;
    }
}

