var svgContainer = d3.select('#viz1').append("svg")
									   .attr('width','100%')
									   .attr('height',420);
var velocity = 0;
var g = 10;
var record=[];
var curveCollect = [];
var obj = svgContainer.append('circle')
					    .attr('cx',20).attr('cy',20).attr('r',10)
					    .style('fill','rgb(221,121,96)')
					    .style('opacity',0.8);

var slider = d3.sliderHorizontal()
				  .min(0)
				  .max(100)
				  .step(5)
				  .width(300)
				  .displayValue(true)
				  .on('end', val=> {
				  	velocity=val;
				  });
d3.select('#slider1').append("svg")
				      .attr('height',100)
				      .attr('width',400)
				      .append('g')
				      	.attr('transform','translate(20,20)')
				      	.call(slider);

var handleStart = function() {
	document.getElementById('start').disabled = true;
	animation(velocity);
}
var button = document.getElementById('start');
button.addEventListener('click', handleStart);

var animation = function(v) {
	var xspeed = v;
	var yspeed = 0;
	var xloc = 20;
	var yloc = 20;
	var interval = 0.3;
	curveCollect.push([]);
	var timer = d3.timer(()=> {
		yspeed+= interval*g;
		xloc+=xspeed*interval;
		yloc+=yspeed*interval;
		d3.select('circle')
		.transition()
		.duration(100)
		.attr('cx',xloc)
		.attr('cy',yloc);
		curveCollect[curveCollect.length-1].push([xloc,yloc]);
		drawCurve();
	if (yloc>=380) {
		timer.stop();
		setHistory(xloc-20, v);
		setTimeout(restart, 2000);
		console.log(curveCollect);
	}
	},interval*1000);	
}

var restart = function() {
	console.log('restart');
	document.getElementById('start').disabled = false;
	d3.select('circle')
		.transition()
		.duration(100)
		.attr('cx',20)
		.attr('cy',20);
}
var setHistory = function(distance, velocity) {
	console.log('add history');
	console.log(record)
	record.push({
		'distance': distance,
		'velocity': velocity,
	});
	console.log(record);
}

var curveLine = d3.line()
				  .x(function(d) {return d[0]})
				  .y(function(d) {return d[1]})
				  
var drawCurve = function() {
	svgContainer.append('path')
				  .datum(curveCollect[curveCollect.length-1])
				  .attr('fill','None')
				  .attr('class','curve')
				  .attr('d', curveLine)
				  .on('mouseover', mouseover)
				  .on('mouseleave',mouseout)
				  .on('mousemove',mouseover);
}
svgContainer.append('g')
			.attr('transform', 'translate(0,386)')
			.call(d3.axisBottom(d3.scaleLinear().domain([0,100]).range([20, 860])))
var tooltip = d3.select('#viz1').append('div')
						  .attr('class','tooltip')
// curveLine(curveCollect[curveCollect.length-1]);
// svgContainer.append('path')

var mouseover = function(d) {
	console.log('mousein');
	tooltip.html("<div class='tooltipText'>distance:"+d[d.length-1][0]+'</br>'+ ' velocity:'+velocity+'</div>')
		   .style('left',(d3.mouse(this)[0]+180)+'px')
		   .style('top',(d3.mouse(this)[1]+180)+'px')
		   .transition()
		   .duration(0)
		   .style('opacity',0.9);		   
}

var mouseout = function(d) {
	console.log('mouseout');
	tooltip.transition()
		   .duration(1000)
		   .style('opacity',0);
}