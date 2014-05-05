
function log(x){
	if (console && console.log) {
		console.log(x);
	}
}

$(window).load(function(){
	// RPG
	// Main Unit do actions with any game units
	var GameInstance = null;
	function Game(){
		var instance = 111;
		//return instance;
		var units = [];
		var mainUnit = 0;
		var selectedId = -1;
		var hoveredId = -1;
		var canvas = null;
		var ctx2d;
		var bg = '#efefef';
		var width = 600;
		var height = 300;
		var curTime = 0;
		var lastTime = 0;
		var startPauseTime = 0;
		var fps = 60; //1000 / 60;
		var pause = true;
		
		function renderUnits(){
			var id = units.length - 1;
			while(id >= 0){
				units[id].render();
				--id;
			}
		}
		
		function recalc(time){
			var id = units.length - 1;
			while(id >= 0){
				if (units[id].inAction) {
					units[id].actionStep(time);
				}
				--id;
			}
		}
		
		function render(){
			ctx2d.fillStyle = bg;
			ctx2d.fillRect(0, 0, width, height);
			renderUnits();
		}
		
		function loop(){
			curTime = (new Date).getTime();
			var loopTime =  curTime - lastTime;
			//log(loopTime);
			recalc(loopTime);
			render();
			lastTime = curTime;
		   
		}
		
		function iteration(){
			if (pause) {
				return;
			}
			loop();
			setTimeout(function(){iteration();}, 1000/fps);
		}
		
		function startAnimation(){
			if (!pause) {
				return;
			}
			pause = false;
			var time = (new Date).getTime();
			lastTime = (time - startPauseTime) + lastTime;
			curTime = time;
			setTimeout(function(){iteration();}, 1000/fps);
		}
		
		function stopAnimation(){
			if (pause) {
				return;
			}
			pause = true;
			startPauseTime = (new Date).getTime();
		}
		
		// [x,y]
		function checkCursor(point){
			var id = units.length - 1;
			while(id >= 0){
				if (id != mainUnit) {
					var pos = units[id].position;
					//log(units[id])
					var halfsize = units[id].size / 2;
					if(pointInRect(point, pos[0]-halfsize, pos[1]-halfsize, pos[0]+halfsize, pos[1]+halfsize)){
						return id;
					}
				}
				--id;
			}
			return -1;
		}
		
		function initContent(){
			canvas = $('canvas#game')[0];
			ctx2d = canvas.getContext("2d");
			$(canvas).attr({'width': width+'px', 'height': height+'px', });
			units.push( MainUnit({position:[100, 150], speed: 70, size:32, color: 'rgb(255,0,0)',
							  mainUnit: true}) );
			units.push(  MovableUnit({position:[150, 160], speed: 20, size:32, color: '#ff8800'}) );
			units.push(  MovableUnit({position:[200, 170], speed: 30, size:32, color: '#ff8888'}) );
			units.push(  MovableUnit({position:[250, 180], speed: 50, size:32, color: '#ff0088'}) );
			units.push(  SourceUnit({position:[350, 200], speed: 0, size:8, color: '#ff0088'}) );
			units.push(  SceneUnit({position:[400, 200], speed: 0, size:20, color: '#000088'}) );
			renderUnits();
		}
		
		function selectUnit(selected){
			unselectUnit();
			selectedId = selected;
			units[selected].select();
		}
		
		function unselectUnit(){
			if (selectedId > -1)
				units[selectedId].unselect();
			selectedId = -1;
		}
		
		function initEvents(){
			
			function lClick(point, modeKeys){
				if (modeKeys.none) {
					var selected = checkCursor(point);
					log(selected);
					if (selected != -1) {
						selectUnit(selected);
					} else {
						if (selectedId != -1) {
							unselectUnit();
						} else {
						}
						units[mainUnit].moveTo(point);
					}
				}
				
			}
			
			function rClick(point, alterButoon){
				
			}
			
			function mClick(point, alterButoon){
				
			}
			
			var lastUserEvent = null;
			$(canvas).click(function(e){
				0 && log( 'butt = ' + (e.button) +
					'; alt = ' + (e.altKey ? 'yes' : 'no') +
					'; ctrl = ' + (e.ctrlKey ? 'yes' : 'no') );
				lastUserEvent = e;
				var point = [e.offsetX,  e.offsetY];
				// e.button = 0 - L, 1 - M, 2 - R
				var ctrl = e.ctrlKey;
				var alt = e.altKey;
				var keys = {ctrl : ctrl, alt: alt, none: !(alt | ctrl)};
				log(keys)
				switch(e.button){
					case 0 : lClick(point, keys); break; // Left
					case 1 : mClick(point, keys); break; // Middle
					case 2 : rClick(point, keys); break; // Right
				}
				//render();
			});
			
			$(canvas).mousemove(function(e){
				//log(123);
				//return;
				lastUserEvent = e;
				var point = [e.offsetX,  e.offsetY];
				//log(point);
				var hover = checkCursor(point);
				if (hover > -1) {
					hoveredId = hover;
					units[hover].mHover();
				} else {
					if (hoveredId > -1) {
						units[hoveredId].mOut();
						hoveredId = -1;
					}
				}
				
			});
			
			$('button#start').click(function(){ startAnimation(); });
			$('button#pause').click(function(){ stopAnimation(); });
		}
		
		function initGameLoop(){
			 startAnimation();
		}
		
		
		return {
			init: function(){
				initContent();
				initEvents();
				initGameLoop();
				render();
			},
			get canvas(){ return canvas; },
			get context(){ return ctx2d; },
			get time(){ return curTime; }
		};
	}
	
	var progm = Game.prototype;
	//progm.canvas = $('canvas#game')[0];
	
	/**
	 * params - [x,y], [x1,y1,x2,y2]
	 */
	function pointInRect (point, x1 ,y1, x2, y2){
		//return (point[0] > rect[0] && point[0] < rect[2] && poin[1] > rect[1] && point[1] < rect[3]);
		return (point[0] > x1 && point[0] < x2 && point[1] > y1 && point[1] < y2);
	}
	
	function makeHColor(color){
		var rgb;
			// rgb(r,g,b)
		if(/rgb\((?:\d+\,?\s*){3}\)/i.test(color)){
			log('color tested');
			rgb = color.match(/\((\d+),(\d+),(\d+)\)/);
			rgb.shift();
			log(rgb.toString());
			$.each(rgb, function(i, val){ rgb[i] = Math.round(val + 50); rgb[i] = rgb[i] > 255 ? 255 : rgb[i]; });
			
			// #rrggbb
		} else if (/#[0-9a-f]{6}/.test(color)) {
			rgb = color.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/);
			rgb.shift();
			log(rgb.toString());
			$.each(rgb, function(i, val){
				rgb[i] = Math.round(parseInt('0x' + val) + 50);
				rgb[i] = rgb[i] > 255 ? 255 : rgb[i];
			});
		} else {
			rgb = [225,125,225];
		}
		hcolor = 'rgb(' + rgb[0] + ','+ rgb[1] + ','+ rgb[2] + ')';
		log('sceneUnit hcolor = ' + hcolor);
		return hcolor;
	}
	
	function SceneUnit(params){
				log('unit');
		if (!params) {
			params = {position:[], speed: 10, color: '#808080', size: 32};
		}
		var pos = params.position;
		var size = params.size;
		var hsize = size / 2;
		var ctx = GameInstance.context;
		var selected = false;
		var inAction = false;
		var action = null; // {start(), stop(), end()}
		var actions = ['move'];
		var speed = params.speed; // px per sec
		params.color = params.color.replace(/\s+/, '');
		var color = params.color;
		var hcolor = makeHColor(color);
		var hovered = false;
		var renderer = function(){
			var actualColor = hovered ? hcolor : color;
			fillRect(pos[0]-hsize, pos[1]-hsize, size, size, actualColor);
			if (selected) {
				
				strokeRect(pos[0]-hsize-2, pos[1]-hsize-2, size+4, size+4, '#ee8800');
			}
		}
		
		// RENDER
		var renderData = {pos:pos, size:size, color:color, hcolor:hcolor, hovered:hovered, selected:selected, ctx: ctx};
		
		function render(){
			renderer(renderData);
		}
		
		return {
			set position(newpos){ pos = newpos; },
			set action(newAction) {
				action = newAction;
				inAction = true;
			},
			set renderer(cur){renderer = cur},
			
			get position(){ return pos; },
			get size(){return size; },
			get inAction(){ return inAction; },
			get mainUnit(){ return params.mainUnit; },
			
			render: function(){ render(); },
			select: function(){ selected = true; log('SU- select'); },
			unselect: function(){ selected = false; },
			mHover: function(){ hovered = true; },
			mOut: function(){ hovered = false; },
			actionStart: function(data){ action.start(data); },
			actionStop: function(){
				log('stop action');
				inAction = false;
				action = null;
			},
			actionStep: function(timeDiff){
				action.step(timeDiff);
			}
		};
	}
	
	function MovableUnit(params) {
		var sup = SceneUnit(params);
		// Move Unit
		//var pos = sup.position;
		var speed = params.speed;
		
		var move = {
			startTime:0,
			startPoint: sup.position,
			endPoint: sup.position,
			stepVal:{x:0,y:0, d:0},
			remainingDist:0,
			
			start: function(point){
				var x = point[0];
				var y = point[1];
				var pos = sup.position;
				this.endPoint = [x,y];
				var dx = x - pos[0];
				var dy = y -  pos[1];
				var posDiff = [dx, dy];
				var distance = Math.sqrt(dx*dx + dy*dy);
				this.remainingDist = distance;
				var sin = dy / distance;
				var cos = dx / distance;
				var distPerTime = params.speed / 1000; // px per ms
				//log({sin:sin, cos:cos})
				// per ms
				this.stepVal = {
					x: distPerTime * cos,
					y: distPerTime * sin,
					d: distPerTime
				};
				//log(this.stepVal)
				
			},
			step: function(time){
				//log('step')
				var pos = sup.position;
				pos[0] += this.stepVal.x * time;
				pos[1] += this.stepVal.y * time;
				this.remainingDist -= this.stepVal.d * time;
				// $('div#test').html('remainingDist = ' + this.remainingDist);
				if (this.remainingDist <= 0) {
					this.end();
				}
			},
			end: function(){
				sup.actionStop();
			} 
		};
		
		sup.moveTo = function(point){
			this.action = move;
			this.actionStart(point);
		};
		
		return sup;
	}
	
	function MainUnit(params){
		params['mainUnit'] = true;
		var sup = MovableUnit(params);
		var haloRadius = params.size / 2 + 2;
		
		function renderMain(info){
			//log('renderMain')
			//log(info)
			var actualColor = info.color; info.hovered ? info.hcolor : info.color;
			fillPolygon(info.pos, info.size/2, 8, actualColor);
			strokeCircle(info.pos, haloRadius, '#ff9000');
		}
		
		sup.renderer = renderMain;
		
		return sup;
		
	}

	
	function SourceUnit(params){
		
		var ctx = GameInstance.context;
		var hovered = false;
		
		var sup = SceneUnit(params);
		
		sup.render = function(){
			ctx.fillStyle = hovered ? '#44ff44' : '#88ff88';
			ctx.fillRect(params.position[0]-4, params.position[1]-4, 8, 8);
		};
		sup.select = function(){};
		sup.unselect = function(){};
		//sup.moveTo = function(){};
		sup.mHover = function(){ hovered = true; };
		sup.mOut = function(){ hovered = false; };
		
		
		return sup;
	}
	
	// RENDER SHAPES
	/**
	 *  center, radius, number, color
	 */
	function strokePolygon(center, radius, num, color){
		var ctx = GameInstance.context;
		polygonPath(ctx, center, radius, num);
		ctx.strokeStyle = color;
		ctx.stroke();
	}
	
	function fillPolygon(center, radius, num, color){
		var ctx = GameInstance.context;
		polygonPath(ctx, center, radius, num);
		ctx.fillStyle = color;
		ctx.fill();
	}
	
	function polygonPath(ctx, center, radius, num){
		var pi2 = 2 * Math.PI;
		var angleDiff = pi2 / num;
		var x = center[0];
		var y = center[1];
		ctx.beginPath();
		var angle = 0;
		ctx.moveTo(x + Math.cos(angle) * radius, y + Math.sin(angle));
		for(var i = 1; i< num; ++i){
			ctx.lineTo(x + Math.cos(angleDiff * i) * radius, y + Math.sin(angleDiff * i) * radius);
		}
		ctx.closePath();
	}
	
	function fillRect(x ,y, w, h, color){
		var ctx = GameInstance.context;
		ctx.fillStyle = color;
		ctx.fillRect(x,y,w,h);
	}
	
	function strokeRect(x ,y, w, h, color){
		var ctx = GameInstance.context;
		ctx.strokeStyle = color;
		ctx.strokeRect(x ,y, w, h);
	}
	
	function strokeCircle(center, radius, color){
		var ctx = GameInstance.context;
		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI, false);
		ctx.stroke();
	}
	
	function fillCircle(center, radius, color){
		var ctx = GameInstance.context;
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI, false);
		ctx.fill();
	}
	
	
	//var proun = Unit.prototype;

	GameInstance = Game();
	GameInstance.init();
});
