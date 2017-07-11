/**
 * Created by WuJiang on 2017/7/8.
 */

// team info
var time = 2700;
var field = document.getElementById("game_title_field").getBoundingClientRect();
var field_w = field.width, field_h = field.height;
var teamchoose = 0;
repaint_player_svg(0);

function setteam(t)
{
    teamchoose = t;
    repaint_player_svg(1);
}

d3.csv("./gameinfo.csv", function(error,csvdata){
    if(error) console.log(error);
    var team0 = csvdata[0].team;
    var team1 = csvdata[1].team;
    var score0 = csvdata[0].score;
    var score1 = csvdata[1].score;

    var teamData = [{team:team0, score:score0},{team:team1, score:score1}];
    var dateData = [{year:csvdata[0].year, month:csvdata[0].month, day:csvdata[0].day}];
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
        .on("click", function(d,i){return setteam(i)})
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

/**
 * Created by WuJiang on 2017/7/8.
 */
//player pos

var field1 = document.getElementById("player_svg_field").getBoundingClientRect();
var field_w1 = field1.width, field_h1 = field1.height;
var Player_pos, Player_id, svg_player_pos, svg_player_id;
var player_choose = -1;
repaint_player_info(0);

function setplayer(t)
{
    player_choose = t;
    repaint_player_info(1);
}
Player_pos = d3.select("#player_svg_field")
    .append("g")
    .attr("id", "player_pos")
    .attr("class", "fieldLines");
Player_id = d3.select("#player_svg_field")
    .append("g")
    .attr("id", "player_id");
svg_player_pos = d3.select("#player_pos")
    .selectAll("g");
svg_player_id = d3.select("#player_id")
    .selectAll("g");

function repaint_player_svg(r) {
    if(r) {
        p = Player_pos.selectAll("circle");
        console.log(p);
        p.remove();
        p = Player_id.selectAll("text");
        console.log(p);
        p.remove();
    }

    d3.csv("./playerinfo.csv", function(error,csvdata){
        if(error) console.log(error);

        svg_player_pos.data(csvdata)
            .enter()
            .append("circle")
            .attr("class", "Player_pos")
            .attr("id", function(d,i){return i})
            .attr("cx", function(d)
            {
                if(d.team == teamchoose && d.on_time <= time && d.off_time > time) return d.y*field_w1/70;
                else return -7
            })
            .attr("cy", function(d)
            {
                if(d.team == teamchoose && d.on_time <= time && d.off_time > time) return d.x*field_h1/100;
                else return -7
            })
            .attr("r", 7);
        svg_player_id.data(csvdata)
            .enter()
            .append("text")
            .attr("class", "Player_id")
            .attr("id", function(d,i){return i})
            .attr("x", function(d)
            {
                if(d.team == teamchoose && d.on_time <= time && d.off_time > time) return d.y*field_w1/70;
                else return -7
            })
            .attr("y", function(d)
            {
                if(d.team == teamchoose && d.on_time <= time && d.off_time > time) return d.x*field_h1/100;
                else return -7
            })
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-family", "Arial")
            .attr("font-size", 5)
            .attr("color","red")
            .on("click", function(d){return setplayer(d.id)})
            .text(function(d){return d.id});
    });
}

//player info
// var field2 = document.getElementById("game_info").getBoundingClientRect();
// var field_w2 = field2.width, field_h2 = field2.height;
// var svg = d3.select("#game_info")
//     .append("svg")
//     .attr("width",field_w2)
//     .attr("height",field_h2);
// var g1=svg.append("g")
//     .attr("id", "value1");
// var g2=svg.append("g")
//     .attr("id", "value2");
// var ttl = svg.append("text")//title1
//     .text("进球")
//     .append("text")//subtitle1
//     .text("shoot")
//     .append("text")//title2
//     .text("防守")
//     .append("text")//subtitle2
//     .text("defend");

function repaint_player_info(r)
{
//     if(r == 0)
//     {
//
//
//         var temp1 = g1.append("text")//name
//             .attr("class","title")
//             .append("text")//id
//             .attr("class","subtitle")
//             .append("rect")//value1
//
//             .append("rect")//value1_avg
//             .append("rect")//value2
//             .append("rect")//value2_avg
//     }
//     d3.csv("playerinfo.csv", function(error, csvdata) {
//         if(error) console.log(error);
//         console.log(csvdata);
//
//
//     });
}
