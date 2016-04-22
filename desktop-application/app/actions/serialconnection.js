import serialport from 'serialport';
import {simulator} from './simulator';
import async from 'async';
import {dialog} from 'electron';
// var sp;
// var queue = [];
// var commandPending = false;
// var lastCommand;
// var commandResponse = [];
// var isSimulator = false;
console.log("serialconnection loaded");

export function connect(port, baudrate) {
  if (port == 'Simulator'){
      this.serialconnection.sp = simulator;
      this.serialconnection.isSimulator = true;
  }else{
      this.serialconnection.isSimulator = false;
      var SerialPort = serialport.SerialPort; // localize object constructor
      this.serialconnection.sp = new SerialPort(port, {
          baudrate: baudrate,
          parser: serialport.parsers.readline("\n")
      }, false);
  }
  this.serialconnection.sp.on("open", function (err) {
      if (err){
          console.log(err);
      }else{
          this.serialconnection.queue = [];
          this._addLog("Connected to : "+port+" : "+baudrate);
          this.serialconnection.sp.on('data', function(data) {
              this._addCommandLog(data);
              if (data == "ok"){
                ProcessCommandResponse.call(this, data);
                this.serialconnection.commandPending = false;
                this.serialconnection.lastCommand = null;
                this.serialconnection.commandResponse = [];
                if (this.serialconnection.queue.length>0){
                  send.call(this);
                }
              }else if (data.indexOf("Resend:")==0){
                //resend the last command
                this.serialconnection.queue.unshift(this.serialconnection.lastCommand);
                this.serialconnection.commandPending = false;
                this.serialconnection.commandResponse = [];
                send.call(this); // reattempt last command
              }else if (data.indexOf("echo:endstops hit:")==0) {
                //echo:endstops hit:  Z:28.3062
                var tokens = data.split(" ");
                this.setState({
                  millingjob: Object.assign({}, this.state.millingjob, {
                    lastZero: Number(tokens[3].split(":")[1]),
                    seekZero: true
                  })
                })
                console.log("endstop hit at: "+Number(tokens[3].split(":")[1]));
                //set Z coordinates correctly
                this.serialconnection.queue.unshift("G92 Z"+Number(tokens[3].split(":")[1]));
                this.serialconnection.commandPending = false;
                this.serialconnection.lastCommand = null;
                this.serialconnection.commandResponse = [];
                if (this.serialconnection.queue.length>0){
                    send.call(this);
                }
              }else{
                if (this.serialconnection.lastCommand && data.indexOf('echo')<0){
                  this.serialconnection.commandResponse.push(data);
                }
              }
          }.bind(this));
      }
  }.bind(this));
  this.serialconnection.sp.open(function (error) {
    if ( error ) {
      console.log(error)
    } else {
      this.serialconnection.commandPending = false;
      this.serialconnection.lastCommand = null;
      this.serialconnection.commandResponse = [];
      this.setState({
        isConnected: true,
        connectionPort: port,
        connectionBaudrate: baudrate
      })
    }
  }.bind(this));
}
export function isConnected(){
  if (this.serialconnection.sp != null){
    if (this.serialconnection.sp.isOpen()){
      return true;
    }
  }
  return false;
}
export function add(data){
  if (isConnected.call(this)){
    if (data instanceof Array){
        this.serialconnection.queue = this.serialconnection.queue.concat(data);
    }else{
        this.serialconnection.queue.push(data);
    }
  }else{
    alert("Sorry, Not Connected");
  }
}
export function send(isZero) {
  if (isZero == undefined) isZero = false;
  if (isConnected.call(this)){
    if (this.serialconnection.sp != null){
      if (!this.serialconnection.commandPending){
        if (this.serialconnection.sp.isOpen() && this.serialconnection.queue.length>0){
          this.serialconnection.commandPending = true;
          var cmd = this.serialconnection.queue.shift();
          var isZ = false;
          if (cmd.indexOf("SEEKZERO ")==0){
            cmd = cmd.substring(9);
            isZ = true
            console.log('seeking zero')
          }
          this.serialconnection.sp.write(
            cmd+"\n",
            function () {
              this.serialconnection.lastCommand = cmd;
              this.serialconnection.sp.drain(function () {
                this._addCommandLog(">>"+cmd);
              }.bind(this));
            }.bind(this),
            isZ
          );
        }
      }else{
        console.log('aborting - previous command pending');
      }
    }else{
      console.log('Not connected');
    }
  }
}
export function disconnect(port) {
  if (this.serialconnection.sp){
    this.serialconnection.sp.close(function (err) {
      if (err){
          console.log(err);
      }else{
        this._addErrorLog("Connection Closed")
      }
      this.serialconnection.commandPending = false;
      this.serialconnection.lastCommand = null;
      this.serialconnection.commandResponse = [];
      this.serialconnection.queue = [];
      this.setState({
        isConnected: false,
        connectionPort: '',
        connectionBaudrate: 115200
      })
    }.bind(this));
  }else{
    this.serialconnection.commandPending = false;
    this.serialconnection.queue = [];
  }
  this.serialconnection.isSimulator = false;
}
export function isBusy() {
  return this.serialconnection.commandPending;
}

export function ProcessCommandResponse(data){
  switch (this.serialconnection.lastCommand){
    case "M114":
      if (this.serialconnection.commandResponse.length>0){
        let positions = this.serialconnection.commandResponse[0].split(' ');
        let xposition = positions[0].split(':')[1];
        let yposition = positions[1].split(':')[1];
        let zposition = positions[2].split(':')[1];
        this.setState({
          xposition: Number(positions[0].split(':')[1]).toFixed(2),
          yposition: Number(positions[1].split(':')[1]).toFixed(2),
          zposition: Number(positions[2].split(':')[1]).toFixed(2),
          millingjob: Object.assign({}, this.state.millingjob, {
            receivedPostion: true
          })
        });
      }
      break;
    default:

      break;
  }
}
