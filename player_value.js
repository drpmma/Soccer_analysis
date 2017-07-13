/**
 * Created by WuJiang on 2017/7/13.
 */

//player info

function repaint_player_value(r)
{
    var field = document.getElementById("player_value").getBoundingClientRect();
    var field_w = field.width, field_h = field.height;
    var svg;
    var temp;
    if(r == 0)
    {
        svg = d3.select("#player_value")
            .append("svg")
            .attr("width",field_w)
            .attr("height",field_h);
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
                .attr("x", 0.02*field_w)
                .attr("y", function(d,i){return field_h*(0.05+0.08*i);})
                .text(function(d){return d.title});
            svg.append("g")//back_rect
                .attr("id","value_rec")
                .selectAll("g")
                .data(jsondata)
                .enter()
                .append("rect")
                .attr("x",field_w*0.2)
                .attr("y", function(d,i){return field_h*(0.01+0.08*i);})
                .attr("width",field_w*0.7)
                .attr("height",field_h*0.05)
                .attr("style", "fill:rgb(200,200,255)");
            svg.append("g")//limit_value
                .attr("id","value_limit")
                .selectAll("g")
                .data(jsondata)
                .enter()
                .append("text")
                .attr("class", "mark")
                .attr("x", field_w*0.95)
                .attr("y", function(d,i){return field_h*(0.05+0.08*i);})
                .text(function(d){return d.limit});
            //changeable
            svg.append("g")//current_rec
                .attr("id","current_rec")
                .selectAll("g")
                .data(jsondata)
                .enter()
                .append("rect")
                .attr("id",function(d,i){return "current_rec"+i;})
                .attr("x",field_w*0.2)
                .attr("y", function(d,i){return field_h*(0.02+0.08*i);})
                .attr("width",0)
                .attr("height",field_h*0.03)
                .attr("style","fill:steelblue;");
            svg.append("g")//current_value
                .attr("id","current_value")
                .selectAll("g")
                .data(jsondata)
                .enter()
                .append("text")
                .attr("id", function(d,i){return "current_value"+i;})
                .attr("class", "mark")
                .attr("x", field_w*0.2)
                .attr("y", function(d,i){return field_h*(0.085+0.08*i);})
                .text("0");
            svg.append("g")//avg_line
                .attr("id","avg_line")
                .selectAll("g")
                .data(jsondata)
                .enter()
                .append("line")
                .attr("id", function(d,i){return "avg_line"+i;})
                .attr("class", "avg_line")
                .attr("x1",field_w*0.2).attr("x2",field_w*0.2)
                .attr("y1", function(d,i){return field_h*(0.01+0.08*i);}).attr("y2", function(d, i){return field_h*(0.06+0.08*i);});
            svg.append("g")//avg_value
                .attr("id","avg_value")
                .selectAll("g")
                .data(jsondata)
                .enter()
                .append("text")
                .attr("id", function(d,i){return "avg_value"+i;})
                .attr("class", "mark")
                .attr("x", field_w*0.2)
                .attr("y", function(d,i){return field_h*(0.085+0.08*i);})
                .text(0);
        });
    }
    else
    {
        var currentvalue=new Array(), avgvalue=new Array();
        d3.json("./playerinfo.json", function(error, jsondata) {
            if (error) console.log(error);
            if(player_choose == -1)
            {
                for(var o=0; o<jsondata[0].value.length; o++)
                {
                    currentvalue.push(0);
                    avgvalue.push(0);
                }
            }
            else
                for(var o=0; o<jsondata.length; o++)
                {
                    if (jsondata[o].team == teamchoose && jsondata[o].id == player_choose) {
                        currentvalue = jsondata[o].value;
                        avgvalue = jsondata[o].avg_value;
                    }
                }

            // console.log("id: " + currentid);
            // console.log("name: " + currentname);
            // console.log("pos: " + currentpos);
            // console.log("value: " + currentvalue);
            // console.log("avg: " + avgvalue);

            d3.json("./value_info.json", function(error, jsondata1) {
                if (error) console.log(error);

                for(var o=0; o<jsondata1.length; o++)
                {
                    temp = d3.select("#current_rec"+o);
                    temp.transition()
                        .duration(duration)
                        .style("width",(field_w*0.7*currentvalue[o]/jsondata1[o].limit).toString());
                    temp = d3.select("#current_value"+o);
                    temp.transition()
                        .duration(duration)
                        .attr("x",(field_w*(0.2+0.7*currentvalue[o]/jsondata1[o].limit)).toString())
                        .text(currentvalue[o]);
                    temp = d3.select("#avg_line"+o);
                    temp.transition()
                        .duration(duration)
                        .attr("x1",(field_w*(0.2+0.7*avgvalue[o]/jsondata1[o].limit)).toString())
                        .attr("x2",(field_w*(0.2+0.7*avgvalue[o]/jsondata1[o].limit)).toString());
                    temp = d3.select("#avg_value"+o);
                    temp.transition()
                        .duration(duration)
                        .attr("x",(field_w*(0.2+0.7*avgvalue[o]/jsondata1[o].limit)).toString())
                        .text(avgvalue[o]);
                }
            })
        });


    }
}