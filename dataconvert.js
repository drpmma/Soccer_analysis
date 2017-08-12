/**
 * Created by zf on 2017/8/10.
 */

dataselect = function () {
    this.width = document.getElementById("svg_div").getBoundingClientRect().width;
    this.height = document.getElementById("svg_div").getBoundingClientRect().height;

    this.main("./data/dumpData_t178_m456391_agg0.json");
}
dataselect.prototype.datachoose = function () {
    d3.select("#screen").remove();
    var sel=document.getElementById("datachoose");
    console.log(sel.options)
    var value=sel.options[sel.selectedIndex].value;
    data_select.main(value);
}
dataselect.prototype.main=function (value) {
    this.value=value;
    d3.queue().defer(d3.json, value).await(main);
    function main(error, jsondata) {
        if (error) throw error;
        console.log(jsondata);
        var width, height;
        data = new Data(jsondata);
        width = document.getElementById("svg_div").getBoundingClientRect().width;
        height = document.getElementById("svg_div").getBoundingClientRect().height;
        var svg = d3.select("#svg_div").append("svg").attr("id","screen");
        svg.attr("width", width).attr("height", height);
        createDefs();
        mainfield = new Field(svg, 0.2*width, 0.2*height, 0.62*width, 0.65*height, "mainfield", 0, 0,1);
        infos = new Infos(svg, 0.007*width, 0.47*height, 0.15*width, 0.5*height, data.players);
        pm = new PlayersManager();
        var time_line=new timeline(svg,width,height);
        f3= new matchinfo(svg,mainfield,data.sequences,width,height);
        var f2 = new Field(svg, 0.007*width, 0.01*height, 0.15*width, 0.45*height, "playerfield", 1, 1,1);
        var players = new Players(f2, data.players);
        // setting = new Setting(0.2*width, 0.86*height, 0.62*width, 0.112*height);
    }
}