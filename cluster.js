ClusterManager = function(field, sequence) {
    this.field = field;
    this.sequence = sequence;
    this.changeDuration = 400;
    this.chosen = -1;

    this.clusterGroup = this.field.fieldGroup.insert("g","#path_container")
        .attr("id", "clusterGroup")
        .attr("transform", "translate(0,0)")
        .attr("width", this.field.fieldGroup.attr("width"))
        .attr("height", this.field.fieldGroup.attr("height"));

    this.originData = new Array(sequence.nodes.length);
    for(var i = 0; i < this.originData.length; i++)
        this.originData[i] = {
            x: sequence.nodes[i].x,
            y: sequence.nodes[i].y
        };

    this.clusterNum = 0;
    this.clusters = new Array();
};

ClusterManager.prototype.addCluster = function(start, end, type) {
    this.clusters[this.clusterNum] = new Cluster(start, end, type, this.clusterNum,
                                                 this.sequence, this.originData, this.changeDuration);
    this.clusterNum++;
};

ClusterManager.prototype.setDuration = function(duration) {
    this.changeDuration = duration;
    for(var i = 0; i < this.clusterNum; i++) this.clusters[i].setDuration(duration);
}

ClusterManager.prototype.clearAll = function() {
    for(var i = 0; i < this.clusterNum; i++) this.clusters[i].delete();
};

ClusterManager.prototype.chooseCluster = function(num) {
    if(this.chosen != -1) this.clusters[this.chosen].dechosen();
    this.chosen = num;
    this.clusters[num].chosen();
};

Cluster = function(start, end, type, num) {
    this.cg = cm.clusterGroup;
    this.start = start;
    this.end = end;
    this.type = type;
    this.num = num;
    this.sequence = cm.sequence;
    this.data = cm.originData;
    this.changeDuration = cm.changeDuration;
    this.isChosen = 0;

    this.x_scale = d3.scaleLinear().domain([0,100]).range([0,this.cg.attr("width")]).clamp(true);
    this.y_scale = d3.scaleLinear().domain([0,100]).range([0,this.cg.attr("height")]).clamp(true);

    //calculate data
    this.playerNum = 0;
    this.player = new Array();
    this.playerIndex = new Array();
    this.minx = this.sequence.nodes[end].x;
    this.miny = this.sequence.nodes[end].y;
    this.maxx = this.sequence.nodes[end].x;
    this.maxy = this.sequence.nodes[end].y;
    for(var i = start; i <= end; i++)
    {
        if(this.minx > this.sequence.nodes[i].x) this.minx = this.sequence.nodes[i].x;
        if(this.maxx < this.sequence.nodes[i].x) this.maxx = this.sequence.nodes[i].x;
        if(this.miny > this.sequence.nodes[i].y) this.miny = this.sequence.nodes[i].y;
        if(this.maxy < this.sequence.nodes[i].y) this.maxy = this.sequence.nodes[i].y;
        for(var j = 0; j < this.playerNum; j++)
            if(this.player[j].pid == this.sequence.nodes[i].pid) break;
        if(j == this.playerNum)
        {
            this.player[j] = {pid: this.sequence.nodes[i].pid, coor: new Array(),
                              avgx: this.sequence.nodes[i].x, avgy: this.sequence.nodes[i].y};
            this.player[j].coor.push({x: this.sequence.nodes[i].x, y: this.sequence.nodes[i].y, id: i});
            this.playerNum++;
        }
        else
        {
            this.player[j].avgx += this.sequence.nodes[i].x;
            this.player[j].avgy += this.sequence.nodes[i].y;
            this.player[j].coor.push({x: this.sequence.nodes[i].x, y: this.sequence.nodes[i].y, id: i});
        }
        this.playerIndex[i-start] = j;
    }
    for(i = 0; i < this.playerNum; i++)
    {
        this.player[i].avgx /= this.player[i].coor.length;
        this.player[i].avgy /= this.player[i].coor.length;
    }

    //drag
    var drag = d3.drag()
        .on("drag", dragmove);

    var currentx = this.x_scale((this.minx+this.maxx)/2), currenty = this.y_scale((this.miny+this.maxy)/2);
    var maxx = this.cg.attr("width"), maxy = this.cg.attr("height");
    function dragmove() {
        var width = d3.select(this).attr("width")/2, height = d3.select(this).attr("height")/2;
        currentx = (+currentx) + (+d3.event.dx); currenty = (+currenty) + (+d3.event.dy);
        d3.select(this)
            .attr("transform", function() {
                if(currentx < 0-width) rex = 0-width;
                else if(currentx > maxx-width ) rex = maxx-width;
                else rex = currentx;
                if(currenty < 0-height) rey = 0-height;
                else if(currenty > maxy-height ) rey = maxy-height;
                else rey = currenty;
                return "translate(" + rex + "," + rey + ")";
            })
            .attr("x", function() {
                if(currentx < 0-width) rex = 0-width;
                else if(currentx > maxx-width ) rex = maxx-width;
                else rex = currentx;
                return rex;
            })
            .attr("y", function() {
                if(currenty < 0-height) rey = 0-height;
                else if(currenty > maxy-height ) rey = maxy-height;
                else rey = currenty;
                return rey;
            });

        // for(var i = 0; i < cluster_chain[num].length; ++i) {
        //     var id = cluster_chain[num][i].id;
        //     d3.select("#Node" + id.toString())
        //         .attr("transform", function () {
        //             return "translate" + "(" + (d3.event.x + cluster_chain[num][i].x)
        //                 + "," + (d3.event.y + cluster_chain[num][i].y) + ")";
        //         });
        //     if(id != 0)
        //     {
        //         path = d3.select("#Path" + (id - 1).toString())
        //             .select("path");
        //         var d_array = path.attr("d").split(" ");
        //         path.attr("d", function () {
        //             return d_array[0] + " " + d_array[1] + " " + d_array[2] + " "
        //                 + d_array[3] + " " + (d3.event.x + cluster_chain[num][i].x) + " " + (d3.event.y + cluster_chain[num][i].y);
        //         })
        //     }
        //     if(id != phase.node.length - 1)
        //     {
        //         path = d3.select("#Path" + (id).toString())
        //             .select("path");
        //         var d_array = path.attr("d").split(" ");
        //         path.attr("d", function () {
        //             return d_array[0] + " " + (d3.event.x + cluster_chain[num][i].x) + " " + (d3.event.y + cluster_chain[num][i].y)
        //                 + " " +  d_array[3] + " " + d_array[4] + " " + d_array[5];
        //         })
        //     }
        // }
    }

    //rect
    var that = this;
    this.cg.append("g")
        .attr("id", "cluster" + this.num)
        .attr("transform", "translate("+currentx+","+currenty+")").attr("x",currentx).attr("y",currenty)
        .attr("width",0).attr("height",0)
        .on("mousedown", function(){currentx = d3.select(this).attr("x");
                                    currenty = d3.select(this).attr("y");})
        .on("mouseover", function(){d3.select(this).style("cursor", "move");
                                    if(that.isChosen == 0)
                                        d3.select(this).select("#clusterrect"+that.num)
                                            .attr("style","stroke:blue; fill:whitesmoke; stroke-width:1.5;")})
        .on("mouseout", function(){if(that.isChosen == 0)
                                        d3.select(this).select("#clusterrect"+that.num)
                                            .attr("style","stroke:black; fill:whitesmoke; stroke-width:1;")})
        .on("click", function(){cm.chooseCluster(that.num)})
        .call(drag)
        .append("rect")
        .attr("id","clusterrect" + this.num)
        .attr("x",0).attr("y",0).attr("width",0).attr("height",0)
        .attr("style","stroke:black; fill:whitesmoke; stroke-width:1;")
        .attr("opacity", 0);

    switch (type)
    {
        case CT_Node_Link: this.nodeLink(); break;
        case CT_Node_Link_All: this.nodeLinkAll(); break;
        case CT_Hive_Plot: this.hivePlot(); break;
        case CT_Tag_Cloud: this.tagCloud(); break;
        case CT_Matrix: this.matrixVis(); break;
        case CT_Shoot: this.shoot(); break;
    }
};

Cluster.prototype.delete = function() {

};

Cluster.prototype.nodeLink = function() {
    var times = 0.5;
    var currentwid = this.x_scale(this.maxx - this.minx)*times;
    var currenthei = this.y_scale(this.maxy - this.miny)*times;
    if(currentwid < 26) currentwid = 26; if(currenthei < 26) currenthei = 26;
    var currentx=(+this.cg.select("#cluster"+this.num).attr("x"))+this.cg.select("#cluster"+this.num).attr("width")/2-currentwid/2;
    var currenty=(+this.cg.select("#cluster"+this.num).attr("y"))+this.cg.select("#cluster"+this.num).attr("height")/2-currenthei/2;

    this.cg.select("#cluster"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("transform", "translate("+currentx+","+currenty+")").attr("x", currentx).attr("y",currenty)
        .attr("width",currentwid)
        .attr("height",currenthei);
    this.cg.select("#clusterrect"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("width",currentwid)
        .attr("height",currenthei)
        .attr("opacity", 1);
};

Cluster.prototype.nodeLinkAll = function() {
    var wid = 200, hei = 154, pad = 2;
    var currentwid = wid+2*pad;
    var currenthei = hei+2*pad;
    var currentx=(+this.cg.select("#cluster"+this.num).attr("x"))+this.cg.select("#cluster"+this.num).attr("width")/2-currentwid/2;
    var currenty=(+this.cg.select("#cluster"+this.num).attr("y"))+this.cg.select("#cluster"+this.num).attr("height")/2-currenthei/2;

    this.cg.select("#cluster"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("transform","translate("+currentx+","+currenty+")").attr("x", currentx).attr("y", currenty)
        .attr("width",currentwid)
        .attr("height",currenthei);
    this.cg.select("#clusterrect"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("width",currentwid)
        .attr("height",currenthei)
        .attr("opacity", 1);

    var tempf = new Field(this.cg.select("#cluster"+this.num), pad, pad, wid, hei, "clusterfield"+this.num, 0, 1,1);
    var tempp = new Players(tempf, data.players);
};

Cluster.prototype.hivePlot = function() {
    var num = this.playerNum;
    var r_step = 6;
    var r_point = 2;
    var r_node = 10;
    var r_center = 5;
    var currentwid = 2*(r_center+num*r_step+2*r_node);
    var currenthei = 2*(r_center+num*r_step+2*r_node);
    var currentx=(+this.cg.select("#cluster"+this.num).attr("x"))+this.cg.select("#cluster"+this.num).attr("width")/2-currentwid/2;
    var currenty=(+this.cg.select("#cluster"+this.num).attr("y"))+this.cg.select("#cluster"+this.num).attr("height")/2-currenthei/2;

    this.cg.select("#cluster"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("transform","translate("+currentx+","+currenty+")").attr("x", currentx).attr("y", currenty)
        .attr("width",currentwid)
        .attr("height",currenthei);
    this.cg.select("#clusterrect"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("width",currentwid)
        .attr("height",currenthei)
        .attr("opacity", 1);
    for(var i = 0; i < num; i++)
    {
        var coor1 = coor_change(2*i*Math.PI/num, r_center),
            coor2 = coor_change(2*i*Math.PI/num, r_center+num*r_step),
            coor3 = coor_change(2*i*Math.PI/num, r_center+num*r_step+r_node);
        this.cg.select("#cluster"+this.num)
            .append("line")
            .attr("x1",coor1.x+currentwid/2).attr("y1",coor1.y+currenthei/2)
            .attr("x2",coor2.x+currentwid/2).attr("y2",coor2.y+currenthei/2)
            .attr("style","stroke:black;stroke-width:1;");
        this.cg.select("#cluster"+this.num)
            .append("circle")
            .attr("cx",coor3.x+currentwid/2).attr("cy",coor3.y+currenthei/2)
            .attr("r",r_node)
            .attr("style","fill:none;stroke:black;stroke-width:1;");
        this.cg.select("#cluster"+this.num)
            .append("text")
            .attr("x",coor3.x+currentwid/2).attr("y",coor3.y+currenthei/2)
            .attr("style","text-anchor: middle; dominant-baseline: middle; font-size:"+r_node)
            .text(pm.findJerseyByPid(this.player[i].pid));
    }

    for(i = this.start; i <= this.end; i++)
    {
        var coor = coor_change(2*this.playerIndex[i-this.start]*Math.PI/num, r_center+(i-this.start)*r_step);
        console.log(coor);
        this.cg.select("#cluster"+this.num)
            .append("circle")
            .attr("cx",coor.x+currentwid/2).attr("cy",coor.y+currenthei/2)
            .attr("r",r_point)
            .attr("style","fill:black;stroke:black;stroke-width:1;");
    }

    function coor_change(radian, radius) {
        coor = {x: radius * Math.cos(radian), y: radius * Math.sin(radian)};
        return coor;
    }
};

Cluster.prototype.tagCloud = function() {

};

Cluster.prototype.matrixVis = function() {
    var num = this.playerNum;
    var that = this;
    var size = 5, pad = 0;
    var currentwid = num*size+2*pad;
    var currenthei = num*size+2*pad;
    var currentx=(+this.cg.select("#cluster"+this.num).attr("x"))+this.cg.select("#cluster"+this.num).attr("width")/2-currentwid/2;
    var currenty=(+this.cg.select("#cluster"+this.num).attr("y"))+this.cg.select("#cluster"+this.num).attr("height")/2-currenthei/2;

    this.cg.select("#cluster"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("transform", "translate("+currentx+","+currenty+")").attr("x", currentx).attr("y",currenty)
        .attr("width",currentwid)
        .attr("height",currenthei);
    this.cg.select("#clusterrect"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("width",currentwid)
        .attr("height",currenthei)
        .attr("opacity", 1);
    for(var i = 0; i < num; i++)
        for(var j = 0; j < num; j++)
        {
            this.cg.select("#cluster"+this.num)
                .append("rect")
                .attr("id","clustersubrect"+this.num)
                .attr("style", function() {
                    var color;
                    var times;
                    if(i==j) {
                        if( that.player[i].pid == that.sequence.nodes[that.start].pid ||
                            that.player[i].pid == that.sequence.nodes[that.end].pid)
                            color = chooseColorByTimes(-1);
                        else color = chooseColorByTimes(-2);
                        return "stroke:black;stroke-width:1;"+"fill:"+color+";";
                    }
                    else {
                        times = 0;
                        for(var k = that.start; k < that.end; k++)
                            if(that.sequence.nodes[k].pid == that.player[j].pid&&that.sequence.nodes[k+1].pid == that.player[i].pid)
                                times++;
                        color = chooseColorByTimes(times);
                        return "fill:"+color+";";
                    }

                })
                .attr("x",0)
                .attr("y",0)
                .attr("width",0)
                .attr("height",0)
                .transition().duration(this.changeDuration)
                .attr("x",i*size+pad)
                .attr("y",j*size+pad)
                .attr("width",size)
                .attr("height",size);
        }

    function chooseColorByTimes(times) {
        if(times>=3) level = 2;
        else if(times>=1) level = 1;
        else level = times;

        switch (level)
        {
            case -1:r =   0; g = 255; b =   0; break;
            case -2:r = 255; g = 255; b = 255; break;
            case 0: r = 127; g = 127; b = 127; break;
            case 1: r =   0; g =   0; b = 255; break;
            case 2: r = 255; g =   0; b =   0; break;
        }
        return "rgb("+r+","+g+","+b+")";
    }
};

Cluster.prototype.shoot = function() {

};

Cluster.prototype.setDuration = function(duration) {
    this.duration = duration;
};

Cluster.prototype.chosen = function() {
    this.isChosen = 1;
    this.cg.select("#clusterrect"+this.num)
        .transition()
        .duration(200)
        .attr("style", "stroke:red; fill:whitesmoke; stroke-width:2;");
};

Cluster.prototype.dechosen = function() {
    this.isChosen = 0;
    this.cg.select("#clusterrect"+this.num)
        .transition()
        .duration(200)
        .attr("style", "stroke:black; fill:whitesmoke; stroke-width:1;");
};
