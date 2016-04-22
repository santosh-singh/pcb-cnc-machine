import util from 'util';
import EventEmitter from 'events';

function Simulator(){
    EventEmitter.call(this);
    var lastZ = 15;
}
util.inherits(Simulator, EventEmitter);
Simulator.prototype.open = function(callback){
    this.emit('open');
    this.lastZ = 15;
    callback();
}
Simulator.prototype.isOpen = function(){
    return true;
}
Simulator.prototype.close = function(callback){
    this.removeAllListeners();
    callback();
}
Simulator.prototype.endstop = function(){
  this.lastZ += 0.01;
  this.emit('data', 'echo:endstops hit:  Z:'+Number(this.lastZ).toFixed(4))
  this.emit('data', "ok");
}
Simulator.prototype.getposition = function(){
  this.emit('data', 'X:10.0000 Y:10.0000 Z:15.0000');
  this.emit('data', "ok");
}
Simulator.prototype.ok = function(){
  this.emit('data', "ok");
}
Simulator.prototype.write = function(data, callback, isZero){
    if (data.charAt(data.length - 1) == '\n') {
      data = data.substr(0, data.length - 1);
    }
    if (isZero){
      setTimeout(this.endstop.bind(this), 500);
    }else if(data == "M114"){
      setTimeout(this.getposition.bind(this), 1);
    }else{
      // this.emit('data', data)
      setTimeout(this.ok.bind(this), 1);
    }
    callback();
}
Simulator.prototype.drain = function(callback){
    callback();
}
export const simulator = new Simulator();
