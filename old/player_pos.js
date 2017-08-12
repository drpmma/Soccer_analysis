/**
 * Created by WuJiang on 2017/7/8.
 */
//player pos

var field1 = document.getElementById("player_svg_field").getBoundingClientRect();
var field_w1 = field1.width, field_h1 = field1.height;
var Player_pos, Player_id, svg_player_pos, svg_player_id;

repaint_player_value(0);
repaint_player_info(0);

function setplayer(t)
{
    console.log(t);
    player_choose = t;
    player_in_field();
    repaint_player_svg(1);
    repaint_player_value(1);
    repaint_player_info(1);
}
Player_pos = d3.select("#player_svg_field")
    .append("g")
    .attr("id", "playerpos")
    .attr("class", "player_circle");
Player_id = d3.select("#player_svg_field")
    .append("g")
    .attr("id", "player_id")
    .on("mouseover", function(){d3.select(this).style("cursor", "pointer")});
svg_player_pos = d3.select("#playerpos")
    .selectAll("g");
svg_player_id = d3.select("#player_id")
    .selectAll("g");

function player_in_field()
{
    d3.selectAll(".node")
        .select("circle")
        .attr("stroke", function(d) {
            if(d.player == player_choose)
                return "red";
            else
                return "black";
        })
        .attr("stroke-width", function(d) {
            if(d.player == player_choose)
                return 3;
            else
                return 1;
        })
}


function repaint_player_svg(r) {
    if(r == 0) {
        d3.json("./playerinfo.json", function (error, jsondata) {
            if (error) console.log(error);
            svg_player_pos.data(jsondata)
                .enter()
                .append("circle")
                .attr("class", "Player_pos")
                .attr("id", function (d, i) {
                    return "circle_pos"+i;
                })
                .attr("cx", function (d) {
                    if (d.team == teamchoose && d.on_time <= time && d.off_time > time) return d.y * field_w1 / 70;
                    else return -7
                })
                .attr("cy", function (d) {
                    if (d.team == teamchoose && d.on_time <= time && d.off_time > time) return d.x * field_h1 / 100;
                    else return -7
                })
                .attr("r", "4%")
                .attr("style", function (d) {
                    if (d.id == player_choose) return "stroke: red;stroke-width: 3;";
                    else return "stroke: grey;stroke-width: 1;";
                })
                .on("click", function (d) {
                    return setplayer(d.id)
                });
            svg_player_id.data(jsondata)
                .enter()
                .append("text")
                .attr("class", "Player_id")
                .attr("id", function (d, i) {
                    return "Player_pos"+i
                })
                .attr("x", function (d) {
                    if (d.team == teamchoose && d.on_time <= time && d.off_time > time) return d.y * field_w1 / 70;
                    else return -7
                })
                .attr("y", function (d) {
                    if (d.team == teamchoose && d.on_time <= time && d.off_time > time) return d.x * field_h1 / 100;
                    else return -7
                })
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .attr("font-family", "Verdana")
                .attr("font-size", "90%")
                .attr("color", "red")
                .on("click", function (d) {
                    return setplayer(d.id)
                })
                .text(function (d) {
                    return d.id
                });
        });
    }
    else {
        d3.json("./playerinfo.json", function (error, jsondata) {
            if (error) console.log(error);

            for(var i=0; i<jsondata.length; i++)
            {
                var d = jsondata[i];
                temp=d3.select("#circle_pos"+i);
                temp.transition()
                    .duration(duration)
                    .attr("cx", function (d) {
                        if (d.team == teamchoose && d.on_time <= time && d.off_time > time) return d.y * field_w1 / 70;
                        else return -7
                    })
                    .attr("cy", function (d) {
                        if (d.team == teamchoose && d.on_time <= time && d.off_time > time) return d.x * field_h1 / 100;
                        else return -7
                    })
                    .attr("style", function (d) {
                        if (d.id == player_choose) return "stroke: red;stroke-width: 3;";
                        else return "stroke: grey;stroke-width: 1;";
                    });
                temp=d3.select("#Player_pos"+i);
                temp.transition()
                    .duration(duration)
                    .attr("x", function (d) {
                        if (d.team == teamchoose && d.on_time <= time && d.off_time > time) return d.y * field_w1 / 70;
                        else return -7
                    })
                    .attr("y", function (d) {
                        if (d.team == teamchoose && d.on_time <= time && d.off_time > time) return d.x * field_h1 / 100;
                        else return -7;
                    });
            }
        });
    }
}