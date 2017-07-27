var node_array;
var path_array;
var path_type = new Array();
var phase_0 = new Array();
var phase_1 = new Array();
var start, end, lastcoor, lastaction;

d3.queue().defer(d3.csv, "data.csv", function(csvdata) {
    if(csvdata.phase == "s"){
        start = csvdata.time;
        node_array = new Array();
        path_array = new Array();
    }
    if(csvdata.phase == "e"){
        var end = csvdata.time;
        if(csvdata.player == 0)
            phase_0.push(new Phase(start, end, node_array, path_array));
        else if(csvdata.player == 1)
            phase_1.push(new Phase(start, end, node_array, path_array));
        delete node_array;
        delete path_array;
    }
    else{
        var split = csvdata.coor.split(",");
        var coor = {x:parseInt(split[0]), y:parseInt(split[1])};
        if(csvdata.player != "1" || csvdata.player != "0")
        {
            split = csvdata.player.split("-");
            node_array.push(new Nodedata(coor, split[1], split[0]));
        }
    }
    if(csvdata.phase != "s" && csvdata.phase != "e"){
        path_array.push(new Pathdata(lastcoor, coor, lastaction));
    }
    lastcoor = coor;
    lastaction = csvdata.action;
}).await(court);
