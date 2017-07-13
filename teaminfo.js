/**
 * Created by WuJiang on 2017/7/8.
 */

// team info
var time = 2700;
var duration = 500;
var teamchoose = 0;
var player_choose = -1;
var field0 = document.getElementById("game_title_field").getBoundingClientRect();
var field_w0 = field0.width, field_h0 = field0.height;

repaint_player_svg(0);

function setteam(t)
{
    teamchoose = t;
    player_choose = -1;
    repaint_player_svg(1);
    repaint_player_value(1);
    repaint_player_info(1);
}

d3.json("./gameinfo.json", function(error,jsondata){
    if(error) console.log(error);
    var team0 = jsondata[0].team;
    var team1 = jsondata[1].team;
    var score0 = jsondata[0].score;
    var score1 = jsondata[1].score;

    var teamData = [{team:team0, score:score0},{team:team1, score:score1}];
    var dateData = [{year:jsondata[0].year, month:jsondata[0].month, day:jsondata[0].day}];
    var Team = d3.select("#game_title_field")
        .append("g")
        .attr("id", "team_info");
    var Score = d3.select("#game_title_field")
        .append("g")
        .attr("id", "score_info");
    var Date = d3.select("#game_title_field")
        .append("g")
        .attr("id", "date_info");
    var svg_team = d3.select("#team_info")
        .selectAll("g")
        .data(teamData)
        .enter()
        .append("text")
        .attr("class", "Team")
        .attr("id", function(d,i){return i})
        .attr("x", function(d,i){return 0.2*field_w0+i*field_w0*0.6})
        .attr("y", 0.3*field_h0)
        .attr("textLength", field_w0*0.4)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-family", "华文行楷")
        .attr("font-size", "180%")
        .attr("color","black")
        .on("click", function(d,i){return setteam(i)})
        .text(function(d){return d.team});
    var svg_score = d3.select("#score_info")
        .selectAll("g")
        .data(teamData)
        .enter()
        .append("text")
        .attr("class", "Score")
        .attr("id", function(d,i){return i})
        .attr("x", function(d,i){return 0.2*field_w0+i*field_w0*0.6})
        .attr("y", 0.6*field_h0)
        .attr("textLength", field_w0*0.35)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-family", "方正舒体")
        .attr("font-size", "240%")
        .attr("color","black")
        .text(function(d){return d.score});
    var date = d3.select("#date_info")
        .selectAll("g")
        .data(dateData)
        .enter()
        .append("text")
        .attr("class", "Date")
        .attr("id", "date")
        .attr("x", 0.5*field_w0)
        .attr("y", 0.9*field_h0)
        .attr("textLength", field_w0*0.6)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-family", "华文新魏")
        .attr("font-size", "120%")
        .attr("color","black")
        .text(function(d){return "date : " + d.year + "-" + d.month + "-" + d.day});
});




