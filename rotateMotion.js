var velocity = 0;

var svgContainer2 = d3.select('#viz2').append("svg")
									   .attr('width','90%').attr('height',400);
svgContainer2.append('image')
			  .attr("xlink:href","earth.png")
			  .attr('width',200)
			  .attr('x',400)
			  .attr('y',100);

var slider2 = d3.sliderHorizontal()
				  .min(7)
				  .max(12)
				  .step(0.1)
				  .width(300)
				  .displayValue(true)
				  .on('end', val=> {
				  	velocity=val;
				  });
d3.select('#slider2').append("svg")
				    .attr('width','90%')
				    .attr('height',100)
				      .append('g')
				      	.attr('transform','translate(20,20)')
				      	.call(slider2);
var circle = svgContainer2.append('circle')
								.style('fill','rgb(221,121,96)')
								.attr('cx',500)
								.attr('cy',50)
	 							.attr('r',8);
var calculateR = function(miu, v) {
	if(v>11.2) {
		R = 200*v;
		return R
	}
	var r = 1500;
	var R = 1/(2/r-v*v/miu);
	console.log(R);
	return R/5;
}

var drawEllipse = function(v) {

	if(v>=7.9 && v<=11.2) {
		var miu = 398600;
		var a = calculateR(miu,v);
		svgContainer2.append('path')
				  .attr('d', ellipseToPath(500,200,a,150))
				  .attr('id','target')
				  .attr('class', 'orbit');
	}
	else if(v>11.2) {
		var x1 = 500, y1 = 50;
		var x2 = 800+100*(v-11), y2 = 300;
		var cpx = 800, cpy = 50;

		var path = d3.path();
		path.moveTo(x1,y1);
		path.quadraticCurveTo(cpx,cpy,x2,y2);
		svgContainer2.append('path')
						.attr('d', path.toString())
						.attr('id','target')
						.attr('class', 'orbit');
	}
	else {
		var x1 = 500, y1 = 50;
		var x2 = 600, y2 = 200;
		var cpx = 600, cpy = 40;

		var path = d3.path();
		path.moveTo(x1,y1);
		path.quadraticCurveTo(cpx,cpy,x2,y2);
		svgContainer2.append('path')
						.attr('d', path.toString())
						.attr('id','target')
						.attr('class','orbit');
	}
	// var circle = svgContainer2.append('circle')
	// 							.attr('r',10);									
	circle.transition()
			.duration(5000)
			.attrTween('transform',circlePosition);
	// svgContainer2.select('circle').remove();
}

var circlePosition = function() {
	var circlePath = document.getElementById('target');
	var l = circlePath.getTotalLength();
	return function(t) {
		var p = circlePath.getPointAtLength(t*l);
		var plx = p.x-500;
		var ply = p.y-50;
		return "translate("+plx+","+ply+")";
	}
}
var handleRotate = function() {
	console.log('click');
	var prevPath = document.getElementById('target');
	if (prevPath) {
		prevPath.removeAttribute('id');
	}
	drawEllipse(velocity);
}

var button2 = document.getElementById('rotate');
button2.addEventListener('click', handleRotate);

var ellipseToPath = function(cx, cy, rx,ry) {
	if (isNaN(cx - cy + rx - ry)) return;

   var path =
       'M' + cx + ' ' + (cy-ry) +
       'a' + rx + ' ' + ry + ' 0 0 1 ' + '0' +' '+ (2*ry) +
       'a' + rx + ' ' + ry + ' 0 1 1 ' + '0' +' '+ (-2*ry) +
       'z'; 
   return path;
}

