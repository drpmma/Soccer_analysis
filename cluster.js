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

var centreParams = 0;

ClusterManager.prototype.clusterize = function(style) {
    var i = 0;
    while(i < this.sequence.nodes.length)
    {
        var link = cm.sequence.links[i];
        var nodes = cm.sequence.nodes;
        var passCat;

        if(link == undefined)
            return;
        if(link.eid == E_PASS && (passCat = getPassCategory(link, nodes[link.source])) != SUB_CHAIN_TYPE_PASS_STANDARD){
            if(passCat == SUB_CHAIN_TYPE_PASS_CENTRE || passCat == SUB_CHAIN_TYPE_PASS_CORNER){
                console.log("1");
                centreParams = {
                    type: passCat,
                    entry: link.source,
                    exit: link.target,
                    links: [link],
                    nodes: [link.source,link.target],
                    time: link.time
                };
                console.log("centreParams:", centreParams);
                this.addCluster(centreParams.entry, centreParams.exit, CT_Centre);
                i=i+2;
            }
            else
            {
                console.log("2");
                this.addCluster(i, i, CT_Node_Link);
                i = i+1;
            }
        }
        else
            if(i != this.sequence.nodes.length -1) {
            switch (this.sequence.links[i].eid) {
                case E_PASS: case E_RUN:
                    var j = i;
                    while (j < this.sequence.links.length) {
                        var that = this.sequence;
                        var isPass = function(k)
                        {
                            return (that.links[k]!=undefined)&&(that.links[k].eid == E_PASS)&&(!isLongPass(that.links[k],that.nodes[k]));
                        };
                        if( (isPass(j))||
                            (this.sequence.links[j].eid == E_RUN&&isPass(j+1)))
                            j++;
                        else break;
                    }
                    if(j - i >= 3) {this.addCluster(i, j, style);i = j+1;}
                    else {this.addCluster(i, i, CT_Node_Link);i = i+1;}
                    break;
                case E_SHOT_CHANCE_MISSED:case E_SHOT_GOAL:case E_SHOT_MISS:case E_SHOT_POST:case E_SHOT_SAVED:
                    if(i == this.sequence.nodes.length-2) {this.addCluster(i, i+1, CT_Shoot);i = i+2;}
                    else {this.addCluster(i, i, CT_Node_Link);i = i+1;}
                    break;
                default: this.addCluster(i, i, CT_Node_Link);i = i+1;
            }
        }
        else
        {
            this.addCluster(this.sequence.nodes.length -1, this.sequence.nodes.length -1, CT_Node_Link);
            i = i+1;
        }
    }
};

ClusterManager.prototype.addCluster = function(start, end, type) {
    this.clusterNum++;
    this.clusters[this.clusterNum-1] = new Cluster(start, end, type, this.clusterNum-1,
                                                 this.sequence, this.originData, this.changeDuration);
};

ClusterManager.prototype.setDuration = function(duration) {
    this.changeDuration = duration;
    for(var i = 0; i < this.clusterNum; i++) this.clusters[i].setDuration(duration);
};

ClusterManager.prototype.clearAll = function() {
    for(var i = 0; i < this.clusterNum; i++) this.clusters[i].Clear();
    this.clusterGroup.remove();
};

ClusterManager.prototype.deleteOne = function() {
    if(this.chosen != -1) this.clusters[this.chosen].Clear();
    else this.clearAll();
};

ClusterManager.prototype.change = function(style) {
    if(this.chosen != -1 && this.clusters[this.chosen].type != CT_Shoot)
    {
        this.clusters[this.chosen].Clear();
        switch(style)
        {
            case CT_Node_Link: this.clusters[this.chosen].nodeLink();break;
            case CT_Node_Link_All: this.clusters[this.chosen].nodeLinkAll();break;
            case CT_Matrix: this.clusters[this.chosen].matrixVis();break;
            case CT_Tag_Cloud: this.clusters[this.chosen].tagCloud();break;
            case CT_Hive_Plot: this.clusters[this.chosen].hivePlot();break;
        }
    }
    else console.log("Error: There is nothing chosen to be changed");
};

ClusterManager.prototype.chooseCluster = function(num) {
    if(this.chosen != -1) this.clusters[this.chosen].dechosen();
    this.chosen = num;
    this.clusters[num].chosen();
};

Cluster = function(start, end, type, num) {
    console.log(start,end);
    var that = this;
    this.cg = cm.clusterGroup;
    this.start = start;
    this.end = end;
    this.type = type;
    this.num = num;
    this.sequence = cm.sequence;
    this.data = cm.originData;
    this.changeDuration = cm.changeDuration;
    this.isChosen = 0;
    this.cleared = 0;

    this.x_scale = d3.scaleLinear().domain([0,100]).range([0,this.cg.attr("width")]).clamp(true);
    this.y_scale = d3.scaleLinear().domain([0,100]).range([0,this.cg.attr("height")]).clamp(true);
    this.r_scale = function(r) {
        var wid = that.x_scale(r), hei = that.y_scale(r);
        if(wid<hei) return wid;
        else return hei;
    };

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
                              avgdx: this.x_scale(this.sequence.nodes[i].x), avgdy: this.y_scale(this.sequence.nodes[i].y)};
            this.player[j].coor.push({x: this.sequence.nodes[i].x, y: this.sequence.nodes[i].y, id: i});
            this.playerNum++;
        }
        else
        {
            this.player[j].avgdx = (+this.player[j].avgdx)+(+this.x_scale(this.sequence.nodes[i].x));
            this.player[j].avgdy = (+this.player[j].avgdy)+(+this.y_scale(this.sequence.nodes[i].y));
            this.player[j].coor.push({x: this.sequence.nodes[i].x, y: this.sequence.nodes[i].y, id: i});
        }
        this.playerIndex[i-start] = j;
    }
    var currentx = this.x_scale((this.minx+this.maxx)/2), currenty = this.y_scale((this.miny+this.maxy)/2);
    for(i = 0; i < this.playerNum; i++)
    {
        this.player[i].avgdx = this.player[i].avgdx / this.player[i].coor.length - currentx;
        this.player[i].avgdy = this.player[i].avgdy / this.player[i].coor.length - currenty;
    }

    //drag
    var drag = d3.drag()
        .on("drag", dragmove);
    var maxx = this.cg.attr("width"), maxy = this.cg.attr("height");
    function dragmove() {
        var width = d3.select(this).attr("width")/2, height = d3.select(this).attr("height")/2;
        var dx, dy;
        currentx = (+currentx) + (+d3.event.dx); currenty = (+currenty) + (+d3.event.dy);
        d3.select(this)
            .attr("transform", function() {
                if(currentx < 0-width) {
                    rex = 0 - width;
                    if (currentx - d3.event.dx > rex) dx = rex - currentx + d3.event.dx;
                    else dx = 0;
                }
                else if(currentx > maxx-width ) {
                    rex = maxx - width;
                    if(currentx - d3.event.dx < rex) dx = rex - currentx + d3.event.dx;
                    else dx = 0;
                }
                else
                {
                    rex = currentx;
                    if(currentx-d3.event.dx < 0-width) dx = currentx-(0-width);
                    else if(currentx-d3.event.dx > maxx-width) dx = currentx-(maxx-width);
                    else dx = d3.event.dx;
                }
                if(currenty < 0-height)
                {
                    rey = 0-height;
                    if (currenty - d3.event.dy > rey) dy = rey - currenty + d3.event.dy;
                    else dy = 0;
                }
                else if(currenty > maxy-height )
                {
                    rey = maxy-height;
                    if (currenty - d3.event.dy < rey) dy = rey - currenty + d3.event.dy;
                    else dy = 0;
                }
                else
                {
                    rey = currenty;
                    if(currenty-d3.event.dy < 0-height) dy = currenty-(0-height);
                    else if(currenty-d3.event.dy > maxy-height) dy = currenty-(maxy-height);
                    else dy = d3.event.dy;
                }
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

        for(var i = start; i <= end; i++)
        {
            var x = d3.select("#node_container").select("#node"+i).attr("x"),
                y = d3.select("#node_container").select("#node"+i).attr("y");
            x = (+x)+(+dx);
            y = (+y)+(+dy);
            resetNodePos(i, x, y, 0);
        }
        if(start>=1) repaintPath(start-1, 1, 0);
        if(that.type == CT_Shoot) for(i = start; i < end; i++) repaintPath(i, 2, 0);
        else if(that.type == CT_Centre) for(i = start; i < end; i++) repaintPath(i, 3, 0);
        else for(i = start; i < end; i++) repaintPath(i, 0, 0);
        if(end != seq.nodes.length-1) repaintPath(end, 1, 0);
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
                                            .attr("style","stroke:steelblue; fill:white; stroke-width:3;")})
        .on("mouseout", function(){if(that.isChosen == 0)
                                        d3.select(this).select("#clusterrect"+that.num)
                                            .attr("style","stroke:black; fill:white; stroke-width:1;")})
        .on("click", function(){cm.chooseCluster(that.num)})
        .call(drag)
        .append("rect")
        .attr("id","clusterrect" + this.num)
        .attr("x",0).attr("y",0).attr("width",0).attr("height",0)
        .attr("style","stroke:black; fill:white; stroke-width:1;")
        .attr("opacity", 0);
    this.cg.select("#cluster"+this.num).append("g").attr("id","subClusterGroup"+this.num).attr("opacity",0);

    switch (type) {
        case CT_Node_Link:
            this.nodeLink();
            break;
        case CT_Node_Link_All:
            this.nodeLinkAll();
            break;
        case CT_Hive_Plot:
            this.hivePlot();
            break;
        case CT_Tag_Cloud:
            this.tagCloud();
            break;
        case CT_Matrix:
            this.matrixVis();
            break;
        case CT_Shoot:
            this.shoot();
            break;
        case CT_Centre:
            this.centre(centreParams);
            break;
    }
};

Cluster.prototype.Clear = function() {
    if(this.cleared == 1) return;
    currentx = this.x_scale((this.minx+this.maxx)/2);
    currenty = this.y_scale((this.miny+this.maxy)/2);
    this.cg.select("#cluster"+this.num)
        .transition().duration(this.changeDuration)
        .attr("transform", "translate("+currentx+","+currenty+")").attr("x",currentx).attr("y",currenty)
        .attr("width",0).attr("height",0);
    this.cg.select("#clusterrect"+this.num)
        .transition().duration(this.changeDuration)
        .attr("x",0).attr("y",0).attr("width",0).attr("height",0)
        .attr("opacity", 0);
    this.cg.select("#subClusterGroup"+this.num)
        .remove();

    this.cg.select("#cluster"+this.num).append("g").attr("id","subClusterGroup"+this.num).attr("opacity","0");
    for(var i = this.start; i <= this.end; i++)
    {
        resetNodePos(i, +this.x_scale(seq.nodes[i].x), +this.y_scale(seq.nodes[i].y), this.changeDuration, this.changeDuration);
        resetNodeSize(i, seq.r, this.changeDuration, this.changeDuration);
        showNodeText(i, this.changeDuration, this.changeDuration);
    }
    if(this.start >= 1) repaintPath(this.start-1, -1,this.changeDuration, this.changeDuration*2);
    for(i = this.start; i < this.end; i++) repaintPath(i, -1, this.changeDuration, this.changeDuration*2)
    if(this.end != seq.nodes.length-1) repaintPath(this.end, -1, this.changeDuration, this.changeDuration*2);
    this.cleared = 1;
};

Cluster.prototype.nodeLink = function() {
    // var times_wid = this.playerNum * 0.1, times_hei = this.playerNum * 0.1;
    // var currentwid = this.x_scale(this.maxx - this.minx)*times_wid;
    // var currenthei = this.y_scale(this.maxy - this.miny)*times_hei;
    // if(currentwid < 6) currentwid = 26;else currentwid += 20;
    // if(currenthei < 6) currenthei = 26;else currenthei += 20;
    // var currentx=(+this.cg.select("#cluster"+this.num).attr("x"))+this.cg.select("#cluster"+this.num).attr("width")/2-currentwid/2;
    // var currenty=(+this.cg.select("#cluster"+this.num).attr("y"))+this.cg.select("#cluster"+this.num).attr("height")/2-currenthei/2;
    //
    // for(var i = this.start; i <= this.end; i++)
    // {
    //     for(var j = 0; j < this.playerNum; j++) if(this.player[j].pid == this.sequence.nodes[i].pid) break;
    //     resetNodePos(i, this.player[j].avgdx*times_wid+currentx+currentwid/2,
    //         this.player[j].avgdy*times_hei+currenty+currenthei/2, this.changeDuration, this.changeDuration);
    //     if(i == this.start || i == this.end)
    //     {
    //         resetNodeSize(i, seq.r*0.9, this.changeDuration, this.changeDuration);
    //         showNodeText(i, this.changeDuration, this.changeDuration);
    //     }
    //     else
    //     {
    //         if( this.sequence.nodes[i].pid == this.sequence.nodes[this.start].pid ||
    //             this.sequence.nodes[i].pid == this.sequence.nodes[this.end].pid)
    //             resetNodeSize(i, 0, this.changeDuration, this.changeDuration);
    //         else resetNodeSize(i, seq.r*0.3, this.changeDuration, this.changeDuration);
    //         hideNodeText(i, this.changeDuration, this.changeDuration);
    //     }
    // }
    // if(this.start >= 1) repaintPath(this.start-1,1,this.changeDuration, this.changeDuration*2);
    // for(i = this.start; i < this.end; i++) repaintPath(i, 0, this.changeDuration, this.changeDuration*2)
    // if(this.end != seq.nodes.length-1) repaintPath(this.end,1,this.changeDuration, this.changeDuration*2);
    //
    // this.cg.select("#cluster"+this.num)
    //     .transition().delay(this.changeDuration*2)
    //     .duration(this.changeDuration)
    //     .attr("transform", "translate("+currentx+","+currenty+")").attr("x", currentx).attr("y",currenty)
    //     .attr("width",currentwid)
    //     .attr("height",currenthei);
    // this.cg.select("#clusterrect"+this.num)
    //     .transition().delay(this.changeDuration*2)
    //     .duration(this.changeDuration)
    //     .attr("width",currentwid)
    //     .attr("height",currenthei)
    //     .attr("opacity", 1);
    var wid = +this.x_scale(17), hei = +this.y_scale(20), pad = 2;
    var currentwid = wid+2*pad;
    var currenthei = hei+2*pad;
    var currentx=(+this.cg.select("#cluster"+this.num).attr("x"))+this.cg.select("#cluster"+this.num).attr("width")/2-currentwid/2;
    var currenty=(+this.cg.select("#cluster"+this.num).attr("y"))+this.cg.select("#cluster"+this.num).attr("height")/2-currenthei/2;

    this.cg.select("#cluster"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("transform","translate("+currentx+","+currenty+")").attr("x", currentx).attr("y", currenty)
        .attr("width",currentwid)
        .attr("height",currenthei)
        .attr("opacity",0);
    this.cg.select("#clusterrect"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("width",currentwid)
        .attr("height",currenthei)
        .attr("opacity", 1);
    this.cg.select("#subClusterGroup"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("width",currentwid)
        .attr("height",currenthei);

    var tempf = new Field(this.cg.select("#subClusterGroup"+this.num), pad, pad, wid, hei, "clusterfield"+this.num, 0, 1,1);
    var tempp = new Players(tempf, data.players);

    for(var i = this.start; i <= this.end; i++)
    {
        var x, y;
        for(var j = 0; j < tempp.playerNum; j++)
            if(this.sequence.nodes[i].pid == tempp.pos[j].pid) break;
        if(j != tempp.playerNum)
        {
            x = tempf.x_scale(tempp.pos[j].x)+currentx+pad;
            y = tempf.y_scale(tempp.pos[j].y)+currenty+pad;
            resetNodePos(i, x, y, this.changeDuration, this.changeDuration);
            if (this.sequence.nodes[i].pid == this.sequence.nodes[this.start].pid ||
                this.sequence.nodes[i].pid == this.sequence.nodes[this.end].pid)
                resetNodeSize(i, tempf.r_scale(9), this.changeDuration, this.changeDuration);
            else resetNodeSize(i, tempf.r_scale(7), this.changeDuration, this.changeDuration);
            showNodeText(i, this.changeDuration, this.changeDuration);
        }
    }
    if(this.start >= 1) repaintPath(this.start-1,1,this.changeDuration, this.changeDuration*2);
    for(i = this.start; i < this.end; i++) repaintPath(i, 0, this.changeDuration, this.changeDuration*2)
    if(this.end != seq.nodes.length-1) repaintPath(this.end,1,this.changeDuration, this.changeDuration*2);

    this.cg.select("#cluster"+this.num)
        .transition().delay(this.changeDuration*2).duration(this.changeDuration)
        .attr("opacity", 1);

    this.type = CT_Node_Link;
    this.cleared = 0;
};

Cluster.prototype.nodeLinkAll = function() {
    var wid = +this.x_scale(17), hei = +this.y_scale(20), pad = 2;
    var currentwid = wid+2*pad;
    var currenthei = hei+2*pad;
    var currentx=(+this.cg.select("#cluster"+this.num).attr("x"))+this.cg.select("#cluster"+this.num).attr("width")/2-currentwid/2;
    var currenty=(+this.cg.select("#cluster"+this.num).attr("y"))+this.cg.select("#cluster"+this.num).attr("height")/2-currenthei/2;

    this.cg.select("#cluster"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("transform","translate("+currentx+","+currenty+")").attr("x", currentx).attr("y", currenty)
        .attr("width",currentwid)
        .attr("height",currenthei)
        .attr("opacity",0);
    this.cg.select("#clusterrect"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("width",currentwid)
        .attr("height",currenthei)
        .attr("opacity", 1);
    this.cg.select("#subClusterGroup"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("width",currentwid)
        .attr("height",currenthei);

    var tempf = new Field(this.cg.select("#subClusterGroup"+this.num), pad, pad, wid, hei, "clusterfield"+this.num, 0, 1,1);
    var tempp = new Players(tempf, data.players);

    for(var i = this.start; i <= this.end; i++)
    {
        var x, y;
        for(var j = 0; j < tempp.playerNum; j++)
            if(this.sequence.nodes[i].pid == tempp.pos[j].pid) break;
        if(j != tempp.playerNum)
        {
            x = tempf.x_scale(tempp.pos[j].x)+currentx+pad;
            y = tempf.y_scale(tempp.pos[j].y)+currenty+pad;
            resetNodePos(i, x, y, this.changeDuration, this.changeDuration);
            if (this.sequence.nodes[i].pid == this.sequence.nodes[this.start].pid ||
                this.sequence.nodes[i].pid == this.sequence.nodes[this.end].pid)
                resetNodeSize(i, tempf.r_scale(9), this.changeDuration, this.changeDuration);
            else resetNodeSize(i, tempf.r_scale(7), this.changeDuration, this.changeDuration);
            showNodeText(i, this.changeDuration, this.changeDuration);
        }
    }
    if(this.start >= 1) repaintPath(this.start-1,1,this.changeDuration, this.changeDuration*2);
    for(i = this.start; i < this.end; i++) repaintPath(i, 0, this.changeDuration, this.changeDuration*2)
    if(this.end != seq.nodes.length-1) repaintPath(this.end,1,this.changeDuration, this.changeDuration*2);

    this.cg.select("#cluster"+this.num)
        .transition().delay(this.changeDuration*2).duration(this.changeDuration)
        .attr("opacity", 1);
    this.cg.select("#subClusterGroup"+this.num)
        .transition().delay(this.changeDuration*2).duration(this.changeDuration)
        .attr("opacity", 1);

    this.type = CT_Node_Link_All;
    this.cleared = 0;
};

Cluster.prototype.hivePlot = function() {
    var num = this.playerNum;
    var r_step = +this.r_scale(1);
    var r_point = +this.r_scale(0.4);
    var r_node = +this.r_scale(1.2);
    var r_center = +this.r_scale(1);
    var currentwid = 2*(r_center+num*r_step+2*r_node);
    var currenthei = 2*(r_center+num*r_step+2*r_node);
    var currentx=(+this.cg.select("#cluster"+this.num).attr("x"))+this.cg.select("#cluster"+this.num).attr("width")/2-currentwid/2;
    var currenty=(+this.cg.select("#cluster"+this.num).attr("y"))+this.cg.select("#cluster"+this.num).attr("height")/2-currenthei/2;

    this.cg.select("#cluster"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("transform","translate("+currentx+","+currenty+")").attr("x", currentx).attr("y", currenty)
        .attr("width",currentwid)
        .attr("height",currenthei)
        .attr("opacity", 0);
    this.cg.select("#clusterrect"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("width",currentwid)
        .attr("height",currenthei)
        .attr("opacity", 1);
    this.cg.select("#subClusterGroup"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("width",currentwid)
        .attr("height",currenthei);
    for(var i = 0; i < num; i++)
    {
        var coor1 = coor_change(2*i*Math.PI/num, r_center),
            coor2 = coor_change(2*i*Math.PI/num, r_center+num*r_step),
            coor3 = coor_change(2*i*Math.PI/num, r_center+num*r_step+r_node);
        this.cg.select("#subClusterGroup"+this.num)
            .append("line")
            .attr("x1",coor1.x+currentwid/2).attr("y1",coor1.y+currenthei/2)
            .attr("x2",coor2.x+currentwid/2).attr("y2",coor2.y+currenthei/2)
            .attr("style","stroke:black;stroke-width:1;");
        this.cg.select("#subClusterGroup"+this.num)
            .append("circle")
            .attr("cx",coor3.x+currentwid/2).attr("cy",coor3.y+currenthei/2)
            .attr("r",r_node)
            .attr("style","fill:none;stroke:black;stroke-width:1;");
        this.cg.select("#subClusterGroup"+this.num)
            .append("text")
            .attr("x",coor3.x+currentwid/2).attr("y",coor3.y+currenthei/2)
            .attr("style","text-anchor: middle; dominant-baseline: middle; font-size:"+r_node)
            .text(pm.findJerseyByPid(this.player[i].pid));
    }

    for(i = this.start; i <= this.end; i++)
    {
        var coor = coor_change(2*this.playerIndex[i-this.start]*Math.PI/num, r_center+(i-this.start)*r_step);
        resetNodePos(i, coor.x+currentwid/2+currentx, coor.y+currenthei/2+currenty, this.changeDuration, this.changeDuration);
        resetNodeSize(i, r_point, this.changeDuration, this.changeDuration);
        hideNodeText(i, this.changeDuration, this.changeDuration);
    }
    if(this.start >= 1) repaintPath(this.start-1,1,this.changeDuration, this.changeDuration*2);
    for(i = this.start; i < this.end; i++) repaintPath(i, 0, this.changeDuration, this.changeDuration*2)
    if(this.end != seq.nodes.length-1) repaintPath(this.end,1,this.changeDuration, this.changeDuration*2);

    this.cg.select("#cluster"+this.num)
        .transition().delay(this.changeDuration*2).duration(this.changeDuration)
        .attr("opacity", 1);
    this.cg.select("#subClusterGroup"+this.num)
        .transition().delay(this.changeDuration*2).duration(this.changeDuration)
        .attr("opacity", 1);

    function coor_change(radian, radius) {
        coor = {x: radius * Math.cos(radian), y: radius * Math.sin(radian)};
        return coor;
    }

    this.type = CT_Hive_Plot;
    this.cleared = 0;
};

Cluster.prototype.tagCloud = function() {
    var that = this;
    var players = new Array();

    for (var i = 0; i < this.player.length; i++) {
        players.push({
            size: Math.floor(Math.random()*11+10),
            pid: that.player[i].pid,
            x: i,
            y: i,
            rotate: 0,
            text: pm.findNameByPid(that.player[i].pid)
        })
    }

    var currentwid = Math.max(+this.x_scale(10),d3.sum(players,function(d){return 2*d.size}));
    var currenthei = Math.max(+this.x_scale(10),d3.sum(players,function(d){return 2*d.size}));
    var currentx = (+this.cg.select("#cluster" + this.num).attr("x")) + this.cg.select("#cluster" + this.num).attr("width") / 2 - currentwid / 2;
    var currenty = (+this.cg.select("#cluster" + this.num).attr("y")) + this.cg.select("#cluster" + this.num).attr("height") / 2 - currenthei / 2;
    var size = 2;

    this.cg.select("#cluster" + this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("transform", "translate(" + currentx + "," + currenty + ")").attr("x", currentx).attr("y", currenty)
        .attr("width", currentwid)
        .attr("height", currenthei)
        .attr("opacity", 0);
    this.cg.select("#clusterrect" + this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("width", currentwid)
        .attr("height", currenthei)
        .attr("opacity", 1);
    this.cg.select("#subClusterGroup" + this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("width", currentwid)
        .attr("height", currenthei);

    var fill = d3.scaleOrdinal(d3.schemeCategory20);
    var drawn = 0;

    d3.layout.cloud().size([currentwid, currenthei])
        .words(players)
        .rotate(0)
        .font("Impact")
        .fontSize(function(d) { return d.size;})
        .on("end", draw)
        .start();

    function draw(words){
        if(words.length != players.length) return;
        drawn = 1;
        that.cg.select("#subClusterGroup"+that.num)
            .append("g")
            .attr("transform", "translate("+[currentwid/2,currenthei/2]+")")
            .selectAll("text.word")
            .data(words)
            .enter()
            .append("text")
            .attr("class","word")
            .style("font-size", function(d) { return d.size + "px"; })
            .attr("pid",function(d){return d.pid})
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(0)";
            })
            .text(function(d) { return d.text; })
            .on("mouseover", function(){d3.select(this).style("cursor","pointer");})
            .on("click", function(d){pm.reChoose(d.pid)});
        for(i = that.start; i <= that.end; i++)
        {
            for(j = 0; j < players.length; j++)
            if(that.sequence.nodes[i].pid == players[j].pid)
            {
                resetNodePos(i, currentx+currentwid/2+players[j].x+players[j].x0, currenty+currenthei/2+players[j].y+players[j].y0/2, that.changeDuration,that.changeDuration);
                resetNodeSize(i, size, that.changeDuration,that.changeDuration);
                hideNodeText(i, that.changeDuration,that.changeDuration)
            }
        }
    }

    if(!drawn)
    {
        this.Clear();
        this.tagCloud();
    }
    else
    {
        if(this.start >= 1) repaintPath(this.start-1,1,this.changeDuration,this.changeDuration*2);
        for(i = this.start; i < this.end; i++) repaintPath(i, 0, this.changeDuration,this.changeDuration*2)
        if(this.end != seq.nodes.length-1) repaintPath(this.end,1,this.changeDuration,this.changeDuration*2);

        this.cg.select("#cluster" + this.num)
            .transition().delay(this.changeDuration*2).duration(this.changeDuration)
            .attr("opacity", 1);
        this.cg.select("#subClusterGroup"+this.num)
            .transition().delay(this.changeDuration*2).duration(this.changeDuration)
            .attr("opacity", 1);

        this.type = CT_Tag_Cloud;
        this.cleared = 0;
    }
};

Cluster.prototype.matrixVis = function() {
    var num = this.playerNum;
    var that = this;
    var size = +this.r_scale(3), pad = 0;
    var currentwid = num*size+2*pad;
    var currenthei = num*size+2*pad;
    var currentx=(+this.cg.select("#cluster"+this.num).attr("x"))+this.cg.select("#cluster"+this.num).attr("width")/2-currentwid/2;
    var currenty=(+this.cg.select("#cluster"+this.num).attr("y"))+this.cg.select("#cluster"+this.num).attr("height")/2-currenthei/2;

    this.cg.select("#cluster"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("transform", "translate("+currentx+","+currenty+")").attr("x", currentx).attr("y",currenty)
        .attr("width",currentwid)
        .attr("height",currenthei)
        .attr("opacity",0);
    this.cg.select("#clusterrect"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("width",currentwid)
        .attr("height",currenthei)
        .attr("opacity", 1);
    this.cg.select("#subClusterGroup"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("width",currentwid)
        .attr("height",currenthei);
    for(var i = 0; i < num; i++)
    {
        for(var j = 0; j < num; j++) {
            this.cg.select("#subClusterGroup"+this.num)
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

        this.cg.select("#subClusterGroup"+this.num)
            .append("text")
            .attr("x",-size/2).attr("y",size*i+size*3/4)
            .attr("style","font-size:"+size+"; text-anchor: end")
            //.attr("transform","rotate(-90 "+(i*size)+","+0+")")
            .text(pm.findNameByPid(this.player[i].pid));
    }

    for(i = this.start; i <= this.end; i++)
    {
        for(j = 0; j < num; j++)
            if(this.sequence.nodes[i].pid == this.player[j].pid) break;
        resetNodePos(i, j*size+pad+currentx+size/2, j*size+pad+currenty+size/2, this.changeDuration,this.changeDuration);
        resetNodeSize(i,size/2,this.changeDuration,this.changeDuration);
        hideNodeText(i, this.changeDuration,this.changeDuration);
    }
    if(this.start >= 1) repaintPath(this.start-1,1,this.changeDuration,this.changeDuration*2);
    for(i = this.start; i < this.end; i++) repaintPath(i, 0, this.changeDuration,this.changeDuration*2)
    if(this.end != seq.nodes.length-1) repaintPath(this.end,1,this.changeDuration,this.changeDuration*2);

    this.cg.select("#cluster"+this.num)
        .transition().delay(this.changeDuration*2).duration(this.changeDuration)
        .attr("opacity",1);
    this.cg.select("#subClusterGroup"+this.num)
        .transition().delay(this.changeDuration*2).duration(this.changeDuration)
        .attr("opacity", 1);

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

    this.type = CT_Matrix;
    this.cleared = 0;
};

Cluster.prototype.shoot = function() {
    var wid = +this.y_scale(35), hei = +this.x_scale(27.5), pad = 2;
    var currentwid = wid+2*pad;
    var currenthei = hei+2*pad;
    var currentx=(+this.cg.select("#cluster"+this.num).attr("x"))+this.cg.select("#cluster"+this.num).attr("width")/2-currentwid/2;
    var currenty=(+this.cg.select("#cluster"+this.num).attr("y"))+this.cg.select("#cluster"+this.num).attr("height")/2-currenthei/2;

    this.cg.select("#cluster"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("transform","translate("+currentx+","+currenty+")").attr("x", currentx).attr("y", currenty)
        .attr("width",currentwid)
        .attr("height",currenthei)
        .attr("opacity", 0);
    this.cg.select("#clusterrect"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("width",currentwid)
        .attr("height",currenthei)
        .attr("opacity", 1);
    var clusterGroup = this.cg.select("#subClusterGroup"+this.num);

    clusterGroup.transition()
        .duration(this.changeDuration)
        .attr("width",currentwid)
        .attr("height",currenthei);

    this.shotVis = new ShotVis(this.sequence, clusterGroup, wid, hei, pad, this.start, this.end, currentx, currenty);
    this.shotVis.drawPosition(this.changeDuration);
    this.cg.select("#cluster"+this.num)
        .transition().delay(this.changeDuration*2).duration(this.changeDuration)
        .attr("opacity", 1);
    this.cg.select("#subClusterGroup"+this.num)
        .transition().delay(this.changeDuration*2).duration(this.changeDuration)
        .attr("opacity", 1);

    this.type = CT_Shoot;
    this.cleared = 0;
};

Cluster.prototype.centre = function (params) {
    var wid = +this.y_scale(20), hei = +this.x_scale(20), pad = 2;
    var currentwid = wid+2*pad;
    var currenthei = hei+2*pad;
    var currentx=(+this.cg.select("#cluster"+this.num).attr("x"))+this.cg.select("#cluster"+this.num).attr("width")/2-currentwid/2;
    var currenty=(+this.cg.select("#cluster"+this.num).attr("y"))+this.cg.select("#cluster"+this.num).attr("height")/2-currenthei/2;

    this.cg.select("#cluster"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("transform","translate("+currentx+","+currenty+")").attr("x", currentx).attr("y", currenty)
        .attr("width",currentwid)
        .attr("height",currenthei)
        .attr("opacity", 0);
    this.cg.select("#clusterrect"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("width",currentwid)
        .attr("height",currenthei)
        .attr("opacity", 1);
    var clusterGroup = this.cg.select("#subClusterGroup"+this.num);

    clusterGroup.transition()
        .duration(this.changeDuration)
        .attr("width",currentwid)
        .attr("height",currenthei);

    this.centreVis = new CentreVis(this.sequence, clusterGroup, wid, hei, pad, currentx, currenty, centreParams);

    this.centreVis.drawPosition(this.changeDuration);
    this.cg.select("#cluster"+this.num)
        .transition().delay(this.changeDuration*2).duration(this.changeDuration)
        .attr("opacity", 1);
    this.cg.select("#subClusterGroup"+this.num)
        .transition().delay(this.changeDuration*2).duration(this.changeDuration)
        .attr("opacity", 1);

    this.type = CT_Centre;
    this.cleared = 0;
};

Cluster.prototype.setDuration = function(duration) {
    this.changeDuration = duration;
};

Cluster.prototype.chosen = function() {
    this.isChosen = 1;
    this.cg.select("#clusterrect"+this.num)
        .transition()
        .duration(200)
        .attr("style", "stroke:darkred; fill:white; stroke-width:3;");
};

Cluster.prototype.dechosen = function() {
    this.isChosen = 0;
    this.cg.select("#clusterrect"+this.num)
        .transition()
        .duration(200)
        .attr("style", "stroke:black; fill:white; stroke-width:1;");
};

function resetNodePos(id, x, y, duration, delay) {
    if(delay == undefined) delay = 0;
    d3.select("#mainfield").select("#node_container").select("#node"+id)
        .attr("x",x).attr("y",y)
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("transform","translate("+x+","+y+")");
}

function resetNodeSize(id, r, duration, delay) {
    if(delay == undefined) delay = 0;
    d3.select("#mainfield").select("#node_container").select("#node"+id)
        .attr("size", r);
    d3.select("#mainfield").select("#node_container").select("#node"+id).select("circle")
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("r",r);
    d3.select("#mainfield").select("#node_container").select("#node"+id).select("path")
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("d","M "+(-0.4*r)+" "+(-0.9*r)+
            " L "+(-0.9*r)+" "+(-0.1*r)+
            " L "+(-0.8*r)+" "+(0.2*r)+
            " L "+(-0.6*r)+" "+(-0.1*r)+
            " L "+(-0.6*r)+" "+(0.7*r)+
            " L "+(0.6*r)+" "+(0.7*r)+
            " L "+(0.6*r)+" "+(-0.1*r)+
            " L "+(0.8*r)+" "+(0.2*r)+
            " L "+(0.9*r)+" "+(-0.1*r)+
            " L "+(0.4*r)+" "+(-0.9*r)+
            " Z");
    d3.select("#mainfield").select("#node_container").select("#node"+id).select("text")
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("style","text-anchor:middle; dominant-baseline:middle; font-size:"+r+"px;");
}

function hideNodeText(id, duration, delay) {
    if(delay == undefined) delay = 0;
    d3.select("#mainfield").select("#node_container").select("#node"+id).select("text")
        //.attr("opacity",1)
        .transition().delay(delay).duration(duration)
        .attr("opacity",0);
}

function showNodeText(id, duration, delay) {
    if(delay == undefined) delay = 0;
    d3.select("#mainfield").select("#node_container").select("#node"+id).select("text")
        //.attr("opacity",0)
        .transition().delay(delay).duration(duration)
        .attr("opacity",1);
}

function repaintPath(id, style, duration, delay) {
    if(delay == undefined) delay = 0;
    if(duration != 0)
    {
        d3.select("#mainfield").select("#path_container").select("#linkPath"+id)
            .attr("opacity",1)
            .transition().duration(duration)
            .attr("opacity",0);
        d3.select("#mainfield").select("#path_container").select("#linkPath"+id)
            .transition().delay(duration)
            .attr("style", function() {
                var stroke = d3.select("#mainfield").select("#path_container").select("#linkPath"+id).attr("stroke"),
                    stroke_width = d3.select("#mainfield").select("#path_container").select("#linkPath"+id).attr("stroke-width");
                switch(style)
                {
                    case -1: stroke = getEventColor(seq.links[id].eid); stroke_width = "2px"; break;
                    case 0: stroke = "gray"; stroke_width = "1px"; break;
                    case 1: stroke_width = "2px"; break;
                    case 2: stroke = getEventColor(seq.links[id].eid); stroke_width = "5px"; break;
                    case 3: stroke = "green"; stroke_width = "3px"; break;
                }
                return "stroke:" + stroke + "; stroke-width:" + stroke_width + "; fill: none;";
            })
            .attr("d", function() {
                // source and target are duplicated for straight lines
                var x_source = (+d3.select("#mainfield").select("#node_container").select("#node" + id).attr("x")),
                    y_source = (+d3.select("#mainfield").select("#node_container").select("#node" + id).attr("y")),
                    x_target = (+d3.select("#mainfield").select("#node_container").select("#node" + (id + 1)).attr("x")),
                    y_target = (+d3.select("#mainfield").select("#node_container").select("#node" + (id + 1)).attr("y"));
                switch (style) {
                    case -1: {
                        if (isLongPass(seq.links[id], seq.nodes[id])) {
                            return line(getArc(
                                x_source,
                                y_source,
                                x_target,
                                y_target,
                                10
                            ));
                        }
                        else {
                            return line([
                                {x: x_source, y: y_source}, {x: x_source, y: y_source},
                                {x: x_target, y: y_target}, {x: x_target, y: y_target}]);
                        }
                    }
                    case 2:
                    case 3:{
                        return line([{x: x_source, y: y_source}, {x: x_target, y: y_target}]);
                    }
                    case 0: {
                        return line(getArc(
                            x_source,
                            y_source,
                            x_target,
                            y_target,
                            2
                        ));
                    }
                    case 1: {
                        return "M" + x_source + " " + y_source +
                            "C" + x_target + " " + y_source +
                            " " + x_source + " " + y_target +
                            " " + x_target + " " + y_target;
                    }
                }
            })
            .transition().delay(delay-duration).duration(duration)
            .attr("opacity",1);
    }
    else
    {
        d3.select("#mainfield").select("#path_container").select("#linkPath"+id)
            .transition().duration(0)
            .attr("style", function() {
                var stroke = d3.select("#mainfield").select("#path_container").select("#linkPath"+id).attr("stroke"),
                    stroke_width = d3.select("#mainfield").select("#path_container").select("#linkPath"+id).attr("stroke-width");
                switch(style)
                {
                    case -1: stroke = getEventColor(seq.links[id].eid); stroke_width = "2px"; break;
                    case 0: stroke = "gray"; stroke_width = "1px"; break;
                    case 1: stroke_width = "2px"; break;
                    case 2: stroke = getEventColor(seq.links[id].eid); stroke_width = "5px"; break;
                    case 3: stroke = "green"; stroke_width = "3px"; break;
                }
                return "stroke:" + stroke + "; stroke-width:" + stroke_width + "; fill: none;";
            })
            .attr("d", function() {
                // source and target are duplicated for straight lines
                var x_source = (+d3.select("#mainfield").select("#node_container").select("#node" + id).attr("x")),
                    y_source = (+d3.select("#mainfield").select("#node_container").select("#node" + id).attr("y")),
                    x_target = (+d3.select("#mainfield").select("#node_container").select("#node" + (id + 1)).attr("x")),
                    y_target = (+d3.select("#mainfield").select("#node_container").select("#node" + (id + 1)).attr("y"));
                switch (style) {
                    case -1: {
                        if (isLongPass(seq.links[id], seq.nodes[id])) {
                            return line(getArc(
                                x_source,
                                y_source,
                                x_target,
                                y_target,
                                10
                            ));
                        }
                        else {
                            return line([
                                {x: x_source, y: y_source}, {x: x_source, y: y_source},
                                {x: x_target, y: y_target}, {x: x_target, y: y_target}]);
                        }
                    }
                    case 2:
                    case 3:{
                        return line([{x: x_source, y: y_source}, {x: x_target, y: y_target}]);
                    }
                    case 0: {
                        return line(getArc(
                            x_source,
                            y_source,
                            x_target,
                            y_target,
                            2
                        ));
                    }
                    case 1: {
                        return "M" + x_source + " " + y_source +
                            "C" + x_target + " " + y_source +
                            " " + x_source + " " + y_target +
                            " " + x_target + " " + y_target;
                    }
                }
            });
    }
}