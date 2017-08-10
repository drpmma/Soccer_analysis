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

    this.drawHalfField();
    this.drawPosition();
}

ShotVis.prototype.drawHalfField = function () {
    var that = this;

    this.fieldWidth = 150;
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

    resetNodePos(this.shotNum, resetX(this.shotNode.y), resetY(this.shotNode.x), 100);
    resetNodePos(this.endNum, resetX(this.endNode.y), resetY(this.endNode.x), 100);
    repaintPath(this.shotNum - 1, 100, 1);
    repaintPath(this.endNum - 1, 100, 0);
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