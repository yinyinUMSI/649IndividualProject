var planetInfo= {'mars': [42828,3.5,5.0], 'jupiter':[126686534,42.1,59.5], 'earth':[398600,7.9,11.2]};
function planetOrbit(name, selection) {
	this.planetName = name;
	this.velocity = 0
	this.selection = selection;
	this.createPlanet = function() {
		this.selection.append('image')
					.attr("xlink:href",this.planetName+".png")
					.attr('x',400)
			  		.attr('y',100)
					.attr('width',200);
		this.selection.append('circle')
					.attr('r',8)
					.style('fill','rgb(221,121,96)')
					.attr('id',('circle'+this.planetName))
					.attr('cx',500)
					.attr('cy', 50);
		var slider = d3.sliderHorizontal()
				  .min(planetInfo[this.planetName][1])
				  .max(planetInfo[this.planetName][2])
				  .step((planetInfo[this.planetName][2]-planetInfo[this.planetName][1])/20)
				  .width(300)
				  .displayValue(true)
				  .on('end', val=> {
				  	this.velocity=val;
				  	console.log(this.velocity);
				  });
		d3.select('#slider'+this.planetName).append('svg')
												.attr('height',100)
				      							.attr('width',400)
				      							.append('g')
				      							.attr('transform','translate(20,20)')
				      							.call(slider);
	}
	this.orbitStart = function(v) {
		var id = 'target'+this.planetName;
		var prevPath = document.getElementById(id);
		if (prevPath) {
			prevPath.removeAttribute('id');
		}
		var v1 = planetInfo[this.planetName][1];
		var v2 = planetInfo[this.planetName][2];
		var miu = planetInfo[this.planetName][0];
		var T;
		if(v<=v2 && v>=v1) {
			var a = calculateR(miu,v);

			T = 6*Math.sqrt(Math.pow(a,3)/miu);
			if (this.planetName == 'jupiter') {
				a = a/40;
				T = T/5;
			}
			
			this.selection.append('path')
				  .attr('d', ellipseToPath(500,200,a,150))
				  .attr('id',id)
				  .attr('class', 'orbit');
		}
		else if (v>=v2) {
			var x1 = 500, y1 = 50;
			var x2 = 800+100*(v-11), y2 = 300;
			var cpx = 800, cpy = 50;

			var path = d3.path();
			path.moveTo(x1,y1);
			path.quadraticCurveTo(cpx,cpy,x2,y2);
			this.selection.append('path')
							.attr('d', path.toString())
							.attr('id',id)
							.attr('class', 'orbit');
		}
		else {
			var x1 = 500, y1 = 50;
			var x2 = 600, y2 = 200;
			var cpx = 600, cpy = 40;

			var path = d3.path();
			path.moveTo(x1,y1);
			path.quadraticCurveTo(cpx,cpy,x2,y2);
			this.selection.append('path')
							.attr('d', path.toString())
							.attr('id',id)
							.attr('class','orbit');
		}
		var name = '#circle'+this.planetName;
		var circle = d3.select(name);
		console.log(T);
		circle.transition()
			.duration(100*T)
			.attrTween('transform',(e)=>circlePosition(this.planetName));
	}
	this.orbitStart = this.orbitStart.bind(this);
}

var circlePosition = function(name) {
	console.log(name);
	var circlePath = document.getElementById('target'+name);
	var l = circlePath.getTotalLength();
	return function(t) {
		var p = circlePath.getPointAtLength(t*l);
		var plx = p.x-500;
		var ply = p.y-50;
		return "translate("+plx+","+ply+")";
	}
}
var selection = d3.select('#viz3-1').append('svg').attr('width','90%').attr('height',420);
var marsOrbit = new planetOrbit('mars', selection);
marsOrbit.createPlanet();

var selection = d3.select('#viz3-2').append('svg').attr('width','90%').attr('height',420);
var jupiterOrbit = new planetOrbit('jupiter', selection);
jupiterOrbit.createPlanet();

var selection = d3.select('#viz3-3').append('svg').attr('width','90%').attr('height',420);
var earthOrbit = new planetOrbit('earth', selection);
earthOrbit.createPlanet();

var startButton = document.getElementById('compareStart')
startButton.addEventListener('click',(e) => marsOrbit.orbitStart(marsOrbit.velocity));
startButton.addEventListener('click',(e) => jupiterOrbit.orbitStart(jupiterOrbit.velocity));
startButton.addEventListener('click',(e) => earthOrbit.orbitStart(earthOrbit.velocity));