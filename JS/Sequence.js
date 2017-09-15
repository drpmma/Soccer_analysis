var CLUSTERALGORITHMMODE = "k-means" ;
var AllFlag = false;

Sequence = function (field, sequence) {
    this.field = field;
    this.sequence = sequence;
    this.width = field.attr("width");
    this.height = field.attr("height");
    this.x_scale = d3.scaleLinear().domain([0,100]).range([0, this.width]).clamp(true);
    this.y_scale = d3.scaleLinear().domain([0,100]).range([0, this.height]).clamp(true);
    this.computeNodeLinks();
}

Sequence.prototype.computeNodeLinks = function(){
    this.nodes = [];
    this.links = [];

    //console.log(this.actions);

    var nodeIndex = 0;
    for(var a = 0; a<this.sequence.actions.length; a++,nodeIndex++){
        var action = this.sequence.actions[a];

        //if a pass
        var previous_action = this.sequence.actions[a-1];
        if(action.eid == E_PASS && previous_action != undefined && previous_action.eid == E_PASS){
            //get the pass destination of the previous pass, i.e. the run start
            var passDest = getPassDestPosition(previous_action);
            var run_eid = (isLongRunAndPass(action, previous_action)) ? E_LONG_RUN : E_RUN;

            //if run too short to be considered, just add the pass
            if(run_eid == E_RUN && ignorePassRun(passDest,{x:action.x,y:action.y})){
                //add the node starting the pass
                this.nodes[nodeIndex] = {
                    index: nodeIndex,
                    unique_id: action.id,
                    additional: true,
                    after_run: true,
                    eid: action.eid,
                    pid: action.pid,
                    time: action.time,
                    x: action.x,
                    y: action.y
                };

                //add the pass link
                this.links.push({
                    source: nodeIndex,
                    target: nodeIndex+1,
                    eid: action.eid,
                    qualifiers: action.qualifiers,
                    time: action.time,
                    unique_id: action.id
                });
            }

            //if a long run or a pass and run then consider the run
            else{
                //add the node starting the run
                this.nodes[nodeIndex] = {
                    index: nodeIndex,
                    unique_id: action.id,
                    time: action.time,
                    eid: run_eid,
                    pid: action.pid,
                    x: passDest.x,
                    y: passDest.y
                };

                //add the run link
                this.links.push({
                    source: nodeIndex,
                    target: nodeIndex+1,
                    eid: run_eid,
                    qualifiers: action.qualifiers,
                    time: action.time,
                    unique_id: action.id
                });

                nodeIndex++;

                //add the node starting the pass
                this.nodes[nodeIndex] = {
                    index: nodeIndex,
                    unique_id: action.id,
                    additional: true,
                    after_run: true,
                    eid: action.eid,
                    pid: action.pid,
                    time: action.time,
                    x: action.x,
                    y: action.y
                };

                //add the pass link
                this.links.push({
                    source: nodeIndex,
                    target: nodeIndex+1,
                    eid: action.eid,
                    qualifiers: action.qualifiers,
                    time: action.time,
                    unique_id: action.id
                });
            }
        }

        //if not the last event and not a pass
        else if(a<this.sequence.actions.length-1){
            this.nodes[nodeIndex] = {
                index: nodeIndex,
                unique_id: action.id,
                time: action.time,
                eid: action.eid,
                pid: action.pid,
                x: action.x,
                y: action.y
            };

            this.links.push({
                source: nodeIndex,
                target: nodeIndex+1,
                eid: action.eid,
                qualifiers: action.qualifiers,
                time: action.time,
                unique_id: action.id
            });
        }

        //if last event, create the endShot node and the link between player doing the shot and the shot destination
        else{

            this.nodes[nodeIndex] = {
                index: nodeIndex,
                unique_id: action.id,
                pid: action.pid,
                eid: action.eid,
                time: action.time,
                x: action.x,
                y: action.y
            };

            //get the y destination of the shot
            var shotDest = getShotDestination(action);
            var shotX, shotY;
            switch(shotDest.type){
                case SHOT_DEST_TYPE_MOUTH:
                    shotX = 100;
                    shotY = shotDest.y;
                    break;
                case SHOT_DEST_TYPE_BLOCKED:
                    shotX = shotDest.x;
                    shotY = shotDest.y;
                    break;
                default: throw "unknows shot dest type in: "+shotDest;
            }

            this.nodes[nodeIndex+1] = {
                index: nodeIndex+1,
                unique_id: action.id,
                additional: true,
                time: action.time,
                eid: PID_SHOT_DEST,
                pid: PID_SHOT_DEST,
                x: shotX,
                y: shotY
            };
            this.links.push({
                source: nodeIndex,
                target: nodeIndex+1,
                eid: action.eid,
                qualifiers: action.qualifiers,
                time: action.time,
                unique_id: action.id
            });
            nodeIndex++;
        }
    }
    var i = 0;
    while(i < this.nodes.length) {
        var link = this.links[i];
        var nodes = this.nodes;
        var passCat;
        if(link == undefined) break;
        if(link.eid == E_PASS && (passCat = getPassCategory(link, nodes[i])) != SUB_CHAIN_TYPE_PASS_STANDARD){
            if(passCat == SUB_CHAIN_TYPE_PASS_CENTRE || passCat == SUB_CHAIN_TYPE_PASS_CORNER) {
                nodes.splice(i+1,0,{
                    index: i+1,
                    unique_id: nodes[i+1].unique_id,
                    additional: nodes[i+1].additional,
                    after_run: nodes[i+1].after_run,
                    eid: nodes[i+1].eid,
                    pid: nodes[i+1].pid,
                    time: nodes[i+1].time,
                    x: nodes[i+1].x,
                    y: nodes[i+1].y
                });
                this.links.splice(i+1,0,{
                    source: i+1,
                    target: i+2,
                    eid: E_DUPLICATE
                })
                i=i+2;
            }
            else i++;
        }
        else
        if(i != this.nodes.length -1) {
            switch (this.links[i].eid) {
                case E_PASS: case E_RUN:
                var j = i;
                while (j < this.links.length) {
                    var that = this;
                    var isPass = function(k)
                    {
                        return (that.links[k]!=undefined)&&(that.links[k].eid == E_PASS)&&(!isLongPass(that.links[k],that.nodes[k]));
                    };
                    if( (isPass(j))||
                        (this.links[j].eid == E_RUN&&isPass(j+1)))
                        j++;
                    else break;
                }
                if(j - i >= 3) i = j;
                else i = i+1;
                break;
                case E_SHOT_CHANCE_MISSED:
                case E_SHOT_GOAL:
                case E_SHOT_MISS:
                case E_SHOT_POST:
                case E_SHOT_SAVED:
                    if (i == this.nodes.length - 2) {
                        if(i!=0 && this.links[i-1].eid != E_DUPLICATE)
                        {
                            nodes.splice(i,0,{
                                index: i,
                                unique_id: nodes[i].unique_id,
                                additional: nodes[i].additional,
                                after_run: nodes[i].after_run,
                                eid: nodes[i].eid,
                                pid: nodes[i].pid,
                                time: nodes[i].time,
                                x: nodes[i].x,
                                y: nodes[i].y
                            });
                            this.links.splice(i,0,{
                                source: i,
                                target: i+1,
                                eid: E_DUPLICATE
                            })
                            i = i + 2;
                        }
                        else i++;
                    }
                    else i++;
                    break;
                default: i = i+1;
            }
        }
        else i++;
    }
    for(i = 0; i< this.nodes.length-1;i++)
    {
        this.links[i].source = i;
        this.links[i].target = i+1;
    }
    //console.log(this.nodes);
    for(i = 0; i<this.nodes.length;i++) this.nodes[i].index = i;
};

Sequence.prototype.draw_node = function (group, r, color, isTransition, onTransition, fieldID)
{
    this.r = r;
    var that = this;
    var durationTime = 0;
    if(isTransition == 1)
        durationTime = time;
    if(isTransition == 2)
        durationTime =view_time*0.5;
    this.node_container = this.field.append("g")
        .attr("id", "node_container");
    this.node_container.selectAll("g").data(this.nodes).enter()
        .append("g").attr("class", "node")
        .attr("id", function (d, i) {
            return group + i;
        })
        .attr("transform", function (d) {
            return "translate(" + that.scale(d.x, d.y) + ")";
        })
        .attr("x",function(d){return that.x_scale(d.x);})
        .attr("y",function(d){return that.y_scale(d.y);})
        .attr("size", r)
        .on("mouseover", function(){d3.select(this).style("cursor", "pointer")})
        .on("click", function(d) {pm.reChoose(d.pid);})
        .append("circle")
        .attr("x",0)
        .attr("y",0)
        .attr("r",0)
        .attr("r", r)
        .attr("stroke", "black")
        .attr("stroke-width", "1px;")
        .attr("fill", function (d) {
            if (color=="white") return "white"
            return getEventColor(d.eid);
        })
        // .attr("opacity", 0)
        // .transition().delay(function (d, i) {return durationTime * i;})
        // .duration(durationTime)
        // .attr("opacity", 1)


    this.node_container
        .selectAll(".node")
        .append("text")
        .attr("x",0).attr("y",0)
        .attr("style","text-anchor:middle; dominant-baseline:middle; font-size:"+r+"px;")
        .text(function (d, i) {
            return pm.findJerseyByPid(that.nodes[i].pid)
        })
        .attr("opacity", 0);

    this.node_container
        .selectAll(".node")
        .select("text")
        .transition()
        .delay(function () {
            return that.nodes.length * durationTime + 500;
        })
        .duration(1000)
        .attr("opacity", 1);

    this.node_container
        .selectAll(".node")
        .attr("opacity", 0)
        .transition()
        .delay(function (d, i) {
            if(isTransition ==2) return durationTime*4;
            return i * durationTime;
        })
        .duration(durationTime)
        .attr("opacity", 1)
        .on("start", function (d, i) {
            if(isTransition === 1 && i === 0) {
                onTransition[fieldID] = 1;
            }
        })
        .on("end", function (d, i) {
            if(isTransition === 1)
                if(that.nodes.length - 1 === i) {
                    onTransition[fieldID] = 0;
                    d3.select("#mouse_field")
                        .transition()
                        .duration(500).remove();
                }
        });

    if(isTransition === 1)
        d3.select("#mouse_field")
            .transition()
            .delay(function () {
                if(isTransition == 2) return 2*durationTime;
                return that.nodes.length * durationTime;
            })
            .duration(500)
            .remove();

    return this.node_container;
}

Sequence.prototype.draw_path = function (group, gray, isTransition) {
    console.log("view_time",view_time);
    var durationTime = 0;
    if(isTransition == 1)
        durationTime = time;
    if(isTransition == 2)
        durationTime =view_time*0.5;
    var that = this;
    this.path_container = this.field.append("g")
        .attr("id", "path_container");
    // this.path_container.selectAll("g").data(this.links).enter()
    //     .append("g")
    //     .attr("class", function (d) {
    //         return "link " + getEventName(d.eid);
    //     })
    //     .append("path")
    //     .attr("stroke-width",0)
    //     .attr("stroke","white")
    //     .attr("d", function(d){
    //         // source and target are duplicated for straight lines
    //         var x_source = parseFloat(that.x_scale(that.nodes[d.source].x)),
    //             y_source = parseFloat(that.y_scale(that.nodes[d.source].y)),
    //             x_target = parseFloat(that.x_scale(that.nodes[d.target].x)),
    //             y_target = parseFloat(that.y_scale(that.nodes[d.target].y));
    //         if(isLongPass(d,that.nodes[d.source])){
    //             return line(getArc(
    //                 x_source,
    //                 y_source,
    //                 x_source,
    //                 y_source,
    //                 10
    //             ));
    //         }
    //         else{
    //             return line([
    //                 {x:x_source, y:y_source}, {x:x_source, y:y_source},
    //                 {x:x_source, y:y_source}, {x:x_source, y:y_source}]);
    //         }
    //     })
    //     .attr("id", function (d, i) {
    //         return group + i;
    //     })
    //     .attr("stroke", function (d) {
    //         if(gray==0)
    //         return getEventColor(d.eid);
    //         else
    //             return "lightgray"
    //     })
    //     .attr("stroke-width",function () {
    //         if(gray==1)
    //             return "10px";
    //         else
    //             return "1px"
    //     })
    //     .attr("fill", "none")
    //     .attr("class", function(d){
    //         var line_style = "";
    //         if(gray==1) return "plain"
    //         if(C_SHOT.indexOf(d.eid)!=-1) line_style = "plain";
    //         else if(that.nodes[d.source].pid == that.nodes[d.target].pid) {
    //             if(that.nodes[d.source].unique_id == that.nodes[d.target].unique_id) {
    //                 line_style = "dotted";
    //             }
    //             else line_style = "plain";
    //         }
    //         else line_style = "dashed";
    //
    //         return line_style;
    //     })
    //     .each(function(d){
    //         if(d.eid == E_RUN || d.eid == E_LONG_RUN) {
    //             //d3.select(this).style("stroke-opacity",0); TODO - if can fix the squiggly lines, remove the remaining of this function
    //
    //             d3.select(this).attr("class","plain");
    //
    //             //draw a squiggly line
    //             var x_source = that.x_scale(that.nodes[d.source].x),
    //                 y_source = that.y_scale(that.nodes[d.source].y),
    //                 x_target = that.x_scale(that.nodes[d.target].x),
    //                 y_target = that.y_scale(that.nodes[d.target].y);
    //             return line([
    //                 {x:x_source, y:y_source}, {x:x_source, y:y_source},
    //                 {x:x_target, y:y_target}, {x:x_target, y:y_target}]);
    //         }
    //     })
    //     .style("filter", function(d){
    //         if(isLongPass(d,that.nodes[d.source])) return "url(#shadow-pass)";
    //         return "";
    //     })
    //     .attr("id",function(d,i){return "linkPath"+i})
    //     .attr("d", function(d){
    //         // source and target are duplicated for straight lines
    //         var x_source = parseFloat(that.x_scale(that.nodes[d.source].x)),
    //             y_source = parseFloat(that.y_scale(that.nodes[d.source].y)),
    //             x_target = parseFloat(that.x_scale(that.nodes[d.target].x)),
    //             y_target = parseFloat(that.y_scale(that.nodes[d.target].y));
    //         if(isLongPass(d,that.nodes[d.source])){
    //             return line(getArc(
    //                 x_source,
    //                 y_source,
    //                 x_target,
    //                 y_target,
    //                 10
    //             ));
    //         }
    //         else{
    //             return line([
    //                 {x:x_source, y:y_source}, {x:x_source, y:y_source},
    //                 {x:x_target, y:y_target}, {x:x_target, y:y_target}]);
    //         }
    //     })
    //     .attr("opacity", 0)
    //     .transition()
    //     .delay(function (d, i) {
    //         if(isTransition==2) return durationTime*4;
    //         return durationTime * (i + 1);
    //     })
    //     .duration(durationTime)
    //     .attr("opacity", 1);
    let temp = this.path_container.selectAll("g").data(this.links).enter()
        .append("g")
        .attr("class", function (d) {
            return "link " + getEventName(d.eid);
        })
        .on("mouseover", function(){});
    temp.append("path")
        .attr("d", function(d){
            // source and target are duplicated for straight lines
            var x_source = parseFloat(that.x_scale(that.nodes[d.source].x)),
                y_source = parseFloat(that.y_scale(that.nodes[d.source].y)),
                x_target = parseFloat(that.x_scale(that.nodes[d.target].x)),
                y_target = parseFloat(that.y_scale(that.nodes[d.target].y));
            if(isLongPass(d,that.nodes[d.source])){
                return line(getArc(
                    x_source,
                    y_source,
                    x_source,
                    y_source,
                    10
                ));
            }
            else{
                return line([
                    {x:x_source, y:y_source}, {x:x_source, y:y_source},
                    {x:x_source, y:y_source}, {x:x_source, y:y_source}]);
            }
        })
        .attr("id", function (d, i) {
            return group + i + "_bg";
        })
        .attr("stroke", function (d) {
            return "transparent";
        })
        .attr("stroke-width",function () {
            return "20px";
        })
        .attr("fill", "none")
        .attr("class", function(d){
            return "solid";
        })
        .each(function(d){
            if(d.eid == E_RUN || d.eid == E_LONG_RUN) {
                //d3.select(this).style("stroke-opacity",0); TODO - if can fix the squiggly lines, remove the remaining of this function

                d3.select(this).attr("class","plain");

                //draw a squiggly line
                var x_source = that.x_scale(that.nodes[d.source].x),
                    y_source = that.y_scale(that.nodes[d.source].y),
                    x_target = that.x_scale(that.nodes[d.target].x),
                    y_target = that.y_scale(that.nodes[d.target].y);
                return line([
                    {x:x_source, y:y_source}, {x:x_source, y:y_source},
                    {x:x_target, y:y_target}, {x:x_target, y:y_target}]);
            }
        })
        .style("filter", function(d){
            if(isLongPass(d,that.nodes[d.source])) return "url(#shadow-pass)";
            return "";
        })
        .attr("id",function(d,i){return "linkPath"+i+"_bg"})
        .attr("d", function(d){
            // source and target are duplicated for straight lines
            var x_source = parseFloat(that.x_scale(that.nodes[d.source].x)),
                y_source = parseFloat(that.y_scale(that.nodes[d.source].y)),
                x_target = parseFloat(that.x_scale(that.nodes[d.target].x)),
                y_target = parseFloat(that.y_scale(that.nodes[d.target].y));
            if(isLongPass(d,that.nodes[d.source])){
                return line(getArc(
                    x_source,
                    y_source,
                    x_target,
                    y_target,
                    10
                ));
            }
            else{
                return line([
                    {x:x_source, y:y_source}, {x:x_source, y:y_source},
                    {x:x_target, y:y_target}, {x:x_target, y:y_target}]);
            }
        })
        .attr("opacity", 0);
    temp.append("path")
        .attr("stroke-width",0)
        .attr("stroke","white")
        .attr("d", function(d){
            // source and target are duplicated for straight lines
            var x_source = parseFloat(that.x_scale(that.nodes[d.source].x)),
                y_source = parseFloat(that.y_scale(that.nodes[d.source].y)),
                x_target = parseFloat(that.x_scale(that.nodes[d.target].x)),
                y_target = parseFloat(that.y_scale(that.nodes[d.target].y));
            if(isLongPass(d,that.nodes[d.source])){
                return line(getArc(
                    x_source,
                    y_source,
                    x_source,
                    y_source,
                    10
                ));
            }
            else{
                return line([
                    {x:x_source, y:y_source}, {x:x_source, y:y_source},
                    {x:x_source, y:y_source}, {x:x_source, y:y_source}]);
            }
        })
        .attr("id", function (d, i) {
            return group + i;
        })
        .attr("stroke", function (d) {
            if(gray==0)
                return getEventColor(d.eid);
            else
                return "lightgray"
        })
        .attr("stroke-width",function () {
            if(gray==1)
                return "10px";
            else
                return "3px"
        })
        .attr("fill", "none")
        .attr("class", function(d){
            var line_style = "";
            if(gray==1) return "plain"
            if(C_SHOT.indexOf(d.eid)!=-1) line_style = "plain";
            else if(that.nodes[d.source].pid == that.nodes[d.target].pid) {
                if(that.nodes[d.source].unique_id == that.nodes[d.target].unique_id) {
                    line_style = "dotted";
                }
                else line_style = "plain";
            }
            else line_style = "dashed";

            return line_style;
        })
        .each(function(d){
            if(d.eid == E_RUN || d.eid == E_LONG_RUN) {
                //d3.select(this).style("stroke-opacity",0); TODO - if can fix the squiggly lines, remove the remaining of this function

                d3.select(this).attr("class","plain");

                //draw a squiggly line
                var x_source = that.x_scale(that.nodes[d.source].x),
                    y_source = that.y_scale(that.nodes[d.source].y),
                    x_target = that.x_scale(that.nodes[d.target].x),
                    y_target = that.y_scale(that.nodes[d.target].y);
                return line([
                    {x:x_source, y:y_source}, {x:x_source, y:y_source},
                    {x:x_target, y:y_target}, {x:x_target, y:y_target}]);
            }
        })
        .style("filter", function(d){
            if(isLongPass(d,that.nodes[d.source])) return "url(#shadow-pass)";
            return "";
        })
        .attr("id",function(d,i){return "linkPath"+i})
        .attr("d", function(d){
            // source and target are duplicated for straight lines
            var x_source = parseFloat(that.x_scale(that.nodes[d.source].x)),
                y_source = parseFloat(that.y_scale(that.nodes[d.source].y)),
                x_target = parseFloat(that.x_scale(that.nodes[d.target].x)),
                y_target = parseFloat(that.y_scale(that.nodes[d.target].y));
            if(isLongPass(d,that.nodes[d.source])){
                return line(getArc(
                    x_source,
                    y_source,
                    x_target,
                    y_target,
                    10
                ));
            }
            else{
                return line([
                    {x:x_source, y:y_source}, {x:x_source, y:y_source},
                    {x:x_target, y:y_target}, {x:x_target, y:y_target}]);
            }
        })
        .attr("opacity", 0)
        .transition()
        .delay(function (d, i) {
            if(isTransition==2) return durationTime*4;
            return durationTime * (i + 1);
        })
        .duration(durationTime)
        .attr("opacity", 1);


        //console.log(that.nodes);
        CurrentNodes.splice(0,CurrentNodes.length);
        CurrentNodes = that.nodes;
        CurrentXscale = that.x_scale;
        CurrentYscale = that.y_scale;
        d3.selectAll(".hylink")
            .transition()
            .duration(500)
            .style("opacity",0);

    return this.path_container;
}

Sequence.prototype.scale = function (x, y)
{
    return [this.x_scale(x), this.y_scale(y)];
}




var CurrentNodes = [];
var CurrentXscale;
var CurrentYscale;
var ColorArray = ["blue","black","red","green","orange"];
var ColorArrayIndex = 0;


function ChangeAllFlag() {
    if(AllFlag == false){
        AllFlag = true;
    }
    else {
        AllFlag = false;
    }

}

function ChangeClusterAlgorithmMode(Mode) {
    console.log(Mode);
    if(Mode == 1){
        CLUSTERALGORITHMMODE = "k-means" ;
    }
    else if(Mode == 2){
        CLUSTERALGORITHMMODE = "k-medoids" ;
    }
    console.log(CLUSTERALGORITHMMODE)

}

function clearPitch() {

    d3.selectAll("#mainfield")
        .selectAll(".node, .link")
        .transition()
        .duration(500)
        .style("opacity",0);

    d3.selectAll(".hylink")
        .transition()
        .duration(500)
        .style("opacity",0);

    if(cm != undefined) cm.hide(500);

}

function redrawPitch(ComputeResult, MethodName, MethodLayer) {


    //console.log(ComputeResult);
    console.log(MethodName + MethodLayer);

    var StrokeWidth = 10;

    if (MethodName == "normal"){




        d3.select("g").selectAll("field")
            .data(ComputeResult)
            .enter()
            .append("circle")
            .attr("r",5)
            .attr("cx",function(d) {
                return CurrentXscale(d.x);
            })
            .attr("cy",function(d) {
                return CurrentYscale(d.y);
            })
            .attr("stroke","black")
            .attr("stroke-width",2)
            .attr("fill","none")
            .attr("id","hyLinkPath")
            .attr("class","hylink")

        ;



        绘制曲线
        var line_generator = d3.line()
            .x(function(d){
                return CurrentXscale(d.x);
            })
            .y(function(d){
                return CurrentYscale(d.y);
            });


        d3.select("g")
            .append("path")
            .attr("class","hylink")
            .attr("d",line_generator(ComputeResult))
            .attr("stroke","blue")
            .attr("stroke-width",2)
            .attr("fill","none")
            .attr("opacity",0.5)
            .attr("id","hyLinkPath");

    }
    else{
        if (MethodName == "SIA"){
            if(MethodLayer == 2)StrokeWidth = 15;
            else if(MethodLayer == 3)StrokeWidth = 20;

        }
        else if(MethodName == "bezier curve"){
            if(MethodLayer == 3)StrokeWidth = 15;
            else if(MethodLayer == 4)StrokeWidth = 20;
            else if(MethodLayer == 5)StrokeWidth = 25;

        }
        else if(MethodName == "k-means"){
            if(MethodLayer == 5)StrokeWidth = 15;
            else if(MethodLayer == 6)StrokeWidth = 20;
            else if(MethodLayer == 7)StrokeWidth = 25;
            else if(MethodLayer == 8)StrokeWidth = 30;
            else if(MethodLayer == 9)StrokeWidth = 30;


        }
        else if(MethodName == "k-medoids"){
            if(MethodLayer == 6)StrokeWidth = 15;
            else if(MethodLayer == 7)StrokeWidth = 20;
            else if(MethodLayer == 8)StrokeWidth = 25;
            else if(MethodLayer == 9)StrokeWidth = 30;

        }


        //绘制曲线
        var line_generator = d3.line()
            .x(function(d){
                return CurrentXscale(d.x);
            })
            .y(function(d){
                return CurrentYscale(d.y);
            })
            .curve(d3.curveBasis);



        d3.select("g")
            .append("path")
            .attr("class","hylink")
            .attr("d",line_generator(ComputeResult))
            .attr("stroke","blue")
            .attr("stroke-width",StrokeWidth)
            .attr("fill","none")
            .attr("opacity",0.5)
            .attr("id","hyLinkPath");

    }







}

function redrawAllPitch(hyAllSequencesNodes, MethodName, MethodLayer) {
    var EachNodes = [];
    for (var i=0;i<hyAllSequencesNodes.length;i++){
        EachNodes.splice(0,EachNodes.length);
        EachNodes = clone(hyAllSequencesNodes[i]);
        redrawPitch(EachNodes, MethodName, MethodLayer)
    }



}

function kMeansOrkMedoids(hyDrawPoints, k) {
    var result = [];
    switch (CLUSTERALGORITHMMODE){
        case "k-means":
            result = kMeans(hyDrawPoints, k);
            break;
        case "k-medoids":
            result = kMedoids(hyDrawPoints, k);
            break;
        default:
            console.log("wrong ClusterAlgorithm");
            break;

    }

    return result;
}

function drawAllOriginalSequences(hyAllSequences) {

    //hyAllSequences[0].data.selectSequence(0);
    //TempSelectSequence();
    for(var k=0;k<hyAllSequences.length;k++){
        //console.log(k)
        redrawPitch(hyAllSequences[k].nodes, "normal", 0)


    }

    if(cm != undefined) cm.show(0);
}

function abstractDraw(value) {
    console.log(value);
    //console.log(AllFlag);
    //console.log("ClusterAlgorithmMode " + CLUSTERALGORITHMMODE);
    if( CurrentXscale == undefined) {
        return ;
    }

    var tempAllSequences = PassSequence();
    //console.log(tempAllSequences[5].actions)
    var hyAllSequences = tempAllSequences;

    var hyAllSequencesNodes = [];
    var AllSequencesStartNodes = [];
    var AllSequencesEndNodes = [];
    for (var i=0;i<hyAllSequences.length;i++){
        hyAllSequencesNodes[i] = hyAllSequences[i].actions;
        AllSequencesStartNodes[i] = hyAllSequences[i].actions[0];
        AllSequencesEndNodes[i] = hyAllSequences[i].actions[hyAllSequences[i].actions.length-1];
    }

    var AllResults = [];
    var hyDrawPoints = clone(CurrentNodes);
    var StartNode = clone(CurrentNodes[0]);
    var EndNode = clone(CurrentNodes[CurrentNodes.length-1]);

    var result = [];
    var numberOfPoints = 100;

    switch (value){
        case 0:
            clearPitch();
            if(AllFlag == true){
                //AllResults = clone(hyAllSequencesNodes);
                //redrawAllPitch(AllResults,"normal", 0);
                drawAllOriginalSequences(hyAllSequences);
            }
            else{
                d3.selectAll(".node, .link")
                    .transition()
                    .duration(500)
                    .style("opacity",1);
                if(cm != undefined) cm.show(500);
            }
            break;
        case 10:
            clearPitch();
            if(AllFlag == true){
                for(var j=0;j<hyAllSequencesNodes.length;j++) {
                    var TempNodes = clone(hyAllSequencesNodes[j]);
                    AllResults[j] = CatmullRomChain(TempNodes);
                    AllResults[j].unshift(AllSequencesStartNodes[j]);
                    AllResults[j].push(AllSequencesEndNodes[j]);

                }
                redrawAllPitch(AllResults,"CatmullRom", 0);

            }
            else {
                result = CatmullRomChain(hyDrawPoints);

                result.unshift(StartNode);
                result.push(EndNode);

                redrawPitch(result, "CatmullRom", 0);
            }
            break;
        case 20:
            clearPitch();
            if(AllFlag == true){
                for(var j=0;j<hyAllSequencesNodes.length;j++) {
                    var TempNodes = clone(hyAllSequencesNodes[j]);
                    AllResults[j] = SIA(TempNodes, 1, 1);
                    AllResults[j].unshift(AllSequencesStartNodes[j]);
                    AllResults[j].push(AllSequencesEndNodes[j]);
                }
                redrawAllPitch(AllResults,"SIA", 0);

            }
            else {
                result = SIA(hyDrawPoints, 1, 1);

                result.unshift(StartNode);
                result.push(EndNode);

                redrawPitch(result, "SIA", 0);
            }
            break;
        case 30:
            clearPitch();
            if(AllFlag == true){
                for(var j=0;j<hyAllSequencesNodes.length;j++) {
                    var TempNodes = clone(hyAllSequencesNodes[j]);
                    AllResults[j] = SIA(TempNodes, 2, 3);
                    AllResults[j].unshift(AllSequencesStartNodes[j]);
                    AllResults[j].push(AllSequencesEndNodes[j]);
                }
                redrawAllPitch(AllResults,"SIA", 1);

            }
            else {
                result = SIA(hyDrawPoints, 2, 3);

                result.unshift(StartNode);
                result.push(EndNode);

                redrawPitch(result, "SIA", 1);
            }
            break;
        case 40:
            clearPitch();
            if(AllFlag == true){
                for(var j=0;j<hyAllSequencesNodes.length;j++) {
                    var TempNodes = clone(hyAllSequencesNodes[j]);
                    AllResults[j] = SIA(TempNodes, 3, 5);
                    AllResults[j].unshift(AllSequencesStartNodes[j]);
                    AllResults[j].push(AllSequencesEndNodes[j]);
                }
                redrawAllPitch(AllResults,"SIA", 2);

            }
            else {
                result = SIA(hyDrawPoints, 3, 5);

                result.unshift(StartNode);
                result.push(EndNode);

                redrawPitch(result, "SIA", 2);
            }
            break;
        case 50:
            clearPitch();
            if(AllFlag == true){
                for(var j=0;j<hyAllSequencesNodes.length;j++) {
                    var TempNodes = clone(hyAllSequencesNodes[j]);
                    AllResults[j] = SIA(TempNodes, 4, 5);
                    AllResults[j].unshift(AllSequencesStartNodes[j]);
                    AllResults[j].push(AllSequencesEndNodes[j]);
                }
                redrawAllPitch(AllResults,"SIA", 3);

            }
            else {
                result = SIA(hyDrawPoints, 4, 5);

                result.unshift(StartNode);
                result.push(EndNode);

                redrawPitch(result, "SIA", 3);
            }
            break;
        case 60:
            clearPitch();
            if(AllFlag == true){
                for(var j=0;j<hyAllSequencesNodes.length;j++) {
                    var TempNodes = clone(hyAllSequencesNodes[j]);
                    AllResults[j] = ComputeBezier(TempNodes, 200, numberOfPoints);
                    AllResults[j].unshift(AllSequencesStartNodes[j]);
                    AllResults[j].push(AllSequencesEndNodes[j]);
                }
                redrawAllPitch(AllResults,"bezier curve", 0);

            }
            else {
                result = ComputeBezier(hyDrawPoints, 200, numberOfPoints);

                result.unshift(StartNode);
                result.push(EndNode);

                redrawPitch(result, "bezier curve", 0);
            }
            break;
        case 70:
            clearPitch();
            if(AllFlag == true){
                for(var j=0;j<hyAllSequencesNodes.length;j++) {
                    var TempNodes = clone(hyAllSequencesNodes[j]);
                    AllResults[j] = ComputeBezier(TempNodes, 100, numberOfPoints);
                    AllResults[j].unshift(AllSequencesStartNodes[j]);
                    AllResults[j].push(AllSequencesEndNodes[j]);
                }
                redrawAllPitch(AllResults,"bezier curve", 1);

            }
            else {
                result = ComputeBezier(hyDrawPoints, 100, numberOfPoints);

                result.unshift(StartNode);
                result.push(EndNode);

                redrawPitch(result, "bezier curve", 1);
            }
            break;
        case 80:
            clearPitch();
            if(AllFlag == true){
                for(var j=0;j<hyAllSequencesNodes.length;j++) {
                    var TempNodes = clone(hyAllSequencesNodes[j]);
                    AllResults[j] = ComputeBezier(TempNodes, 50, numberOfPoints);
                    AllResults[j].unshift(AllSequencesStartNodes[j]);
                    AllResults[j].push(AllSequencesEndNodes[j]);
                }
                redrawAllPitch(AllResults,"bezier curve", 2);

            }
            else {
                result = ComputeBezier(hyDrawPoints, 50, numberOfPoints);

                result.unshift(StartNode);
                result.push(EndNode);

                redrawPitch(result, "bezier curve", 2);
            }
            break;
        case 90:
            clearPitch();
            if(AllFlag == true){
                for(var j=0;j<hyAllSequencesNodes.length;j++) {
                    var TempNodes = clone(hyAllSequencesNodes[j]);
                    AllResults[j] = ComputeBezier(TempNodes, 4, numberOfPoints);
                    AllResults[j].unshift(AllSequencesStartNodes[j]);
                    AllResults[j].push(AllSequencesEndNodes[j]);
                }
                redrawAllPitch(AllResults,"bezier curve", 3);

            }
            else {
                result = ComputeBezier(hyDrawPoints, 4, numberOfPoints);

                result.unshift(StartNode);
                result.push(EndNode);

                redrawPitch(result, "bezier curve", 3);
            }
            break;
        case 100:
            clearPitch();
            if(AllFlag == true){
                for(var j=0;j<hyAllSequencesNodes.length;j++) {
                    var TempNodes = clone(hyAllSequencesNodes[j]);
                    AllResults[j] = ComputeBezier(TempNodes, 0.1, numberOfPoints);
                    AllResults[j].unshift(AllSequencesStartNodes[j]);
                    AllResults[j].push(AllSequencesEndNodes[j]);
                }
                redrawAllPitch(AllResults,"bezier curve", 4);

            }
            else {
                result = ComputeBezier(hyDrawPoints, 0.1, numberOfPoints);

                result.unshift(StartNode);
                result.push(EndNode);

                redrawPitch(result, "bezier curve", 4);
            }
            break;
        case 110:
            clearPitch();
            if(AllFlag == true){
                for(var j=0;j<hyAllSequencesNodes.length;j++) {
                    var TempNodes = clone(hyAllSequencesNodes[j]);
                    AllResults[j] = ComputeBezier(TempNodes, 0.01, numberOfPoints);
                    AllResults[j].unshift(AllSequencesStartNodes[j]);
                    AllResults[j].push(AllSequencesEndNodes[j]);
                }
                redrawAllPitch(AllResults,"bezier curve", 5);

            }
            else {
                result = ComputeBezier(hyDrawPoints, 0.01, numberOfPoints);

                result.unshift(StartNode);
                result.push(EndNode);

                redrawPitch(result, "bezier curve", 5);
            }
            break;
        case 120:
            clearPitch();
            if(AllFlag == true){
                for(var j=0;j<hyAllSequencesNodes.length;j++) {
                    var TempNodes = clone(hyAllSequencesNodes[j]);
                    var k = calc_k(hyAllSequencesNodes[j].length, 5);
                    AllResults[j] = kMeansOrkMedoids(TempNodes, k);
                    AllResults[j].unshift(AllSequencesStartNodes[j]);
                    AllResults[j].push(AllSequencesEndNodes[j]);
                }
                redrawAllPitch(AllResults,CLUSTERALGORITHMMODE, 0);

            }
            else {
                var k = calc_k(hyDrawPoints.length, 5);
                result = kMeansOrkMedoids(hyDrawPoints, k);

                result.unshift(StartNode);
                result.push(EndNode);

                redrawPitch(result, CLUSTERALGORITHMMODE, 0);
            }
            break;
        case 130:
            clearPitch();
            if(AllFlag == true){
                for(var j=0;j<hyAllSequencesNodes.length;j++) {
                    var TempNodes = clone(hyAllSequencesNodes[j]);
                    var k = calc_k(hyAllSequencesNodes[j].length, 4);
                    AllResults[j] = kMeansOrkMedoids(TempNodes, k);
                    AllResults[j].unshift(AllSequencesStartNodes[j]);
                    AllResults[j].push(AllSequencesEndNodes[j]);
                }
                redrawAllPitch(AllResults,CLUSTERALGORITHMMODE, 1);

            }
            else {
                var k = calc_k(hyDrawPoints.length, 4);
                result = kMeansOrkMedoids(hyDrawPoints, k);

                result.unshift(StartNode);
                result.push(EndNode);

                redrawPitch(result, CLUSTERALGORITHMMODE, 1);
            }
            break;
        case 140:
            clearPitch();
            if(AllFlag == true){
                for(var j=0;j<hyAllSequencesNodes.length;j++) {
                    var TempNodes = clone(hyAllSequencesNodes[j]);
                    var k = calc_k(hyAllSequencesNodes[j].length, 3);
                    AllResults[j] = kMeansOrkMedoids(TempNodes, k);
                    AllResults[j].unshift(AllSequencesStartNodes[j]);
                    AllResults[j].push(AllSequencesEndNodes[j]);
                }
                redrawAllPitch(AllResults,CLUSTERALGORITHMMODE, 2);

            }
            else {
                var k = calc_k(hyDrawPoints.length, 3);
                result = kMeansOrkMedoids(hyDrawPoints, k);

                result.unshift(StartNode);
                result.push(EndNode);

                redrawPitch(result, CLUSTERALGORITHMMODE, 2);
            }
            break;
        case 150:
            clearPitch();
            if(AllFlag == true){
                for(var j=0;j<hyAllSequencesNodes.length;j++) {
                    var TempNodes = clone(hyAllSequencesNodes[j]);
                    var k = calc_k(hyAllSequencesNodes[j].length, 2);
                    AllResults[j] = kMeansOrkMedoids(TempNodes, k);
                    AllResults[j].unshift(AllSequencesStartNodes[j]);
                    AllResults[j].push(AllSequencesEndNodes[j]);
                }
                redrawAllPitch(AllResults,CLUSTERALGORITHMMODE, 3);

            }
            else {
                var k = calc_k(hyDrawPoints.length, 2);
                result = kMeansOrkMedoids(hyDrawPoints, k);

                result.unshift(StartNode);
                result.push(EndNode);

                redrawPitch(result, CLUSTERALGORITHMMODE, 3);
            }
            break;
        case 160:
            clearPitch();
            if(AllFlag == true){
                for(var j=0;j<hyAllSequencesNodes.length;j++) {
                    var TempNodes = clone(hyAllSequencesNodes[j]);
                    var k = calc_k(hyAllSequencesNodes[j].length, 1);
                    AllResults[j] = kMeansOrkMedoids(TempNodes, k);
                    AllResults[j].unshift(AllSequencesStartNodes[j]);
                    AllResults[j].push(AllSequencesEndNodes[j]);
                }
                redrawAllPitch(AllResults,CLUSTERALGORITHMMODE, 4);

            }
            else {
                var k = calc_k(hyDrawPoints.length, 1);
                result = kMeansOrkMedoids(hyDrawPoints, k);

                result.unshift(StartNode);
                result.push(EndNode);

                redrawPitch(result, CLUSTERALGORITHMMODE, 4);
            }
            break;
        case 170:
            clearPitch();
            if(AllFlag == true){
                for(var j=0;j<hyAllSequencesNodes.length;j++) {
                    var TempNodes = clone(hyAllSequencesNodes[j]);
                    AllResults[j] = kMeansOrkMedoids(TempNodes, 5);
                    AllResults[j].unshift(AllSequencesStartNodes[j]);
                    AllResults[j].push(AllSequencesEndNodes[j]);
                }
                redrawAllPitch(AllResults,CLUSTERALGORITHMMODE, 5);

            }
            else {
                result = kMeansOrkMedoids(hyDrawPoints, 5);

                result.unshift(StartNode);
                result.push(EndNode);

                redrawPitch(result, CLUSTERALGORITHMMODE, 5);
            }
            break;
        case 180:
            clearPitch();
            if(AllFlag == true){
                for(var j=0;j<hyAllSequencesNodes.length;j++) {
                    var TempNodes = clone(hyAllSequencesNodes[j]);
                    AllResults[j] = kMeansOrkMedoids(TempNodes, 4);
                    AllResults[j].unshift(AllSequencesStartNodes[j]);
                    AllResults[j].push(AllSequencesEndNodes[j]);
                }
                redrawAllPitch(AllResults,CLUSTERALGORITHMMODE, 6);

            }
            else {
                result = kMeansOrkMedoids(hyDrawPoints, 4);

                result.unshift(StartNode);
                result.push(EndNode);

                redrawPitch(result, CLUSTERALGORITHMMODE, 6);
            }
            break;
        case 190:
            clearPitch();
            if(AllFlag == true){
                for(var j=0;j<hyAllSequencesNodes.length;j++) {
                    var TempNodes = clone(hyAllSequencesNodes[j]);
                    AllResults[j] = kMeansOrkMedoids(TempNodes, 3);
                    AllResults[j].unshift(AllSequencesStartNodes[j]);
                    AllResults[j].push(AllSequencesEndNodes[j]);
                }
                redrawAllPitch(AllResults,CLUSTERALGORITHMMODE, 7);

            }
            else {
                result = kMeansOrkMedoids(hyDrawPoints, 3);

                result.unshift(StartNode);
                result.push(EndNode);

                redrawPitch(result, CLUSTERALGORITHMMODE, 7);
            }
            break;
        case 200:
            clearPitch();
            if(AllFlag == true){
                for(var j=0;j<hyAllSequencesNodes.length;j++) {
                    var TempNodes = clone(hyAllSequencesNodes[j]);
                    AllResults[j] = kMeansOrkMedoids(TempNodes, 2);
                    AllResults[j].unshift(AllSequencesStartNodes[j]);
                    AllResults[j].push(AllSequencesEndNodes[j]);
                }
                redrawAllPitch(AllResults,CLUSTERALGORITHMMODE, 8);

            }
            else {
                result = kMeansOrkMedoids(hyDrawPoints, 2);

                result.unshift(StartNode);
                result.push(EndNode);

                redrawPitch(result, CLUSTERALGORITHMMODE, 8);
            }
            break;
        case 210:
            clearPitch();
            if(AllFlag == true){
                for(var j=0;j<hyAllSequencesNodes.length;j++) {
                    var TempNodes = clone(hyAllSequencesNodes[j]);
                    AllResults[j] = kMeansOrkMedoids(TempNodes, 1);
                    AllResults[j].unshift(AllSequencesStartNodes[j]);
                    AllResults[j].push(AllSequencesEndNodes[j]);
                }
                redrawAllPitch(AllResults,CLUSTERALGORITHMMODE, 9);

            }
            else {
                result = kMeansOrkMedoids(hyDrawPoints, 1);

                result.unshift(StartNode);
                result.push(EndNode);

                redrawPitch(result, CLUSTERALGORITHMMODE, 9);
            }
            break;
    }

}
