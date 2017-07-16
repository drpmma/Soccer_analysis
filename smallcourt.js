function remove_node(num){
	var name="#g_point"+num.toString();
	d3.select(name).transition().duration(10).remove()
}
function add_node(data,num)
{
	var name="#smallcourt"+num.toString()
	var svg2=d3.select(name)
	var g_point=svg2.append("g")
					.attr('id',function(){
						return "g_point"+num.toString()
					} )
	g_point.selectAll("circle")
			.data(data)
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
function court(){
	var total=phase_0.length
	console.log(total)
	var svg=d3.select("#time_line").select("#timeline_svg")
	var g=svg.selectAll("g")
			.data(phase_0)
			.enter().append('g')
			.attr("id",function(d,i){
				return "g"
			})
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
				add_node(function(){
					return d.node
				},i)
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
				remove_path();
				path(i);
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
	var g1=g.append('svg')
			.attr('class', "abc")
			.attr('x',function(d,i){
				return (i*100/total).toString()+"%"
			})
			.attr('y',"35%" )
			.attr('width', "6%")
			.attr('height',"60%")
	var svg2=g1.append('g')
			.attr('id',function(d,i){
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
	var g_point=svg2.append("g")
					.attr('id',function(d,i){
						return "g_point"+i.toString()
					} )
	g_point.selectAll("circle")
			.data(function(d){
				return d.node
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