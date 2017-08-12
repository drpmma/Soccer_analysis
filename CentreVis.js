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

    this.getContextData();
}

CentreVis.prototype.getParams = function (params) {
    this.type = params.type;
    this.entry = params.entry;
    this.exit = params.exit;
    this.links = params.links;
    this.nodes = params.nodes;
}

CentreVis.prototype.getContextData = function () {
    switch(this.type){
        case SUB_CHAIN_TYPE_PASS_CENTRE:
            this.context_data = this.getContextCentres(
                this.context,
                this.fromRight,
                this.sequence.nodes[this.nodes[0]].pid
            );
            break;
        case SUB_CHAIN_TYPE_PASS_CORNER:
            this.context_data = this.getContextCorners(
                this.context,
                this.fromRight,
                this.sequence.nodes[this.nodes[0]].pid
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

