var svg=d3.select("#time_line")
			.append("svg")
			.attr("width","100%")
			.attr("height","100%");

var text_title=svg.append('text')
			.attr('x',"40%" )
			.attr('y',"9%" )
			.attr('fill',"black")
			.attr('font-size',"150%" )
			.attr('textLength',"150px" )
			.attr('text-align', "center")
			.attr('font-family',"Verdana" )
		text_title.html("Soccer stories")//title
var line1=svg.append('line')
		.attr('class',"timeline" )
		.attr('x1',"5%")
		.attr('y1',"15%")
		.attr('x2',"95%" )
		.attr('y2',"15%" )
var line2=svg.append('line')
		.attr('class',"timeline" )
		.attr('x1',"5%")
		.attr('y1',"24%")
		.attr('x2',"95%" )
		.attr('y2',"24%" )
var text1=svg.append('text')
		.attr("x","1%")
		.attr('y',"21%" )
		.attr('fill',"black" )
		.attr('font-size',"100%" )
	text1.html("timeline");
	//two lines of time
var line3=svg.append('line')
		.attr('class',"disline" )
		.attr('x1',"5%")
		.attr('y1',"15%")
		.attr('x2',"5%" )
		.attr('y2',"24%" )
var text_0=svg.append('text')
		.attr("x","5%")
		.attr('y',"30%" )
		.attr('fill',"red")
		.attr('font-size',"100%")
		text_0.html("0");
var line4=svg.append('line')
		.attr('class',"disline" )
		.attr('x1',"20%")
		.attr('y1',"15%")
		.attr('x2',"20%" )
		.attr('y2',"24%" )
var text_1=svg.append('text')
		.attr("x","19%")
		.attr('y',"30%" )
		.attr('fill',"red")
		.attr('font-size',"100%")
		.attr('text-align',"center" )
		text_1.html("15");
var line5=svg.append('line')
		.attr('class',"disline" )
		.attr('x1',"35%")
		.attr('y1',"15%")
		.attr('x2',"35%" )
		.attr('y2',"24%" )
var text_2=svg.append('text')
		.attr("x","34%")
		.attr('y',"30%" )
		.attr('fill',"red")
		.attr('font-size',"100%")
		.attr('text-align',"right" )
		text_2.html("30");
var line5=svg.append('line')
		.attr('class',"disline" )
		.attr('x1',"50%")
		.attr('y1',"15%")
		.attr('x2',"50%" )
		.attr('y2',"24%" )
var text_3=svg.append('text')
		.attr("x","49%")
		.attr('y',"30%" )
		.attr('fill',"red")
		.attr('font-size',"100%")
		text_3.html("45");
var line6=svg.append('line')
		.attr('class',"disline" )
		.attr('x1',"65%")
		.attr('y1',"15%")
		.attr('x2',"65%" )
		.attr('y2',"24%" )
var text_4=svg.append('text')
		.attr("x","64%")
		.attr('y',"30%" )
		.attr('fill',"red")
		.attr('font-size',"100%")
		.attr('text-align',"center" )
		text_4.html("60");
var line7=svg.append('line')
		.attr('class',"disline" )
		.attr('x1',"80%")
		.attr('y1',"15%")
		.attr('x2',"80%" )
		.attr('y2',"24%" )
var text_5=svg.append('text')
		.attr("x","79%")
		.attr('y',"30%" )
		.attr('fill',"red")
		.attr('font-size',"100%")
		.attr('text-align',"center" )
		text_5.html("75");
var line8=svg.append('line')
		.attr('class',"disline" )
		.attr('x1',"95%")
		.attr('y1',"15%")
		.attr('x2',"95%" )
		.attr('y2',"24%" )
var text_6=svg.append('text')
		.attr("x","94%")
		.attr('y',"30%" )
		.attr('fill',"red")
		.attr('font-size',"100%")
		.attr('text-align',"center" )
		text_6.html("90");
		//7 lines to distribute the time into six part
var cirlce1=svg.append('circle')
    .attr('cx', "15%")
    .attr('cy', "19.5%")
    .style('fill', '#f00')
    .attr('r',"0.8%" )
    .on('mousemove', function() {
    	d3.select(this)
    	.attr("r","1.5%")    	/* Act on the event */
    })
    .on('mouseout', function(){
		d3.select(this)
    	.attr("r","0.8%")
    	/* Act on the event */
    })
var cirlce2=svg.append('circle')
    .attr('cx', "31%")
    .attr('cy', "19.5%")
    .attr('r', "0.8%")
    .style('fill', '#0f0')
    .on('mousemove', function() {
    	d3.select(this)
    	.attr("r","1.5%")    	/* Act on the event */
    })
    .on('mouseout', function(){
		d3.select(this)
    	.attr("r","0.8%")
    	/* Act on the event */
    })
var cirlce3=svg.append('circle')
    .attr('cx', "55%")
    .attr('cy', "19.5%")
    .attr('r', "0.8%")
    .style('fill', '#0ff')
    .on('mousemove', function() {
    	d3.select(this)
    	.attr("r","1.5%")    	/* Act on the event */
    })
    .on('mouseout', function(){
		d3.select(this)
    	.attr("r","0.8%")
    	/* Act on the event */
    })
var cirlce4=svg.append('circle')
    .attr('cx', "69%")
    .attr('cy', "19.5%")
    .attr('r', "0.8%")
    .style('fill', '#0f0')
    .on('mousemove', function() {
    	d3.select(this)
    	.attr("r","1.5%")    	/* Act on the event */
    })
    .on('mouseout', function(){
		d3.select(this)
    	.attr("r","0.8%")
    	/* Act on the event */
    })
var cirlce5=svg.append('circle')
    .attr('cx', "81%")
    .attr('cy', "19.5%")
    .attr('r', "0.8%")
    .style('fill', '#00f')
    .on('mousemove', function() {
    	d3.select(this)
    	.attr("r","1.5%")    	/* Act on the event */
    })
    .on('mouseout', function(){
		d3.select(this)
    	.attr("r","0.8%")
    	/* Act on the event */
    })
var cirlce6=svg.append('circle')
    .attr('cx', "93%")
    .attr('cy', "19.5%")
    .attr('r', "0.8%")
    .style('fill', '#ff0')//six circle
    .on('mousemove', function() {
    	d3.select(this)
    	.attr("r","1.5%")    	/* Act on the event */
    })
    .on('mouseout', function(){
		d3.select(this)
    	.attr("r","0.8%") 
    	/* Act on the event */
    })
function court(){
	for(var i=0;i<14;i++)
	{
		var g=svg.append('svg')
				.attr('class', "abc")
				.attr('x',(i*7).toString()+"%")
				.attr('y',"35%" )
				.attr('width', "6%")
				.attr('height',"60%")
		var svg2=g.append('g')
			.on('mouseenter', function() {
				d3.select(this)
					.append('rect')
					.attr('id',"selected")
					.attr('x',"0%")
					.attr('y',"0%" )
					.attr('width',"100%")
					.attr('height',"100%")
					.style('fill', 'gray')
					.style('fill-opacity', '0.5')
				/* Act on the event */
			})
			.on('mouseleave', function() {
				d3.select(this).select("#selected").remove()
				/* Act on the event */
			})
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
court();