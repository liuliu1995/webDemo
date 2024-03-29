(function() {
	window.Particle = function(container, params) {
		params = params || {};
		var options = {
			point: 300,
			minDis: 100,
			mouseDis: 200,
			effect: 'zoom'
		};
		var originParams = {};
		for(var param in params) {
			if(typeof params[param] === 'object') {
				originParams[param] = {};
				for(var defPa in params[param]) {
					originParams[param][defPa] = params[param][defPa];
				};
			} else {
				originParams[param] = params[param];
			};
		};
		for(var opt in options) {
			if(typeof params[opt] === 'object') {
				for(var depOpt in options[opt]) {
					if(typeof params[opt][depOpt] === 'undefined') {
						params[opt][depOpt] = options[opt][depOpt];
					};
				};
			} else if(typeof params[opt] === 'undefined') {
				params[opt] = options[opt];
			};
		};
		var p = this;
		p.originParams = originParams;
		p.params = params;
		p.innerWidth = window.innerWidth;
		p.innerHeight = window.innerHeight;
		p.points = [];
		p.pageXY = {pageX:p.innerWidth/2,pageY:p.innerHeight/2};
		if(container[0] === '#') {
			p.container = container.split('#')[1];
		};
		p.canvas = document.getElementById(p.container);
		
		p.ctx = p.canvas.getContext('2d');
		p.init = function() {
			p.canvas.width = p.innerWidth;
			p.canvas.height = p.innerHeight;
			p.drawBackground();
			p.addOverlap();
			p.initDrawPoint();
			p.animation();
			p.mouseEvent();
			p.windowResize();
		};
		p.addOverlap=function(){
			p.overlap=document.createElement('div');
			p.overlap.style.width=p.innerWidth+'px';
			p.overlap.style.height=p.innerHeight+'px';
			p.overlap.style.position='absolute';
			p.overlap.style.top='0px';
			p.overlap.style.left='0px';
			p.overlap.style.zIndex='100';
			if(p.canvas.nextElementSibling){
				p.canvas.parentNode.insertBefore(p.overlap,p.canvas.nextElementSibling);
			}else{
				p.canvas.parentNode.appendChild(p.overlap);
			};
		};
		p.color = function() {
			function random() {
				return Math.round(Math.random() * 255);
			};
			this.r = random();
			this.g = random();
			this.b = random();
			this.a = random(1, 0.8);
			this.rgba = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
			return this;
		};
		p.random = function(max, min) {
			var min = arguments[1] || 0;
			return Math.floor(Math.random() * (max - min + 1) + min);
		};
		p.drawBackground = function() {
			if(!p.canvas) return;
			p.ctx.fillStyle = '#000';
			p.ctx.fillRect(0, 0, p.innerWidth, p.innerHeight);
		};
		p.point = function() {
			this.color = new p.color();
			this.x = Math.random() * p.innerWidth;
			this.y = Math.random() * p.innerHeight;
			this.xv = p.random(10, -10) / 40;
			this.yv = p.random(10, -10) / 40;
			this.r = p.random(3, 1);
			this.scale = 1;
		};
		p.initDrawPoint = function() {
			for(var i = 0; i < p.params.point; i++) {
				var point = new p.point();
				p.points.push(point);
				p.ctx.beginPath();
				p.ctx.fillStyle = point.color.rgba;
				p.ctx.arc(point.x, point.y, point.r * point.scale, 0, Math.PI * 2, true);
				p.ctx.fill();
			};
			p.ctx.closePath();
		};
		p.connect = function() {
			function lineColor(p1, p2) {
				var linear = p.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
				linear.addColorStop(0, p1.color.rgba);
				linear.addColorStop(1, p2.color.rgba);
				return linear;
			};
			for(var i = 0; i < p.params.point; i++) {
				for(var j = 0; j < p.params.point; j++) {
					var p1 = p.points[i];
					var p2 = p.points[j];
					if(Math.abs(p2.x - p1.x) < p.params.minDis && Math.abs(p2.y - p1.y) < p.params.minDis) {

						p.ctx.beginPath();
						p.ctx.lineWidth = 0.2;
						p.ctx.strokeStyle = lineColor(p1, p2);
						p.ctx.moveTo(p1.x, p1.y);
						p.ctx.lineTo(p2.x, p2.y);
						p.ctx.stroke();
						p.ctx.closePath();
					};
				};
			};
		};
		p.lineto = function() {
			function isInView(point) {
				return Math.abs(point.x - p.pageXY.pageX) < p.params.mouseDis && Math.abs(point.y - p.pageXY.pageY) < p.params.mouseDis;
			};
			(function line() {
				function lineColor(p1, p2) {
					var linear = p.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
					linear.addColorStop(0, p1.color.rgba);
					linear.addColorStop(1, p2.color.rgba);
					return linear;
				};
				for(var i = 0; i < p.params.point; i++) {
					for(var j = 0; j < p.params.point; j++) {
						if(i != j) {
							var p1 = p.points[i];
							var p2 = p.points[j];
							if(isInView(p1) && isInView(p2)) {
								if(Math.abs(p2.x - p1.x) < p.params.minDis && Math.abs(p2.y - p1.y) < p.params.minDis) {
									p.ctx.beginPath();
									p.ctx.lineWidth = 0.2;
									p.ctx.strokeStyle = lineColor(p1, p2);
									p.ctx.moveTo(p1.x, p1.y);
									p.ctx.lineTo(p2.x, p2.y);
									p.ctx.stroke();
									p.ctx.closePath();
								};
							};
						};
					};
				};
			})();
		};
		p.animation = function() {
			p.ctx.clearRect(0, 0, p.innerWidth, p.innerHeight);
			p.drawBackground();
			for(var i = 0; i < p.params.point; i++) {
				var point = p.points[i];
				if(point.x < 0 || point.x > p.innerWidth) {
					point.xv = -point.xv;
				};
				if(point.y < 0 || point.y > p.innerHeight) {
					point.yv = -point.yv;
				};
				p.ctx.beginPath();
				p.ctx.fillStyle = point.color.rgba;
				point.x += point.xv;
				point.y += point.yv;
				p.ctx.arc(point.x, point.y, point.r * point.scale, 0, Math.PI * 2, true);
				p.ctx.fill();
			};
			if(p.params.effect == 'zoom') {
				p.connect();
			} else if(p.params.effect == 'line') {
				p.lineto();
			};
			requestAnimationFrame(p.animation);
		};
		p.mouseEvent = function() {
			p.overlap.addEventListener('mousemove', function(e) {
				var e = e || window.event;
				var pageX = (e.clientX + document.body.scrollLeft || e.pageX) - this.offsetLeft;
				var pageY = (e.clientY + document.body.scrollTop || e.pageY) - this.offsetTop;
				if(p.params.effect == 'zoom'){
					for(var t = 0; t < p.params.point; t++) {
						var point = p.points[t];
						if(Math.abs(point.x - p.pageXY.pageX) < p.params.minDis && Math.abs(point.y - p.pageXY.pageY) < p.params.minDis) {
							point.scale = 5;
						} else {
							point.scale = 1;
						};
					};
				};
				p.pageXY.pageX = pageX;
				p.pageXY.pageY = pageY;
			});
			p.overlap.addEventListener('mouseout', function(e) {
				if(p.params.effect == 'zoom'){
					for(var i = 0; i < p.params.point; i++) {
						var point = p.points[i];
						if(point.scale != 1) {
							point.scale = 1;
						};
					};
				}else{
					p.pageXY.pageX=p.innerWidth/2;
					p.pageXY.pageY=p.innerHeight/2;
				};
			});
		};
		p.windowResize = function() {
			window.addEventListener('resize', p.init);
		};
		p.init();
		return p;
	};
	window.requestAnimationFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();
})();