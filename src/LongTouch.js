;(function(global,undefined){
  'use strict';
  function LongTouch(layer,options){
    var oldOnClick,
      setTimeout = global.setTimeout,
      setInterval = global.setInterval,
      clearTimeout = global.clearTimeout;

    options = options || {};


    this.layer = layer;
    this.trackingCLick = false;
    this.timeStartTouch = 0;
    this.longTouching = false;
    this.startTouchX = -1;
    this.startTouchY = -1;
    this.longtouchCaptureQ = [];
    this.longtouchPropagationQ = [];
    this.touchTimer = null;
    this.longTouchDelay = options.longTouchDelay || 1500;  //长按1.5秒的延时
    this.hijackEvent = options.hijackEvent || ['click','touchstart','touchend','mousedown','mouseup'];
    this.hijackEvent._some = function(type){
      return this.some(function(item){
        item === type;
      });
    };

    var context = this;
    ['onMouse','onClick','onTouchStart','onTouchEnd','onTouchMove','onTouchCancel'].forEach(function(eventType){
      context[eventType] = context[eventType].bind(context);
    });

    layer.addEventListener('mouseover',this.onMouse,true);
    layer.addEventListener('mousedown',this.onMouse,true);
    layer.addEventListener('mouseup',this.onMouse,true);
    layer.addEventListener('click',this.onClick,true);
    layer.addEventListener('touchstart',this.onTouchStart,true);
    layer.addEventListener('touchend',this.onTouchEnd,true);
    layer.addEventListener('touchmove',this.onTouchMove,true);
    layer.addEventListener('touchcancel',this.onTouchCancel,true);


    // add longTouch EventListner
    layer.addEventListener = function(type, callback, capture){
      var adde = Node.prototype.addEventListener;
      if(type === 'longtouch'){
        context[capture?'longtouchCaptureQ':'longtouchPropagationQ'].push({handler:callback});
      }else{
        adde.call(layer,type,callback,capture);
      }
    };
    layer.removeEventListener = function(type,callback,capture){
      var rmve = Node.prototype.removeEventListener;
      if(type === 'longtouch'){
        var arr=context[capture?'longtouchCaptureQ':'longtouchPropagationQ'];
        for(var i=0;i<arr.length;i++){
          if(arr[i].handler === callback){
            arr.splice(i,1);
            break;
          }
        }
      }else{
        rmve.call(layer,type,callback,capture);
      }
    };

    // hack a stopImmediatePropagation
    if(!Event.stopImmediatePropagation){
      var adde = layer.addEventListener,
        rmve = layer.removeEventListener;

      layer.addEventListener = function(type,func,capture){
        if(context.hijackEvent._some(type)){
          adde.call(layer,type,func.hijack || (func.hijack = function(event){
            if(!event.immediateStop){
              func(event);
            }
          }),capture);  
        }else{
          adde.call(layer,type,func,capture);
        }
      };

      layer.removeEventListener = function(type,func,capture){
        if(context.hijackEvent._some(type)){
          rmve.call(layer,type,func.hijack||func,capture);
        }else{
          rmve.call(layer,type,func,capture);
        }
      }
    }// if (Event.stopImmediatePropagation) end

  } //LongTouch Constructor end

  LongTouch.prototype.onMouse = function(event){

  };
  LongTouch.prototype.onClick = function(event){

  };
  LongTouch.prototype.onTouchStart = function(event){
    clearTimeout(this.touchTimer);
    this.timeStartTouch = event.timeStamp;
    if(event.touches.length > 1){   //多点触控的情况，不做处理
      return ;
    }
    var touch = event.targetTouches;

    this.startTouchX = touch.pageX;
    this.startTouchY = touch.pageY;

    this.touchTimer = setTimeout(this.handleLongTouch.bind(this,event),this.longTouchDelay);
  };
  LongTouch.prototype.onTouchMove = function(event){

  };
  LongTouch.prototype.onTouchEnd = function(event){
    this.longTouching = false;
    clearTimeout(this.touchTimer);
  };
  LongTouch.prototype.onTouchCancel = function(event){

  };
  function sendEvent(target,type) {

  }
  LongTouch.prototype.findElement = function(target){
    if(target.nodeType == 3){
      return target;
    }
    var p = target;
    while(p.nodeType!==3 && p!=this.layer){
      p = p.parentNode;
    }
    return p;
  };
  LongTouch.prototype.handleLongTouch = function(event){
    // 立即停止接下来的操作，包括接下来会触发的touchend\touchmove\click\mouseup等操作。
    if(event.stopImmediatePropagation){
      event.stopImmediatePropagation();
    }else{
      this.immediateStop = true;
    }

    this.longTouching = true;

    var q = this.longtouchCaptureQ.concat(this.longtouchPropagationQ);
    var target = this.findElement(event.target);
    for(var i=0;i<q.length;i++){
      q[i].handler.call(target,event);
    }
  };

  LongTouch.attach=function(layer,options){
    return new LongTouch(layer,options);
  };

  global.LongTouch = LongTouch;

})(window);


