Sequence = function (field, sequence, r, color, f) {
    this.field = field;
    this.sequence = sequence;
    this.width = field.attr("width");
    this.height = field.attr("height");
    this.r=r;
    this.color=color;
    this.x_scale = d3.scaleLinear().domain([0,100]).range([0, this.width]).clamp(true);
    this.y_scale = d3.scaleLinear().domain([0,100]).range([0, this.height]).clamp(true);
    this.computeNodeLinks();
    console.log("nodes", this.nodes);
    if(f==1)
    {
        this.draw_path("link",0);
        this.draw_node("node", r ,color);
    }
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
};

Sequence.prototype.draw_node = function (group, r,color)
{
    var that = this;
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
        .on("mouseover", function(){d3.select(this).style("cursor", "pointer")})
        .on("click", function(d) {pm.reChoose(d.pid);})
        .append("circle")
        .attr("r", r)
        .attr("stroke", "black")
        .attr("stroke-width", "1px;")
        .attr("fill", color);

    for(var i = 0; i < this.nodes.length; i++)
    {
        this.node_container
            .select("#"+group + i)
            .append("text")
            .attr("x",0).attr("y",0)
            .attr("style","text-anchor:middle; dominant-baseline:middle; font-size:"+r+"px;")
            .text(pm.findJerseyByPid(this.nodes[i].pid));
    }
    return this.node_container;
}

Sequence.prototype.draw_path = function (group,gray) {
    var that = this;
    this.path_container = this.field.append("g")
        .attr("id", "path_container");
    this.path_container.selectAll("g").data(this.links).enter()
        .append("g")
        .attr("class", function (d) {
            return "link " + getEventName(d.eid);
        })
        .append("path")
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
                return "1px"
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
        });
    return this.path_container;
}

Sequence.prototype.scale = function (x, y)
{
    return [this.x_scale(x), this.y_scale(y)];
}