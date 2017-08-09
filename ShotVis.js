ShotVis = function (Sequence, clusterGroup, width, height, pad, shotNum, endNum, currentX, currentY) {
    this.Sequence = Sequence;
    this.clusterGroup = clusterGroup;
    this.width = width;
    this.height = height;
    this.pad = pad;
    this.shotNode = this.Sequence.nodes[shotNum];
    this.endNode = this.Sequence.nodes[endNum];
    this.field = new Field(this.clusterGroup, pad, pad, width, height, "clusterField", 0, 0, 0);
    this.drawHalfField();
    resetNodePos(shotNum, (this.shotNode.x - 50)/50 * this.width + currentX, (this.shotNode.y)/100 * this.height + currentY, 100);
    resetNodePos(endNum, (this.endNode.x - 50)/50 * this.width + currentX, (this.endNode.y)/100 * this.height + currentY, 100);
    repaintPath(shotNum - 1, 100, 1);
    repaintPath(endNum - 1, 100, 0);
}

ShotVis.prototype.drawHalfField = function () {
    var that = this;
    this.field.draw_rect(0, 0, this.width, this.height);
    if(this.shotNode.x >= 50)
    {
        this.field.fieldGroup.append("path")
            .attr("d", function () {
                return "M0 " + that.field.y_scale(37.5) + " A "
                    + that.field.r_scale(12.5) + " " +  that.field.r_scale(12.5) + " 0 0 1 0 "  + that.field.y_scale(62.5);
            })
            .attr("fill", "none")
            .attr("stroke", "grey");
        this.field.draw_circle(78, 50, 12.5);
        this.field.draw_rect(70, 20, 30, 60);
        this.field.draw_rect(90, 37, 10, 26);
        this.field.draw_circle(78, 50, 1);
        this.field.draw_circle(0, 50, 1);
    }
    else
    {
        this.field.fieldGroup.append("path")
            .attr("d", function () {
                return "M" + that.field.x_scale(100) + " " + that.field.y_scale(37.5) + " A "
                    + that.field.r_scale(12.5) + " " +  that.field.r_scale(12.5) + " 0 0 0 "
                    + that.field.x_scale(100) + " "  + that.field.y_scale(62.5);
            })
            .attr("fill", "none")
            .attr("stroke", "grey");
        this.field.draw_circle(22, 50, 12.5);
        this.field.draw_rect(0, 20, 30, 60);
        this.field.draw_rect(0, 37, 10, 26);
        this.field.draw_circle(22, 50, 1);
        this.field.draw_circle(100, 50, 1);
    }
}

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