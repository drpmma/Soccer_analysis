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

    d3.json("./playerinfo.json", function(error,jsondata){
        if(error) console.log(error);
        console.log(jsondata);
        svg_player_pos.data(jsondata)
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
        svg_player_id.data(jsondata)
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

function repaint_player_info(r)
{
    var field2 = document.getElementById("game_info").getBoundingClientRect();
    var field_w2 = field2.width, field_h2 = field2.height;
    var svg;
    var temp;
    if(r == 0)
    {
        svg = d3.select("#game_info")
            .append("svg")
            .attr("width",field_w2)
            .attr("height",field_h2);
        d3.json("./value_info.json", function(error, jsondata){
            if(error) console.log(error);
            console.log(jsondata);
            //solid
            svg.append("g")//title
                .attr("id","value_title")
                .selectAll("g")
                .data(jsondata)
                .enter()
                .append("text")
                .attr("class", "title")
                .attr("y", function(d,i){return field_h2*(0.35+0.15*i);})
                .text(function(d){return d.title});
            svg.append("g")//subtitle
                .attr("id","value_subtitle")
                .selectAll("g")
                .data(jsondata)
                .enter()
                .append("text")
                .attr("class", "subtitle")
                .attr("y", function(d,i){return field_h2*(0.4+0.15*i);})
                .text(function(d){return d.subtitle});
            svg.append("g")//back_rect
                .attr("id","value_rec")
                .selectAll("g")
                .data(jsondata)
                .enter()
                .append("rect")
                .attr("x",field_w2*0.25)
                .attr("y", function(d,i){return field_h2*(0.3+0.15*i);})
                .attr("width",field_w2*0.7)
                .attr("height",field_h2*0.05)
                .attr("style", "fill:rgb(200,200,255)");
            svg.append("g")//limit_value
                .attr("id","value_limit")
                .selectAll("g")
                .data(jsondata)
                .enter()
                .append("text")
                .attr("class", "mark")
                .attr("x", field_w2*0.95)
                .attr("y", function(d,i){return field_h2*(0.4+0.15*i);})
                .text(function(d){return d.limit});
            //changeable
            svg.append("g")//current_rec
                .attr("id","current_rec")
                .selectAll("g")
                .data(jsondata)
                .enter()
                .append("rect")
                .attr("id",function(d,i){return "current_rec"+i;})
                .attr("x",field_w2*0.25)
                .attr("y", function(d,i){return field_h2*(0.31+0.15*i);})
                .attr("width",0)
                .attr("height",field_h2*0.03)
                .attr("style","fill:rgb(0,0,255)");
            svg.append("g")//current_value
                .attr("id","current_value")
                .selectAll("g")
                .data(jsondata)
                .enter()
                .append("text")
                .attr("id", function(d,i){return "current_value"+i;})
                .attr("class", "mark")
                .attr("x", field_w2*0.25)
                .attr("y", function(d,i){return field_h2*(0.4+0.15*i);})
                .text("0");
            svg.append("g")//avg_line
                .attr("id","avg_line")
                .selectAll("g")
                .data(jsondata)
                .enter()
                .append("line")
                .attr("id", function(d,i){return "avg_line"+i;})
                .attr("class", "avg_line")
                .attr("x1",field_w2*0.25).attr("x2",field_w2*0.25)
                .attr("y1", function(d,i){return field_h2*(0.3+0.15*i);}).attr("y2", function(d,i){return field_h2*(0.35+0.15*i);});
            svg.append("g")//avg_value
                .attr("id","avg_value")
                .selectAll("g")
                .data(jsondata)
                .enter()
                .append("text")
                .attr("id", function(d,i){return "avg_value"+i;})
                .attr("class", "mark")
                .attr("x", field_w2*0.25)
                .attr("y", function(d,i){return field_h2*(0.4+0.15*i);})
                .text(0);
        });
    }
    else
    {
        var currentvalue, avgvalue, currentid, currentname, currentpos;
        d3.json("./playerinfo.json", function(error, jsondata) {
            if (error) console.log(error);
            for(var o in jsondata){
                if(jsondata[o].id == player_choose && jsondata[o].team == teamchoose)
                {
                    currentvalue = jsondata[o].value;
                    avgvalue = jsondata[o].avg_value;
                    cunrrentid = jsondata[o].id;
                    cunrrentname = jsondata[o].name;
                    cunrrentpos = jsondata[o].position;
                }
            }
        });
        d3.json("./value_info.json", function(error, jsondata) {
            if (error) console.log(error);

            for(var o=0; o<jsondata.length; o++)
            {
                temp = d3.select("#current_rec"+o);
                temp.transition()
                     .duration(500)
                     .style("width",(field_w2*0.7*currentvalue[o]/jsondata[o].limit).toString());
                temp = d3.select("#current_value"+o);
                temp.transition()
                    .duration(500)
                    .attr("x",(field_w2*(0.25+0.7*currentvalue[o]/jsondata[o].limit)).toString())
                    .text(currentvalue[o]);
                temp = d3.select("#avg_line"+o);
                temp.transition()
                    .duration(500)
                    .attr("x1",(field_w2*(0.25+0.7*avgvalue[o]/jsondata[o].limit)).toString())
                    .attr("x2",(field_w2*(0.25+0.7*avgvalue[o]/jsondata[o].limit)).toString());
                temp = d3.select("#avg_value"+o);
                temp.transition()
                    .duration(500)
                    .attr("x",(field_w2*(0.25+0.7*avgvalue[o]/jsondata[o].limit)).toString())
                    .text(avgvalue[o]);
            }
        })
    }
}
