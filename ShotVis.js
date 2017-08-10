ShotVis = function (Sequence, clusterGroup, width, height, pad, shotNum, endNum, currentX, currentY) {
    this.Sequence = Sequence;
    this.clusterGroup = clusterGroup;
    this.width = width;
    this.height = height;
    this.pad = pad;
    this.shotNode = this.Sequence.nodes[shotNum];
    this.shotNum = shotNum;
    this.endNode = this.Sequence.nodes[endNum];
    this.endNum = endNum;
    this.currentX = currentX;
    this.currentY = currentY;

    this.getContextData();
    console.log(this.context_data);

    this.drawHalfField();
    this.drawSplitLine();
    this.drawPost();
    this.drawPosition();

    this.drawShots();
}

ShotVis.prototype.drawHalfField = function () {
    var that = this;

    this.fieldWidth = 180;
    this.fieldHeight = 180;

    this.field = new Field(this.clusterGroup, this.pad, this.pad + this.height - this.fieldHeight,
        this.fieldWidth, this.fieldHeight, "clusterField", 0, 0, 0);
    this.field.draw_rect(0, 0, this.width, this.height);
    this.field.fieldGroup.append("path")
        .attr("d", function () {
            return "M" + that.field.x_scale(37.5) + " " + that.field.y_scale(100) + " A "
                + that.field.r_scale(12.5) + " " + that.field.r_scale(12.5) + " 0 0 1 "
                + that.field.x_scale(62.5) + " " + that.field.y_scale(100);
        })
        .attr("fill", "none")
        .attr("stroke", "grey");
    this.field.draw_circle(50, 22, 12.5);
    this.field.draw_rect(20, 0, 60, 30);
    this.field.draw_rect(37, 0, 26, 10);
    this.field.draw_circle(50, 22, 1);
    this.field.draw_circle(50, 100, 1);

}

ShotVis.prototype.drawPosition = function(){
    var that = this;

    var endX, endY;
    var style;
    var shot_dest = getShotDestination(this.Sequence.links[this.Sequence.links.length - 1]);
    if(shot_dest.type == SHOT_DEST_TYPE_MOUTH){
        endX = this.setPostX(shot_dest.y);
        endY = this.setPostY(shot_dest.z);
        style = 2;
    }
    else{
        endX = this.resetX(this.endNode.y);
        endY = this.resetY(this.endNode.x);
        style = 0;
    }
    resetNodePos(this.shotNum, this.resetX(this.shotNode.y), this.resetY(this.shotNode.x), 100);
    resetNodePos(this.endNum, endX, endY, 100);
    repaintPath(this.shotNum - 1, 100, 1);
    repaintPath(this.endNum - 1, 100, style);
}

ShotVis.prototype.drawSplitLine = function () {
    var that = this;
    this.splitWidth = 10;
    this.distanceHeight = that.height - that.fieldHeight - that.splitWidth;
    this.clusterGroup.append("g")
        .attr("id", "splitLine")
        .attr("transform", function () {
            return "translate(" + [0, that.distanceHeight] + ")";
        })
        .attr("width", that.fieldWidth)
        .attr("height", that.splitWidth)
        .append("rect")
        .attr("x", this.pad)
        .attr("y", 0)
        .attr("width", this.fieldWidth)
        .attr("height", this.splitWidth);
}

ShotVis.prototype.drawPost = function () {
    this.post_x_scale = d3.scaleLinear().domain([34.6, 65.4]).range([0, 100]).clamp(true);
    this.post_y_scale = d3.scaleLinear().domain([0, 100]).range([0, 100]).clamp(true);
    this.post = new Field(this.clusterGroup, this.pad, 0, this.fieldWidth, this.distanceHeight,
                "fieldPost", 0, 0, 0);
    this.postWidth = this.post_x_scale(54.8) - this.post_x_scale(45.2);
    this.postHeight = this.post_y_scale(38);
    var rect = this.post.draw_rect(this.post_x_scale(45.2), 100 - this.postHeight, this.postWidth, this.postHeight);
    rect.attr("class", "postRect");
}

ShotVis.prototype.drawShots = function () {
    var that = this;
    if(this.shots == undefined){
        this.shots = this.clusterGroup.append("g")
            .attr("class", "shotContext")
            .selectAll("g")
            .data(this.context_data)
            .enter()
            .append("g")
            .attr("class", function (d) {
                return "shots_" + d.shot_type;
            });
    }
    this.shots.append("circle")
        .attr("class", "shotNode")
        .attr("transform", function (d) {
            return "translate(" + [that.resetX(d.y) - that.currentX, that.resetY(d.x) - that.currentY] + ")";
        })
        .attr("r", 3)
        .attr("fill", function (d) {
            return that.getShotColor(d);
        });
    this.shots.each(function (d) {
        var mouth = that.getMouth(d);
        if(mouth != null){
            d3.select(this).append("circle")
                .attr("class", "shotNode")
                .attr("transform", function () {
                    return "translate(" + [that.setPostX(mouth[0]) - that.currentX,
                        that.setPostY(mouth[1]) - that.currentY] + ")";
                })
                .attr("r", 3)
                .attr("fill", function (d) {
                    return that.getShotColor(d);
                });

            d3.select(this).append("line")
                .attr("class", "shotLine")
                .attr("x1", function (d) {
                    return that.resetX(d.y) - that.currentX;
                })
                .attr("y1", function (d) {
                    return that.resetY(d.x) - that.currentY;
                })
                .attr("x2", function () {
                    return that.setPostX(mouth[0]) - that.currentX;
                })
                .attr("y2", function () {
                    return that.setPostY(mouth[1]) - that.currentY;
                })
                .attr("stroke", function (d) {
                    return that.getShotColor(d);
                })
                .attr("stroke-width", 2);
        }
        else{
            var blocked = that.getBlocked(d);
            if(blocked != null){
            }
            else{
            }
        }

    })
}

ShotVis.prototype.getShotType = function(shot){
    switch(shot.eid){
        case E_SHOT_MISS:
            return "missed";
            break;
        case E_SHOT_POST:
            return "post";
            break;
        case E_SHOT_SAVED:
            return "saved";
            break;
        case E_SHOT_GOAL:
            return "goal";
            break;
        case E_SHOT_CHANCE_MISSED:
            return "chance_missed";
            break;
        default:
            throw "Unknown shot event type: "+shot.eid;
    }
};

ShotVis.prototype.getBlocked = function(d){
    var blockedX = undefined;
    var blockedY = undefined;
    for(var q in d.qualifiers){
        var qual = d.qualifiers[q];
        if(qual.qid == Q_SHOT_BLOCKED_X){
            blockedX = qual.value;
        }
        else if(qual.qid == Q_SHOT_BLOCKED_Y){
            blockedY = qual.value;
        }
    }
    if(blockedX != undefined && blockedY != undefined)return [blockedX, blockedY];
    else return null;
};

ShotVis.prototype.getMouth = function(d){
    var mouthY = undefined;
    var mouthZ = undefined;
    for(var q in d.qualifiers){
        var qual = d.qualifiers[q];
        if(qual.qid == Q_SHOT_GOAL_MOUTH_Y){
            mouthY = qual.value;
        }
        else if(qual.qid == Q_SHOT_GOAL_MOUTH_Z){
            mouthZ = qual.value;
        }
    }
    if(mouthY != undefined && mouthZ != undefined)return [mouthY, mouthZ];
    else return null;
};

ShotVis.prototype.getContextShots = function(){
    var shots = [];

    data.players.forEach(function(player){
        if(player.events == undefined) return;
        player.events.forEach(function(d){
            if(isShot(d)){
                shots.push(d);
            }
        });
    });
    return shots;
};

ShotVis.prototype.getContextData = function(){
    this.context_data = this.getContextShots();
    for(var s in this.context_data){
        this.context_data[s].shot_type = this.getShotType(this.context_data[s]);
    }
};

ShotVis.prototype.resetX = function(y){
    return y/100 * this.fieldWidth + this.currentX;
};

ShotVis.prototype.resetY = function(x){
    return (50 - Math.abs(x - 50))/50 * this.fieldHeight + this.currentY + this.height - this.fieldHeight;
};

ShotVis.prototype.setPostX = function (x) {
    return this.currentX + this.post_x_scale(x)/100 * this.width;
};

ShotVis.prototype.setPostY = function (y) {
    return this.currentY + (100 - this.post_y_scale(y))/100 * (this.distanceHeight);
};

ShotVis.prototype.getShotColor = function (d) {
    switch(d.shot_type) {
        case "goal":
            return "green";
        case "post":
            return "pink";
        case "saved":
            return "blue";
        case "missed":
            return "red";
        default:
            console.log("unknown name for shot: " + d.name);
            return "yellow";
    }
}