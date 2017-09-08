function remove_node(num){
	var name="#g_point"+num.toString();
	d3.select(name).transition().duration().remove()
}
function remove_court(){
	d3.select("#time_line").select("#timeline_svg").selectAll(".g_smallcourt").remove();
	remove_path();
}
function add_node()
{
	var total=teamchoose?phase_1.length:phase_0.length
	for(var num=0;num<total;num++)
	{
        var name="#smallcourt"+num.toString()
        var svg2=d3.select(name)
        var g_point=svg2.append("g")
            .attr('id',function(){
                return "g_point"+num.toString()
            } )
        g_point.selectAll("circle")
            .data(function () {
                if(teamchoose) return phase_1[num].node;
                else return phase_0[num].node
            })
            .enter()
            .append("circle")
            .attr('cx',function(d,i){
                return (d.coor.y/70*100).toString()+"%"
            } )
            .attr('cy',function(d,i){
                return (d.coor.x/100*100).toString()+"%"
            } )
            .attr('r', "2%")
            .attr('fill',"black" )
    }
}
function add_path() {
    var total=teamchoose?phase_1.length:phase_0.length
    for(var num=0;num<total;num++)
    {
        var name="#smallcourt"+num.toString()
        var svg2=d3.select(name)
        var g_path=svg2.append("g")
        	.attr("id",function(d,i){
        		return "g_path"+i;
        	});
        g_path.selectAll("line")
        	.data(function () {
                if(teamchoose) return phase_1[num].path;
                else return phase_0[num].path
           })
        	.enter().append("line")
        	.attr("id",function (d,i) {
        		return "smallcourt_path"+i;
           })
        	.attr("x1",function (d) {
        		return d.source.y/70*100+"%"
           })
           .attr("y1",function (d) {
               return d.source.x+"%"
           })
           .attr("x2",function (d) {
               return d.target.y/70*100+"%"
           })
           .attr("y2",function (d) {
               return d.target.x+"%"
           })
        	.attr("stroke","black")
        	.attr("stroke-width","2px")
    }
}
function add_path_gray() {
    var total=teamchoose?phase_1.length:phase_0.length
    for(var num=0;num<total;num++)
    {
        var name="#smallcourt"+num.toString()
        var svg2=d3.select(name)
        var g_path=svg2.append("g")
            .attr("id",function(d,i){
                return "g_path_gray"+i;
            });
        g_path.selectAll("line")
            .data(function () {
                if(teamchoose) return phase_1[num].path;
                else return phase_0[num].path
            })
            .enter().append("line")
            .attr("id",function (d,i) {
                return "smallcourt_path"+i;
            })
            .attr("x1",function (d) {
                return d.source.y/70*100+"%"
            })
            .attr("y1",function (d) {
                return d.source.x+"%"
            })
            .attr("x2",function (d) {
                return d.target.y/70*100+"%"
            })
            .attr("y2",function (d) {
                return d.target.x+"%"
            })
            .attr("stroke","lightgray")
            .attr("stroke-width","10px")
    }
}
function X_proj()
{
    var total=teamchoose?phase_1.length:phase_0.length
    for(var num=0;num<total;num++)
    {
    	var node=teamchoose?phase_1[num].node:phase_0[num].node;
        var name="#smallcourt"+num.toString()
        var svg2=d3.select(name)
        var g_xproj=svg2.append("g")
            .attr('id',function(){
                return "g_x_rect"+num.toString()
            } )
		var data= [0,0,0,0,0,0,0,0,0,0];
		for(var i=0;i<node.length;i++)
		{
			data[parseInt((node[i].coor.x-1)/10)]++
		}
		g_xproj.selectAll("rect")
			.data(data)
			.enter().append("rect")
			.attr("id",function(d,i){
				return "num_player_court"+num+"_"+i;
			})
			.attr("x","0%")
			.attr("y",function(d,i){
				return 10*i.toString()+"%"
			})
			.attr("height","10%")
			.attr("width",function (d) {
				return (10*d+1).toString()+"%"
            })
			.attr("fill","steelblue")
			.attr("opacity","0.5")
			.attr("stroke","steelblue")
        g_xproj.selectAll("text")
            .data(data)
            .enter().append("text")
            .attr("id",function(d,i){
                return "num_player_court"+num+"_"+i;
            })
            .attr("x","0%")
            .attr("y",function(d,i){
                return (10*i+8).toString()+"%"
            })
			.attr("font-size","80%")
			.html(function(d)
			{return d})
}
}
function Y_proj()
{
    var total=teamchoose?phase_1.length:phase_0.length
    for(var num=0;num<total;num++)
    {
        var node=teamchoose?phase_1[num].node:phase_0[num].node;
        var name="#smallcourt"+num.toString()
        var svg2=d3.select(name)
        var g_yproj=svg2.append("g")
            .attr('id',function(){
                return "g_x_rect"+num.toString()
            } )
        var data= [0,0,0,0,0,0,0,0,0,0];
        for(var i=0;i<node.length;i++)
        {
            data[parseInt((node[i].coor.y-1)/10)]++
        }
        g_yproj.selectAll("rect")
            .data(data)
            .enter().append("rect")
            .attr("id",function(d,i){
                return "num_player_court"+num+"_"+i;
            })
            .attr("y","0%")
            .attr("x",function(d,i){
                return 10*i.toString()+"%"
            })
            .attr("width","10%")
            .attr("height",function (d) {
                return (10*d+1).toString()+"%"
            })
            .attr("fill","steelblue")
            .attr("opacity","0.5")
            .attr("stroke","steelblue")
        g_yproj.selectAll("text")
            .data(data)
            .enter().append("text")
            .attr("id",function(d,i){
                return "num_player_court"+num+"_"+i;
            })
            .attr("y","8%")
            .attr("x",function(d,i){
                return (10*i).toString()+"%"
            })
            .attr("font-size","70%")
            .html(function(d)
            {return d})
    }
}
function distance_align()
{
    var total=teamchoose?phase_1.length:phase_0.length;
    for(var num=0;num<total;num++)
	{
		var name="#g_smallcourt"+num;
		var g_court=d3.select("#time_line").select("#timeline_svg").select(name)
        var node=teamchoose?phase_1[num].node:phase_0[num].node;
		g_court.select(".abc").remove();
		var data= new Array();
		for(var i=0;i<node.length;i++)
			data.push(node[i].coor.x)
		var max=d3.max(data);
		var svg=g_court.append("svg")
			.attr("class","abc")
			.attr("id",function(){
				return "distance_align"+num
			})
			.attr("x",function () {

				return (num*100/total).toString()+"%"
            })
			.attr("y","45%")
			.attr("width",function () {
				return (100/total-2)/100*max+"%"
            })
			.attr("height","10%")
		svg.append("rect")
			.attr("id",function () {
				return "distance_align_rect"+num
            })
			.attr("width",function(){
				return "100%";
			})
			.attr("height","100%")
			.attr("x","0%")
			.attr("y","0%")
			.attr("stroke","black")
			.attr("stroke-width","2px")
			.attr("fill","white")
		var g_align_point=svg.append("g")
			.attr("id",function () {
				return "g_align_node"+num;
            })
			g_align_point.selectAll("circle")
				.data(data)
				.enter().append("circle")
				.attr("cx",function (d) {
					return d+"%"
                })
				.attr("cy","50%")
				.attr("r","1.5%")
				.attr("fill",function (d,i) {
					if(i==data.length-1)
						return "red"
					else
						return "black"
                })
	}
}
function donut() {
    var total=teamchoose?phase_1.length:phase_0.length;
    var data =new Array();
    for(var num=0;num<total;num++) {
        var name = "#g_smallcourt" + num;
        var g_court = d3.select("#time_line").select("#timeline_svg").select(name)
        var phase = teamchoose ? phase_1[num] : phase_0[num];
        g_court.select(".abc").remove();
        var end=phase.end.split(":")
		var start=phase.start.split(":")
		var time=parseInt(end[1])-parseInt(start[1])+(parseInt(end[0])-parseInt(start[0]))*60
        data.push(time)
    }
    console.log(data)
    var angele_data=d3.pie()(data);
    console.log(angele_data)
    var color=d3.scaleLinear()
		.domain([0,10])
		.range(["red","green"])
    for(var num=0;num<total;num++) {
        var name = "#g_smallcourt" + num;
        var g_court = d3.select("#time_line").select("#timeline_svg").select(name)
        var arc=d3.arc()
            .innerRadius(0)
            .outerRadius(80)
            .padAngle(0.05)
            .startAngle(angele_data[num].startAngle)
            .endAngle(angele_data[num].endAngle)
        g=g_court.append("g")
			.attr("transform","translate(400,170)")
			.attr("class","abc")
			.attr("id",function () {
				return "g_arc"+num
            })
		g.append("path")
			.attr("d",arc)
			.attr("fill",function () {
				return color(num)
            })
        g.append("text")
            .text(function () {
                return num
            })
            .attr("transform",function()
            {
                return "translate("+arc.centroid(angele_data[num])+")"
            })
            .attr("text-anchor","middle")


    }

}
function draw_court() {
    var total=teamchoose?phase_1.length:phase_0.length;
    var svg=d3.select("#time_line").select("#timeline_svg")
    for(var i=0;i<total;i++)
	{
		var name = "#g_smallcourt"+i;
		var g=svg.select(name);
        var g1=g.append('svg')
            .attr('class', "abc")
            .attr('x',function(){
                return (i*100/total).toString()+"%"
            })
            .attr('y',"35%" )
            .attr('width', "6%")
            .attr('height',"60%")
        var svg2=g1.append('g')
            .attr('id',function(){
                return "smallcourt"+i.toString()
            } )
        svg2.append('rect')
            .attr('class',"fieldRect" )
            .attr('x',"0%")
            .attr('y',"0%" )
            .attr('width',"100%")
            .attr('height',"100%")
        svg2.append("circle")
            .attr('class',"fieldLines")
            .attr('cy',"11%" )
            .attr('cx',"50%" )
            .attr('r',"12.5%" )
        svg2.append('circle')
            .attr('class',"fieldLines" )
            .attr('cx', "50%")
            .attr('cy', "89%")
            .attr('r', "12.5%")
        svg2.append('rect')
            .attr('class',"fieldLines" )
            .attr('x',"20%" )
            .attr('y', "0")
            .attr('width', "60%")
            .attr('height',"15%" )
        svg2.append('rect')
            .attr('class',"fieldLines" )
            .attr('x',"20%" )
            .attr('y', "85%")
            .attr('width', "60%")
            .attr('height',"15%" )
        svg2.append('rect')
            .attr('class',"fieldLines" )
            .attr('x',"37%" )
            .attr('y', "0")
            .attr('width', "26%")
            .attr('height',"5%" )
        svg2.append('rect')
            .attr('class',"fieldLines" )
            .attr('x',"37%" )
            .attr('y', "95%")
            .attr('width', "26%")
            .attr('height',"5%" )
        svg2.append('line')
            .attr('class',"Gate" )
            .attr('x1',"45%" )
            .attr('y1', "0")
            .attr('x2', "55%")
            .attr('y2', "0%")
        svg2.append('line')
            .attr('class',"Gate" )
            .attr('x1',"45%" )
            .attr('y1', "100%")
            .attr('x2', "55%")
            .attr('y2', "100%")
        svg2.append("circle")
            .attr('class',"Points")
            .attr('cy',"11%" )
            .attr('cx',"50%" )
            .attr('r',"0.5%" )
        svg2.append("circle")
            .attr('class',"Points")
            .attr('cy',"89%" )
            .attr('cx',"50%" )
            .attr('r',"0.5%" )
        svg2.append("circle")
            .attr('class',"fieldLines")
            .attr('cy',"50%" )
            .attr('cx',"50%" )
            .attr('r',"12.5%" )
        svg2.append("circle")
            .attr('class',"Points")
            .attr('cy',"50%" )
            .attr('cx',"50%" )
            .attr('r',"0.5%" )
        svg2.append('line')
            .attr('class',"fieldLines" )
            .attr('x1',"0%" )
            .attr('y1', "50%")
            .attr('x2', "100%")
            .attr('y2', "50%")
	}
}
function remove_small_court() {
    d3.select("#time_line").select("#timeline_svg").selectAll(".abc").remove()
}
function court(){
	var num=0;
	var total=teamchoose?phase_1.length:phase_0.length
	var svg=d3.select("#time_line").select("#timeline_svg")
	var g=svg.selectAll("g")
			.data(function(){
				if(teamchoose) return phase_1;
				else return phase_0
			})
			.enter().append('g')
			.attr("id",function(d,i){
				return "g_smallcourt"+i
			})
		.attr("class","g_smallcourt")
			.on('mouseenter', function(d,i) {
				d3.select(this).select(".abc")
					.append('rect')
					.attr('id',"selected")
					.attr('x',"0%")
					.attr('y',"0%" )
					.attr('width',"100%")
					.attr('height',"100%")
					.style('fill', 'gray')
					.style('fill-opacity', '0.5')
				d3.select(this).select("#circletimeline")
					.attr("r","1.2%")
				//add_node()
				/* Act on the event */
			})
			.on('mouseleave', function(d,i) {
				d3.select(this).select(".abc").select("#selected").remove()
				d3.select(this).select("#circletimeline")
					.attr("r","0.8%")
					
				// /* Act on the event */
			})
			.on('click',function(d,i)
			{
                remove_cluster();
				remove_path();
				path_field(i);
				//remove_node(i)
			})

	g.append("circle")
		.attr('id',"circletimeline" )
	    .attr('cx', function(d){
	    	var end=d.end.split(":")
	    	return end[0]+"."+end[1]+"%"
	    })
	    .attr('cy', "19.5%")
	    .attr('r', "0.8%")
	    .style('fill', "red")
	draw_court();
	add_node();
	// var g1=g.append('svg')
	// 		.attr('class', "abc")
	// 		.attr('x',function(d,i){
    //
	// 			return (i*100/total).toString()+"%"
	// 		})
	// 		.attr('y',"35%" )
	// 		.attr('width', "6%")
	// 		.attr('height',"60%")
	// var svg2=g1.append('g')
	// 		.attr('id',function(d,i){
	// 			num=i;
	// 			return "smallcourt"+i.toString()
	// 		} )
	// svg2.append('rect')
	// 	.attr('class',"fieldRect" )
	// 	.attr('x',"0%")
	// 	.attr('y',"0%" )
	// 	.attr('width',"100%")
	// 	.attr('height',"100%")
	// svg2.append("circle")
	// 	.attr('class',"fieldLines")
	// 	.attr('cy',"11%" )
	// 	.attr('cx',"50%" )
	// 	.attr('r',"12.5%" )
	// svg2.append('circle')
	// 	.attr('class',"fieldLines" )
	//     .attr('cx', "50%")
	//     .attr('cy', "89%")
	//     .attr('r', "12.5%")
	// svg2.append('rect')
	// 	.attr('class',"fieldLines" )
	//     .attr('x',"20%" )
	//     .attr('y', "0")
	//     .attr('width', "60%")
	//     .attr('height',"15%" )
	// svg2.append('rect')
	// 	.attr('class',"fieldLines" )
	//     .attr('x',"20%" )
	//     .attr('y', "85%")
	//     .attr('width', "60%")
	//     .attr('height',"15%" )
	// svg2.append('rect')
	// 	.attr('class',"fieldLines" )
	//     .attr('x',"37%" )
	//     .attr('y', "0")
	//     .attr('width', "26%")
	//     .attr('height',"5%" )
	// svg2.append('rect')
	// 	.attr('class',"fieldLines" )
	//     .attr('x',"37%" )
	//     .attr('y', "95%")
	//     .attr('width', "26%")
	//     .attr('height',"5%" )
	// svg2.append('line')
	// 	.attr('class',"Gate" )
	//     .attr('x1',"45%" )
	//     .attr('y1', "0")
	//     .attr('x2', "55%")
	//     .attr('y2', "0%")
	// svg2.append('line')
	// 	.attr('class',"Gate" )
	//     .attr('x1',"45%" )
	//     .attr('y1', "100%")
	//     .attr('x2', "55%")
	//     .attr('y2', "100%")
	// svg2.append("circle")
	// 	.attr('class',"Points")
	// 	.attr('cy',"11%" )
	// 	.attr('cx',"50%" )
	// 	.attr('r',"0.5%" )
	// svg2.append("circle")
	// 	.attr('class',"Points")
	// 	.attr('cy',"89%" )
	// 	.attr('cx',"50%" )
	// 	.attr('r',"0.5%" )
 	// svg2.append("circle")
	// 	.attr('class',"fieldLines")
	// 	.attr('cy',"50%" )
	// 	.attr('cx',"50%" )
	// 	.attr('r',"12.5%" )
	// svg2.append("circle")
	// 	.attr('class',"Points")
	// 	.attr('cy',"50%" )
	// 	.attr('cx',"50%" )
	// 	.attr('r',"0.5%" )
	// svg2.append('line')
	// 	.attr('class',"fieldLines" )
	//     .attr('x1',"0%" )
	//     .attr('y1', "50%")
	//     .attr('x2', "100%")
	//     .attr('y2', "50%")
	// add_node();
	// add_path();
	// add_path_gray();
    // X_proj();
    // Y_proj();
    //donut();
}
function timeline_transform(value) {
	if(value==0)
	{
		remove_small_court();
		draw_court();
		add_node();
	}
	else if(value==1) {
        remove_small_court();
        draw_court();
		add_node();
		add_path();
	}
	else if(value==2){
        remove_small_court();
        draw_court();
		add_node();
		add_path_gray();
	}
	else if(value==3){
        remove_small_court();
        draw_court();
		add_path_gray();
	}
	else if(value==4)
	{
        remove_small_court();
        draw_court();
		X_proj()
	}
	else if(value==5)
	{
        remove_small_court();
        draw_court();
        Y_proj();
	}

	else if(value==6)
	{
		remove_small_court();
		distance_align();
	}

	else if(value==7) donut();
}