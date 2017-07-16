var svg=d3.select("#time_line")
			.append("svg")
			.attr('id',"timeline_svg" )
			.attr("width","100%")
			.attr("height","100%");

var text_title=svg.append('text')
			.attr('x',"35%" )
			.attr('y',"9%" )
			.attr('fill',"black")
			.attr('font-size',"150%" )
			.attr('textLength',"30%" )
			.attr('text-align', "center")
			.attr('font-family',"黑体" )
		text_title.html("足球可视化系统")//title
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
		.attr("x","0.5%")
		.attr('y',"21%" )
		.attr('fill',"black" )
		.attr('font-size',"100%" )
		.attr('textLength', '3%');
	text1.html("时间轴");
	//two lines of time
function distribute(){
	for(var i=0;i<7;i++)
	{
		svg.append('line')
				.attr('class',"disline" )
				.attr('x1',(5+i*15).toString()+"%")
				.attr('y1',"15%")
				.attr('x2',(5+i*15).toString()+"%" )
				.attr('y2',"24%" );
			svg.append('text')
				.attr("x",(5+i*15).toString()+"%")
				.attr('y',"30%" )
				.attr('fill',"black")
				.attr('font-size',"100%")
				.attr('text-align',"center" )
				.html(i*15);		
			}
}
distribute();
