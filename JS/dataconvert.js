/**
 * Created by zf on 2017/8/10.
 */

dataselect = function () {
    this.width = document.getElementById("svg_div").getBoundingClientRect().width;
    this.height = document.getElementById("svg_div").getBoundingClientRect().height;

    this.main(fm.getFilePath(0));
}
dataselect.prototype.datachoose = function () {
    d3.select("#").remove();
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
        navigation.setTitle(jsondata.matchinfo.team0_name,jsondata.matchinfo.team1_name,
            jsondata.matchinfo.score0,jsondata.matchinfo.score1,
            jsondata.matchinfo.date.year,jsondata.matchinfo.date.month,jsondata.matchinfo.date.day);
        time=0;
        view_time=0;
        view_transform=0;
        oldtype=-1;
        click=-1;
        console.log(jsondata);
        var width, height;
        data = new Data(jsondata);
        width = document.getElementById("svg_div").getBoundingClientRect().width;
        height = document.getElementById("svg_div").getBoundingClientRect().height;
        createDefs();
        drawback();
        var div=d3.select("#svg_div");
        var main_div=d3.select("#svg_div").select("#center").append("svg").attr("transform","translate(0,0)").attr("width",0.7*width).attr("height",0.72*height)
        mainfield = new Field(main_div, 0*width, 0.011*height, 0.94*0.65*width, 0.70*height, "mainfield", 0, 0,1);
        var time_line=new timeline(div,width,height,data.sequences,mainfield);

        infos = new Infos(data.players.team0);
        pm = new PlayersManager(data.players.team0);
        onTransition = new Array(data.sequences.length);
        for(let i = 0; i < onTransition.length; i++)
            onTransition[i] = 0;
        let svg_player = d3.select("#team").append("svg").attr("width","100%").attr("height","100%");
        width = document.getElementById("team").getBoundingClientRect().width;
        height = document.getElementById("team").getBoundingClientRect().height;
        var f2 = new Field(svg_player, 0.02*width, 0.02*height, 0.96*width, 0.96*height, "playerfield", 1, 1,1);
        var players = new Players(f2, data.players.team0);
        width = document.getElementById("svg_div").getBoundingClientRect().width;
        height = document.getElementById("svg_div").getBoundingClientRect().height;
        f3= new sequenceinfo(div,mainfield,data.sequences,width,height);
        f3.addFilters();
    }
}