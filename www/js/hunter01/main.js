
function log(x){
    if (console && console.log) {
        console.log(x);
    }
}

$(window).load(function(){
    var GameInstance = null;
    function Game(){
        var instance = 111;
        //return instance;
        var units = [];
        var personId = 0;
        var selectedId = -1;
        var canvas = null;
        var ctx2d;
        var bg = '#efefef';
        var width = 600;
        var height = 300;
        var curTime = 0;
        var lastTime = 0;
        var fps = 1000 / 60;
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
            pause = false;
            curTime =(new Date).getTime();
            setTimeout(function(){iteration();}, 1000/fps);
        }
        
        function stopAnimation(){
            pause = true;
        }
        
        // [x,y]
        function checkCursor(point){
            var id = units.length - 1;
            while(id >= 0){
                var pos = units[id].position;
                //log(units[id])
                var halfsize = units[id].size / 2;
                if(pointInRect(point, pos[0]-halfsize, pos[1]-halfsize, pos[0]+halfsize, pos[1]+halfsize)){
                    return id;
                }
                --id;
            }
            return -1;
        }
        
        function initContent(){
            canvas = $('canvas#game')[0];
            ctx2d = canvas.getContext("2d");
            $(canvas).attr({'width': width+'px', 'height': height+'px', });
            units.push( new Unit({position:[100, 150], speed: 10, color: '#ff0000'}) );
            units.push( new Unit({position:[150, 160], speed: 20, color: '#ff8800'}) );
            units.push( new Unit({position:[200, 170], speed: 30, color: '#ff8888'}) );
            units.push( new Unit({position:[250, 180], speed: 50, color: '#ff0088'}) );
            renderUnits();
        }
        
        function initEvents(){
            $(canvas).click(function(e){
                //log(e);
                var point = [e.offsetX,  e.offsetY];
                log(point);
                var selected = checkCursor(point);
                    log(selected);
                if (selected != -1) {
                    if (selectedId > -1)
                        units[selectedId].unselect();
                    selectedId = selected;
                    units[selected].select();
                } else {
                    if (selectedId != -1) {
                        units[selectedId].moveTo(point);
                        //startAnimation();
                    }
                }
                render();
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
    
    function Unit(params){
        log('unit');
        if (!params) {
            params = {position:[], speed: 10, color: '#808080'};
        }
        var pos = params.position;
        var size = 32;
        var hsize = size / 2;
        var ctx = GameInstance.context;
        var selected = false;
        var inAction = false;
        var action = null;
        var actions = ['move'];
        var speed = params.speed; // px per sec
        var color = params.color;
        
        function startMove(x,y){
            // start moving
        }
        
        // deltaTime - time from last step
        function moveStep(deltaTime){
            
        }
        
        function endMove(){}
        
        var move = {
            startTime:0,
            startPoint:pos,
            endPoint: pos,
            stepVal:{x:0,y:0, d:0},
            remainingDist:0,
            
            start: function(point){
                var x = point[0];
                var y = point[1];
                this.endPoint = [x,y];
                var dx = x - pos[0];
                var dy = y -  pos[1];
                var posDiff = [dx, dy];
                var distance = Math.sqrt(dx*dx + dy*dy);
                this.remainingDist = distance;
                var sin = dy / distance;
                var cos = dx / distance;
                var distPerTime = speed / 1000; // px per ms
                log({sin:sin, cos:cos})
                // per ms
                this.stepVal = {
                    x: distPerTime * cos,
                    y: distPerTime * sin,
                    d: distPerTime
                };
                log(this.stepVal)
                
            },
            step: function(time){
                log('step')
                pos[0] += this.stepVal.x * time;
                pos[1] += this.stepVal.y * time;
                this.remainingDist -= this.stepVal.d * time;
                // $('div#test').html('remainingDist = ' + this.remainingDist);
                if (this.remainingDist <= 0) {
                    this.end();
                }
            },
            end: function(){
                inAction = false;
            } 
        };
        
        function render(){
            ctx.fillStyle = selected ? "#0088ff" : color;
            ctx.fillRect(pos[0]-hsize, pos[1]-hsize, size, size);
        }
        
        
        return {
            render: function(){
                render();
            },
            set position(newpos){ pos = newpos; },
            get position(){ return pos; },
            get size(){return size; },
            get inAction(){ return inAction; },
            
            select: function(){ selected = true; },
            unselect: function(){ selected = false; },
            moveTo: function(point){
                action = move;
                inAction = true;
                action.start(point);
            },
            actionStep: function(timeDiff){
                action.step(timeDiff);
            }
        };
    }
    //var proun = Unit.prototype;

    GameInstance = new Game();
    GameInstance.init();
});
