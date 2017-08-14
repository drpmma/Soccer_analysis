CentreVis = function(sequence, clusterGroup, width, height, pad, currentX, currentY, params) {
    this.sequence = sequence;
    this.clusterGroup = clusterGroup;
    this.width = width;
    this.height = height;
    this.pad = pad;
    this.currentX = currentX;
    this.currentY = currentY;
    this.getParams(params);



    var node_entry = this.sequence.nodes[this.nodes[0]];
    var centre_dest = getPassDestPosition(this.links[0]);
    var centre_orig = {x: node_entry.x, y: node_entry.y};
    this.fromRight = (centre_orig.y <= 50) ? true : false;

    this.createField();
    this.getContextData();

    this.drawPosition();
    this.drawContext();
}

CentreVis.prototype.getParams = function (params) {
    this.type = params.type;
    this.entry = params.entry;
    this.exit = params.exit;
    this.links = params.links;
    this.nodes = params.nodes;
}

CentreVis.prototype.createField = function () {
    this.x_min = 70;
    this.x_max = 100;
    this.y_min = this.fromRight ? 0 : 21.1;
    this.y_max = this.fromRight ? 78.9 : 100;
    this.x_scale = d3.scaleLinear().domain([this.x_min,this.x_max]).range([0, this.width]).clamp(true);
    this.y_scale = d3.scaleLinear().domain([this.y_min,this.y_max]).range([0, this.height]).clamp(true);

    var cy = this.y_scale(50);
    this.drawFieldCircle(88.5, 50, 14);

    //right big rect
    this.drawFieldRect(cy, 83, 100, 21.1, 78.9, true);

    //right small rect
    this.drawFieldRect(cy, 94.2, 100, 36.8, 63.2);

    //right goals
    this.drawFieldRect(cy, 99.5, 100, 44.45, 55.45);

    //right penalty point
    this.drawFieldCircle(90, 50, 1, true);

}

CentreVis.prototype.drawPosition = function() {
    var that = this;
    var newTx,newTy;

    this.nodes.forEach(function(node, n){
        d3.select("#mainfield")
            .selectAll(".node").filter(function(d) {
                if(d.index==node) {
                    newTx = that.currentX + that.x_scale(d.x);
                    newTy = that.currentY + that.y_scale(d.y);
                    resetNodePos(node, newTx, newTy, 100);
                    return d;
            }
        });
    });
    this.links.forEach(function(link,l) {
        d3.select("#mainfield")
            .selectAll(".link").filter(function (d) {
                if (d.source == link.source && d.target == link.target) {
                    repaintPath(link.source, 100, 2);
                    return d;
                }
            })
            .select("path")
            .attr("style", "stroke-width:3")
            .attr("filter", "url(#shadow-pass)")
            // .attr("style", "stroke: green");
    });
}

CentreVis.prototype.getContextData = function () {
    switch(this.type){
        case SUB_CHAIN_TYPE_PASS_CENTRE:
            this.context_data = this.getContextCentres(
                this.fromRight
            );
            break;
        case SUB_CHAIN_TYPE_PASS_CORNER:
            this.context_data = this.getContextCorners(
                this.fromRight
            );
            break;
        default:
            throw "Illegal type "+this.type;
    }
}

CentreVis.prototype.getContextCentres = function (fromRight) {
    var centres = [];

    data.players.forEach(function(player){
        if(player.events == undefined) return;
        player.events.forEach(function(event){
            if(isCentreAndNotCorner(event, fromRight)){
                centres.push(event);
            }
        });
    });
    return centres;
}

CentreVis.prototype.drawContext = function(){

    var context_group = this.clusterGroup
        .append("g")
        .attr("class","heatmap-context");

    var granularity = .3;

    var nb_rows = parseInt((this.y_max-this.y_min)*granularity),
        nb_cols = parseInt((this.x_max-this.x_min)*granularity),
        cell_width = this.width/nb_cols,
        cell_height = this.height/nb_rows;

    var col_scale = d3.scaleLinear().domain([this.x_min,this.x_max]).range([0, nb_cols]).clamp(true);
    var row_scale = d3.scaleLinear().domain([this.y_min,this.y_max]).range([0, nb_rows]).clamp(true);

    var heatmapData = [];
    for(var r=0;r<nb_rows;r++){
        for(var c=0;c<nb_cols;c++){
            heatmapData[r*nb_cols+c] = {type: undefined, val: 0, index: r*nb_cols+c};
        }
    }

    this.context_data.forEach(function(d){
        var origin = {x:d.x, y:d.y},
            destination = getPassDestPosition(d);
        var row_col_orig = getRowCol(origin),
            row_col_dest = getRowCol(destination);

        var cellOrig = heatmapData[row_col_orig.row * nb_cols + row_col_orig.col],
            cellDest = heatmapData[row_col_dest.row * nb_cols + row_col_dest.col];

        cellOrig.val ++;
        cellDest.val ++;

        if(cellOrig.type == undefined)
            cellOrig.type = "orig";
        if(cellDest.type == undefined)
            cellDest.type = "dest";

    });
    function getRowCol(pos){
        var col = col_scale(pos.x),
            row = row_scale(pos.y);
        if(col == nb_cols) {
            col--;
        }
        if(row == nb_rows) {
            row--;
        }
        return {col: Math.floor(col), row: Math.floor(row)};
    }

    console.log(heatmapData);

    var max_value_dest = d3.max(heatmapData, function(d){if(d.type=="dest") return d.val});
    var max_value_orig = d3.max(heatmapData, function(d){if(d.type=="orig") return d.val});

    //pseudo linear alpha/color scales, because the corner point cell has a very high value
    var opacity_scale_dest = d3.scaleLinear().domain([0,1,max_value_dest]).range([0,.5,1]);
    var opacity_scale_orig = d3.scaleLinear().domain([0,1,max_value_orig]).range([0,.5,1]);
    var color_domain_dest = [0,max_value_dest/5,2*max_value_dest/5,3*max_value_dest/5,4*max_value_dest/5,max_value_dest];
    var color_domain_orig = [0,max_value_orig/5,2*max_value_orig/5,3*max_value_orig/5,4*max_value_orig/5,max_value_orig];
    var color_scale_dest = d3.scaleLinear().domain(color_domain_dest).range(["#FFC82B","#F79900","#D67E00","#AE5D00","#813800","#511000"]);
    var color_scale_orig = d3.scaleLinear().domain(color_domain_orig).range(["#DEFFFF","#7AFFFF","#27D2FF","#00A4E2","#0071AB","#003970"]);


    context_group.selectAll(".heatmap_square")
    //do not draw the val=0 squares
        .data(heatmapData.filter(function(d) { return d.val > 0 ? true : false; }))
        .enter()
        .append("rect")
        .attr("class", "heatmap_square")
        .attr("x", function(d){
            return (d.index%nb_cols)*cell_width;
        })
        .attr("y", function(d){
            return Math.floor(d.index/nb_cols)*cell_height;
        })
        .style("stroke-width", 0)
        .style("fill-opacity", function(d){
            if(d.type == "orig") return opacity_scale_orig(d.val);
            else return opacity_scale_dest(d.val);
        })
        .style("fill", function(d){
            if(d.type == "orig") {
                return color_scale_orig(d.val);
            }
            else return color_scale_dest(d.val);
        })
        .attr("width", cell_width)
        .attr("height", cell_height);
};

CentreVis.prototype.getContextCorners = function(fromRight){
    var corners = [];

    data.players.forEach(function(player){
        if(player.events == undefined) return;
        player.events.forEach(function(event){
            if(isCorner(event, fromRight)){
                corners.push(event);
            }
        });
    });
    return corners;
};


CentreVis.prototype.drawFieldCircle = function(cx, cy, r, isFilled){
    r = r*this.height/100;
    var c = isFilled ? "fieldLines fieldPoints" : "fieldLines";
    this.clusterGroup.append("circle")
        .attr("class", c)
        .attr("cx", this.x_scale(cx))
        .attr("cy", this.y_scale(cy))
        .attr("r", r);
};

/*
 x, width as fractions of X
 y, height as fractions on Y
 */
CentreVis.prototype.drawFieldRect = function(cy, x0, x1, y0, y1, isFilled){
    y0 = this.y_scale(y0);
    y1 = this.y_scale(y1);
    x0 = this.x_scale(x0);
    x1 = this.x_scale(x1);
    var h = Math.abs(y0-y1),
        w = Math.abs(x0-x1),
        y = cy - h/2;
    var c = isFilled ? "fieldRect" : "fieldLines";
    this.clusterGroup.append("rect")
        .attr("class", c)
        .attr("x", x0)
        .attr("y", y)
        .attr("width", w)
        .attr("height", h);
};

/*
 x1, x2 as fractions of X
 y1, y2 as fractions of Y
 */
CentreVis.prototype.drawFieldLine = function(x1, y1, x2, y2){
    this.clusterGroup.append("line")
        .attr("class", "fieldLines")
        .attr("x1", this.x_scale(x1))
        .attr("y1", this.y_scale(100-y1))
        .attr("x2", this.x_scale(x2))
        .attr("y2", this.y_scale(100-y2));
};
