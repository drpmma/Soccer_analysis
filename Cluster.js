/**
 * Created by WuJiang on 2017/7/18.
 */
var cluster_minLimit = 2;
var cluster_duration = 200;
var current_phase;
var cluster_type = 0;
var prex, prey;
function remove_cluster()
{
    d3.select("#cluster").remove();
    prex = -1; prey = -1;
}

function clusterize(phase)
{
    var state = 0;
    var start, end;
    var num=0;
    remove_cluster();
    d3.select("#svg_field").select("g").insert("g","#path_container").attr("id","cluster");
    for(var i = 0; i < phase.node.length; i++)
        if(state == 0)
        {
            if(i != phase.node.length-1)
            {
                if(phase.path[i].type == "p" || phase.path[i].type == "s")//聚团开始
                {
                    state = 1;
                    start = i;
                }
                else prex = prey = -1;
            }
        }
        else
        {
            if(i == phase.node.length-1 || (phase.path[i].type != "p" && phase.path[i].type != "s"))//聚团结束
            {
                end = i;
                state = 0;
                if(phase.path[i-1].type == "s") shoot_cluster(phase, start, end);
                else if(end - start >= cluster_minLimit) normal_cluster(phase, start, end, num++);
                else prex = prey = -1;
            }
        }
}

function shoot_cluster(phase, start, end)
{


}

function normal_cluster(phase, start, end, num) {
    var minx, maxx, miny, maxy;
    for (var i = start; i <= end; i++) {
        if (i == start) {
            minx = phase.node[i].coor.x;
            maxx = phase.node[i].coor.x;
            miny = phase.node[i].coor.y;
            maxy = phase.node[i].coor.y;
        }
        else {
            if ((+minx) > (+phase.node[i].coor.x)) minx = phase.node[i].coor.x;
            if ((+maxx) < (+phase.node[i].coor.x)) maxx = phase.node[i].coor.x;
            if ((+miny) > (+phase.node[i].coor.y)) miny = phase.node[i].coor.y;
            if ((+maxy) < (+phase.node[i].coor.y)) maxy = phase.node[i].coor.y;

        }
    }
    minx = minx / 100 * field_w; maxx = maxx / 100 * field_w;
    miny = miny / 70 * field_h; maxy = maxy / 70 * field_h;

    var svg = d3.select("#cluster")
        .append("g")
        .attr("id", "cluster" + num)
        .append("rect")
        .attr("x",(minx+maxx)/2)
        .attr("y",(miny+maxy)/2)
        .attr("width","0")
        .attr("height","0")
        .attr("fill","white")
        .attr("style","stroke:black; stroke-width:0.5%");

    switch (cluster_type){
        case 0://Node-link
        {
            var times = 0.3;
            svg.transition()
                .duration(cluster_duration)
                .attr("x",function(){return (maxx+minx-(maxx-minx)*times)/2-15;})
                .attr("y",function(){return (maxy+miny-(maxy-miny)*times)/2-15;})
                .attr("width",function(){return (maxx-minx)*times+30;})
                .attr("height",function(){return (maxy-miny)*times+30;});
            break;
        }
        case 1://Node-link-all
            break;
        case 2://Tag Cloud
            break;
        case 3://Matrix
            break;
        case 4://Hive Plot
            break;
    }

    for(i = start; i <= end; i++) transform(i);

    function transform(now) {
        var x = phase.node[now].coor.x / 100 * field_w, y = phase.node[now].coor.y / 70 * field_h;
        switch (cluster_type) {
            case 0://Node-link
            {
                var times = 0.3;
                var Node = d3.select("#Node" + now);
                var changex = ((x - (maxx+minx)/2)*times + (maxx+minx)/2).toString(),
                    changey = ((y - (maxy+miny)/2)*times + (maxy+miny)/2).toString();

                Node.transition()
                    .duration(cluster_duration)
                    .attr("transform", function () {
                        st = "translate(";
                        st = st + changex;
                        st = st + ",";
                        st = st + changey;
                        st = st + ")";
                        return st;
                    });
                if(now == start || now == end) {
                    Node.select("circle")
                        .transition().duration(cluster_duration)
                        .attr("r", 10);
                }
                else {
                    Node.select("circle")
                        .transition().duration(cluster_duration)
                        .attr("r",5);
                    Node.select("text")
                        .transition().duration(cluster_duration)
                        .attr("opacity","0");
                }

                var Path;
                var st, starr;
                if(now > 0)
                {
                    Path = d3.select("#Path"+(now-1));
                    Path.select("path")
                        .transition()
                        .duration((+cluster_duration))
                        .attr("d",function(){
                            st = Path.select("path").attr("d");
                            starr = st.split(/\s/);
                            console.log(prex,prey);
                            if(prex == -1 && prey == -1) st = "M "+starr[1]+" "+starr[2]+" L "+changex+" "+changey;
                            else st = "M "+prex+" "+prey+" L "+changex+" "+changey;
                            prex = changex; prey = changey;
                            return st;
                        })
                        .attr("stroke",function(){if(now>start&&now<=end) return "rgb(200,200,200)"; else return "black";});
                }
                console.log(now);
                Path = d3.select("#Path"+now);
                Path.select("path")
                    .transition()
                    .duration((+cluster_duration))
                    .attr("d",function(){
                        st = Path.select("path").attr("d");
                        starr = st.split(/\s/);
                        return "M "+changex+" "+changey+" L "+starr[4]+" "+starr[5];
                    });

                break;
            }
            case 1://Node-link-all
                break;
            case 2://Tag Cloud
                break;
            case 3://Matrix
                break;
            case 4://Hive Plot
                break;
        }
    }
}