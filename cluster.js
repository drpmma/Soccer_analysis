ClusterManager = function(field, sequence)
{
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

ClusterManager.prototype.addCluster = function(start, end, type)
{
    this.clusters[this.clusterNum] = new Cluster(this, start, end, type, this.clusterNum,
                                                 this.sequence, this.originData, this.changeDuration);
    this.clusterNum++;
};

ClusterManager.prototype.setDuration = function(duration)
{
    this.changeDuration = duration;
    for(var i = 0; i < this.clusterNum; i++) this.clusters[i].setDuration(duration);
}

ClusterManager.prototype.clearAll = function()
{
    for(var i = 0; i < this.clusterNum; i++) this.clusters[i].delete();
};

ClusterManager.prototype.chooseCluster = function(num)
{
    if(this.chosen != -1) this.clusters[this.chosen].dechosen();
    this.chosen = num;
    this.clusters[num].chosen();
};

Cluster = function(manager, start, end, type, num)
{
    this.cg = manager.clusterGroup;
    this.start = start;
    this.end = end;
    this.type = type;
    this.num = num;
    this.sequence = manager.sequence;
    this.data = manager.originData;
    this.changeDuration = manager.changeDuration;
    this.pad = 15;

    this.x_scale = d3.scaleLinear().domain([0,100]).range([0,this.cg.attr("width")]).clamp(true);
    this.y_scale = d3.scaleLinear().domain([0,100]).range([0,this.cg.attr("height")]).clamp(true);

    //calculate data
    this.minx = this.sequence.nodes[end].x;
    this.miny = this.sequence.nodes[end].y;
    this.maxx = this.sequence.nodes[end].x;
    this.maxy = this.sequence.nodes[end].y;
    for(var i = start; i < end; i++)
    {
        if(this.minx > this.sequence.nodes[i].x) this.minx = this.sequence.nodes[i].x;
        if(this.maxx < this.sequence.nodes[i].x) this.maxx = this.sequence.nodes[i].x;
        if(this.miny > this.sequence.nodes[i].y) this.miny = this.sequence.nodes[i].y;
        if(this.maxy < this.sequence.nodes[i].y) this.maxy = this.sequence.nodes[i].y;
    }

    var drag = d3.drag()
        .on("drag", dragmove);

    var currentx = this.x_scale(this.minx)-this.pad, currenty = this.y_scale(this.miny)-this.pad;
    var maxx = this.cg.attr("width"), maxy = this.cg.attr("height");
    function dragmove()
    {
        var width = d3.select(this).attr("width")/2, height = d3.select(this).attr("height")/2;
        currentx = (+currentx) + (+d3.event.dx); currenty = (+currenty) + (+d3.event.dy);
        d3.select(this)
            .attr("x", function() {
                if(currentx < 0-width) return 0-width;
                else if(currentx > maxx-width ) return maxx-width;
                else return currentx;
            })
            .attr("y", function() {
                if(currenty < 0-height) return 0-height;
                else if(currenty > maxy-height ) return maxy-height;
                else return currenty;
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
    this.cg.append("rect")
        .attr("id", "cluster" + this.num)
        .attr("x",currentx)
        .attr("y",currenty)
        .attr("width",(+this.x_scale(this.maxx - this.minx))+(+2*this.pad))
        .attr("height",(+2*this.pad)+(+this.y_scale(this.maxy - this.miny)))
        .attr("style","stroke:black; fill:whitesmoke; stroke-width:1;")
        .attr("opacity", 0)
        .on("mousedown", function(){currentx = d3.select(this).attr("x"); currenty = d3.select(this).attr("y");})
        .on("mouseover", function(){d3.select(this).style("cursor", "move")})
        .on("click", function(){manager.chooseCluster(that.num)})
        .call(drag);

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

Cluster.prototype.delete = function()
{

};

Cluster.prototype.nodeLink = function()
{
    var times = 0.5;
    var currentx = (+this.cg.select("#cluster"+this.num).attr("x")) + (+this.x_scale(this.maxx - this.minx)*(1-times)/2);
    var currenty = (+this.cg.select("#cluster"+this.num).attr("y")) + (+this.y_scale(this.maxy - this.miny)*(1-times)/2);

    this.cg.select("#cluster"+this.num)
        .transition()
        .duration(this.changeDuration)
        .attr("x", currentx)
        .attr("y", currenty)
        .attr("width",(+this.x_scale(this.maxx - this.minx)*times)+(+2*this.pad))
        .attr("height",(+this.y_scale(this.maxy - this.miny)*times)+(+2*this.pad))
        .attr("opacity", 1);
};

Cluster.prototype.nodeLinkAll = function()
{

};

Cluster.prototype.hivePlot = function()
{

};

Cluster.prototype.tagCloud = function()
{

};

Cluster.prototype.matrixVis = function()
{

};

Cluster.prototype.shoot = function()
{

};

Cluster.prototype.setDuration = function(duration)
{
    this.duration = duration;
};

Cluster.prototype.chosen = function()
{
    this.cg.select("#cluster"+this.num)
        .transition()
        .duration(200)
        .attr("style", "stroke:blue; fill:whitesmoke; stroke-width:2;");
};

Cluster.prototype.dechosen = function()
{
    this.cg.select("#cluster"+this.num)
        .transition()
        .duration(200)
        .attr("style", "stroke:black; fill:whitesmoke; stroke-width:1;");
};
