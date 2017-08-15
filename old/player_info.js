/**
 * Created by WuJiang on 2017/7/13.
 */

//player information

function repaint_player_info(r)
{
    var field = document.getElementById("player_info").getBoundingClientRect();
    var field_w = field.width, field_h = field.height;
    var svg;
    var temp;
    if(r == 0)
    {
        svg = d3.select("#player_info")
            .append("svg")
            .attr("width",field_w)
            .attr("height",field_h);
        d3.json("./value_info.json", function(error, jsondata){
            if(error) console.log(error);
            temp = svg.append("g");
            temp.append("text")
                .attr("id","current_id")
                .attr("class","playerinfo_id")
                .attr("x",0.25*field_w)
                .attr("y",0.9*field_h)
                .attr("textLength", 0.3*field_w)
                .text("");
            temp.append("text")
                .attr("id","current_name")
                .attr("class","playerinfo_name")
                .attr("x",0.5*field_w)
                .attr("y",0.4*field_h)
                .attr("textLength",0.9*field_w)
                .text("");
            temp.append("text")
                .attr("id","current_pos")
                .attr("class","playerinfo_pos")
                .attr("x",0.7*field_w)
                .attr("y",0.82*field_h)
                .attr("textLength",0.4*field_w)
                .text("");
        });
    }
    else
    {
        var currentid, currentname, currentpos;
        d3.json("./playerinfo.json", function(error, jsondata) {
            if (error) console.log(error);
            for (var o = 0; o < jsondata.length; o++) {
                if (jsondata[o].team == teamchoose && jsondata[o].id == player_choose) {
                    currentid = jsondata[o].id;
                    currentname = jsondata[o].name;
                    currentpos = jsondata[o].position;
                }
            }
            temp = d3.select("#current_id");
            temp.transition()
                .duration(duration)
                .text(currentid);
            temp = d3.select("#current_name");
            temp.transition()
                .duration(duration)
                .text(currentname);
            temp = d3.select("#current_pos");
            temp.transition()
                .duration(duration)
                .text(currentpos);
        })
    }
}
