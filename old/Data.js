function Coor(x, y){
    this.x = x;
    this.y = y;
};

function Nodedata(coor, player, team){
    this.coor = coor;
    this.player = player;
    this.team = team;
}

function Pathdata(source, target, type) {
    this.source = source;
    this.target = target;
    this.type = type;
}

function Phase(start, end, node, path) {
    this.start = start;
    this.end = end;
    this.node = node;
    this.path = path;
}
