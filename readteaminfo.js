/**
 * Created by WuJiang on 2017/7/8.
 */

var field = document.getElementById("game_title_field").getBoundingClientRect();
var field_w = field.width, field_h = field.height;

d3.csv("gameinfo.csv", function(error,csvdata){
    if(error) console.log(error);
    var team0 = csvdata[0].team;
    var team1 = csvdata[1].team;
    var score0 = csvdata[0].score;
    var score1 = csvdata[1].score;

    var teamData = [{team:team0, score:score0},{team:team1, score:score1}];
    var dateData = [{year:csvdata[0].year, month:csvdata[0].month, day:csvdata[0].day}]

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
        .attr("x", function(d,i){return 0.2*field_w+i*field_w*0.6})
        .attr("y", 0.3*field_h)
        .attr("textLength", field_w*0.4)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-family", "华文行楷")
        .attr("font-size", "30")
        .attr("color","black")
        .text(function(d){return d.team});

    var svg_score = d3.select("#score_info")
        .selectAll("g")
        .data(teamData)
        .enter()
        .append("text")
        .attr("class", "Score")
        .attr("id", function(d,i){return i})
        .attr("x", function(d,i){return 0.2*field_w+i*field_w*0.6})
        .attr("y", 0.6*field_h)
        .attr("textLength", field_w*0.35)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-family", "方正舒体")
        .attr("font-size", "40")
        .attr("color","black")
        .text(function(d){return d.score});

    var date = d3.select("#date_info")
        .selectAll("g")
        .data(dateData)
        .enter()
        .append("text")
        .attr("class", "Date")
        .attr("id", "date")
        .attr("x", 0.5*field_w)
        .attr("y", 0.9*field_h)
        .attr("textLength", field_w*0.6)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-family", "华文新魏")
        .attr("font-size", "20")
        .attr("color","black")
        .text(function(d){return "date : " + d.year + "-" + d.month + "-" + d.day});

});


