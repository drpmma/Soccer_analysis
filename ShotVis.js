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
    var resetX = function(y){
        return y/100 * that.fieldWidth + that.currentX;
    };
    var resetY = function(x){
        return (50 - Math.abs(x - 50))/50 * that.fieldHeight + that.currentY + that.height - that.fieldHeight;
    };

    var endX, endY;
    var style;
    var shot_dest = getShotDestination(this.Sequence.links[this.Sequence.links.length - 1]);
    if(shot_dest.type == SHOT_DEST_TYPE_MOUTH){
        endX = this.currentX + this.post_x_scale(shot_dest.y)/100 * this.width;
        endY = this.currentY + (100 - this.post_y_scale(shot_dest.z))/100 * (this.height - this.fieldHeight);
        style = 2;
    }
    else{
        endX = resetX(this.endNode.y);
        endY = resetY(this.endNode.x);
        style = 0;
    }
    resetNodePos(this.shotNum, resetX(this.shotNode.y), resetY(this.shotNode.x), 100);
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

// ShotVis.prototype.getShotNode = function () {
//     var shotNode = -1;
//     for(var s in this.Sequence.nodes)
//     {
//         if(this.Sequence.nodes[s].eid >= 13 && this.Sequence.nodes[s].eid <= 16 || this.Sequence.nodes[s].eid == 60)
//         {
//             shotNode = this.Sequence.nodes[s];
//             break;
//         }
//     }
//     return shotNode;
// }