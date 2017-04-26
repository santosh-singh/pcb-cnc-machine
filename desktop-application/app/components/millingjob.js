import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import TextField from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/raised-button';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import LinearProgress from 'material-ui/lib/linear-progress';
import {Button, ProgressBar} from 'react-bootstrap';
import SerialMonitor from '../components/serialmonitor';
var async = require('async');
const styles = {
  tab:{
    backgroundColor: '#028494',
    overflow: scroll
  }
}
export default class MillingJob extends Component {
  constructor(props) {
      super(props);
  }
  _drawCanvas = (canvas) => {
    if (canvas){
      var ctx = canvas.getContext("2d");
      canvas.width = Number(this.props.home.state.millingcontrol.canvasWidth)*10 + 20;
      canvas.height = Number(this.props.home.state.millingcontrol.canvasHeight)*10 + 20;
      ctx.clearRect(0, 0, canvas.width+20, canvas.height+20);
      let w=(this.props.home.state.millingcontrol.canvasWidth*10);
      let h=(this.props.home.state.millingcontrol.canvasHeight*10);
      var origShadowColor = ctx.shadowColor;
      ctx.shadowColor = "black";
      ctx.shadowOffsetX = 3;
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#C0C0C0";
      ctx.fillRect(10, 10, w, h);
      ctx.shadowColor = origShadowColor;
    }
  }
  _drawBoard = (canvas, title) => {
    if (canvas){
      var ctx = canvas.getContext("2d");
      var origShadowColor = ctx.shadowColor;
      ctx.shadowColor = "black";
      ctx.shadowOffsetX = 3;
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#D4CF39";
      ctx.fillRect((this.props.home.state.millingcontrol.boardX*10)+10, (this.props.home.state.millingcontrol.boardY*10)+10, this.props.home.state.millingcontrol.boardWidth*10, this.props.home.state.millingcontrol.boardHeight*10);
      ctx.font = "18px serif";
      ctx.fillStyle = "#efefef";
      ctx.fillText(title, 10 , 20);
      ctx.shadowColor = origShadowColor;
    }
  }
  _getMinMaxXY = (data, minmax) => {
    var minx = 9999, miny=9999, maxx=0, maxy=0;
    if (minmax){
      minx = minmax.minx;
      maxx = minmax.maxx;
      miny = minmax.miny;
      maxy = minmax.maxy;
    }
    if (data.length>0){
      for (var i=0; i<data.length; i++){
        var line = data[i];
        if (line.indexOf('(') != 0 && line.indexOf(')') != 0){
          var tokens = line.split(' ');
          if (tokens[0] == 'G00' || tokens[0] == 'G01'){
            var axis= tokens[1].substring(0,1);
            var move = tokens[1].substring(1);
            if (axis != "Z"){
              var x = Number(tokens[1].substring(1));
              var y = Number(tokens[2].substring(1));
              if (x<minx && x>=Number(this.props.home.state.millingcontrol.boardX)+Number(this.props.home.state.millingcontrol.cuttingX)) minx = x;
              if (x>maxx) maxx = x;
              if (y<miny && y>=Number(this.props.home.state.millingcontrol.boardY)+Number(this.props.home.state.millingcontrol.cuttingY)) miny = y;
              if (y>maxy) maxy = y;
            }
          }
        }
      }
    }
    return({minx: minx, maxx: maxx, miny: miny, maxy: maxy});
  }
  _buildAutoLevelArray = (minmax) => {
    var arr = [];
    for (var x=minmax.minx-Number(this.props.home.state.millingjob.gridOffsetMinX); x<minmax.maxx+Number(this.props.home.state.millingjob.gridOffsetMaxX); x+=Number(this.props.home.state.millingjob.gridSize)){
      for(var y=minmax.miny-Number(this.props.home.state.millingjob.gridOffsetMinY); y<minmax.maxy+Number(this.props.home.state.millingjob.gridOffsetMaxY); y+= Number(this.props.home.state.millingjob.gridSize)){
        arr.push([x, y, -9999]);
      }
    }
    return arr;
  }
  _drawAutoLevelBox = (minmax, canvas) => {
    if (canvas){
      var ctx = canvas.getContext("2d");
      ctx.strokeStyle = "#0000DD";
      ctx.fillStyle = "#FFFFFF";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(minmax.minx*10+10, minmax.miny*10+10);
      ctx.lineTo(minmax.maxx*10+10, minmax.miny*10+10);
      ctx.lineTo(minmax.maxx*10+10, minmax.maxy*10+10);
      ctx.lineTo(minmax.minx*10+10, minmax.maxy*10+10);
      ctx.lineTo(minmax.minx*10+10, minmax.miny*10+10);
      ctx.stroke();
      // ctx.fill();
    }
  }
  _drawAutoLevelGridPoints(lines, canvas){
    if (canvas){
      var gridSize = this.props.home.state.millingjob.gridSize;
      var ctx = canvas.getContext("2d");
      var minz = 99999; var maxz = 0;
      for (var i=0; i<lines.length; i++){
        if (lines[i][2] <minz) minz = lines[i][2];
        if (lines[i][2] >maxz) maxz = lines[i][2];
      }
      for (var i=0; i<lines.length; i++){
        var line = lines[i];
        var c;
        if (minz!=maxz){
          c = Number(155)* (Number(line[2])-Number(minz))/ (Number(maxz) - Number(minz))+Number(100);
        }else{
          c = 255;
        }
        var color = "rgba("+Number(c).toFixed(0)+",0,0,0.2)";
        var grd = ctx.createRadialGradient(line[0]*10+10,line[1]*10+10,gridSize*10,line[0]*10+10,line[1]*10+10,gridSize*100);
        grd.addColorStop(0,color);
        grd.addColorStop(1,"white");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.globalCompositeOperation = "multiply";
        ctx.fillRect(line[0]*10+10, line[1]*10+10, gridSize*10, gridSize*10);
        ctx.globalCompositeOperation = "source";
      }
    }
  }
  _drawAutoLevelGrid = (data, canvas) => {
    if (canvas){
      var ctx = canvas.getContext("2d");
      ctx.strokeStyle = "#000000";
      ctx.fillStyle = "#000000";
      for (var i=0; i<data.length; i++){
        ctx.beginPath();
        ctx.arc(data[i][0]*10+10, data[i][1]*10+10, 1, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
      }
    }
  }
  _rebuildBottomAutolevelArray(min){
    var ret = {arr:[], minmax:{minx: 0, maxx: 0, miny:0, maxy:0}};
    if (this._bottomAutoLevelCanvas && this.props.home.state.millingjob.bottomEGcode.length>0){
      ret.minmax = this._getMinMaxXY(this.props.home.state.millingjob.bottomEGcode);
      ret.arr = this._buildAutoLevelArray(ret.minmax);
    }
    return ret;
  }
  _rebuildTopAutolevelArray(min){
    var ret = {arr:[], minmax:{minx: 0, maxx: 0, miny:0, maxy:0}};
    if (this._topAutoLevelCanvas){
      var minmax;
      if (this.props.home.state.millingjob.topEGcode.length>0){
        minmax = this._getMinMaxXY(this.props.home.state.millingjob.topEGcode, minmax);
      }
      if (this.props.home.state.millingjob.topHGcode.length>0){
        minmax = this._getMinMaxXY(this.props.home.state.millingjob.topHGcode, minmax);
      }
      if (this.props.home.state.millingjob.topMGcode.length>0){
        minmax = this._getMinMaxXY(this.props.home.state.millingjob.topMGcode, minmax);
      }
      if (minmax){
        ret.minmax = minmax;
        ret.arr = this._buildAutoLevelArray(ret.minmax);
      }
    }
    return ret;
  }
  _drawBottomAutoLevel = (ctx, canvas) => {
    if (this._bottomAutoLevelCanvas && this.props.home.state.millingjob.bottomEGcode.length>0){
      this._drawCanvas(this._bottomAutoLevelCanvas);
      this._drawBoard(this._bottomAutoLevelCanvas, "Bottom Layer");
      if ((this.props.home.state.millingjob.autolevelBottomMinmax.maxx-this.props.home.state.millingjob.autolevelBottomMinmax.minx)>0 && (this.props.home.state.millingjob.autolevelBottomMinmax.maxy-this.props.home.state.millingjob.autolevelBottomMinmax.miny)>0 ){
        this._drawAutoLevelBox(this.props.home.state.millingjob.autolevelBottomMinmax, this._bottomAutoLevelCanvas);
        this._drawAutoLevelGrid(this.props.home.state.millingjob.autolevelBottom, this._bottomAutoLevelCanvas);
        this._drawAutoLevelGridPoints(this.props.home.state.millingjob.autolevelBottom, this._bottomAutoLevelCanvas);
      }
    }
  }
  _drawTopAutoLevel = (ctx, canvas) => {
    if (this._topAutoLevelCanvas){
      this._drawCanvas(this._topAutoLevelCanvas);
      this._drawBoard(this._topAutoLevelCanvas, "Top Layer");
      if ((this.props.home.state.millingjob.autolevelTopMinmax.maxx-this.props.home.state.millingjob.autolevelTopMinmax.minx)>0 && (this.props.home.state.millingjob.autolevelTopMinmax.maxy-this.props.home.state.millingjob.autolevelTopMinmax.miny)>0 ){
        this._drawAutoLevelBox(this.props.home.state.millingjob.autolevelTopMinmax, this._topAutoLevelCanvas);
        this._drawAutoLevelGrid(this.props.home.state.millingjob.autolevelTop, this._topAutoLevelCanvas);
        this._drawAutoLevelGridPoints(this.props.home.state.millingjob.autolevelTop, this._topAutoLevelCanvas);
      }
    }
  }
  _drawAutoLevel = (ctx, canvas) => {
    this._drawBottomAutoLevel();
    this._drawTopAutoLevel();
  }
  _bottomAutoLevelCanvas=null;
  _topAutoLevelCanvas=null;
  componentDidMount = () => {
    console.log("componentDidMount called", this.props.home.state.millingjob);
    this._drawAutoLevel(this.props);
  }
  componentDidUpdate = (prevProps, prevState) => {
    // console.log("componentWillUpdate called", this.props.home.state.millingjob);
    var millingjob = {};
    if (this.props.home.state.millingjob.seekZero){
      console.log('zero found');
      this._seekingZero = false;
      millingjob.seekZero = false;
    }
    if (this._settingZero && this.props.home.state.millingjob.receivedPostion){
      console.log("settings Zero ", this.props.home.state.zposition);
      this._lastZero = this.props.home.state.zposition;
      this._settingZero = false;
      millingjob.setZero= this.props.home.state.zposition,
      millingjob.lastActionFile= ""
    }
    if (this.props.home.state.millingjob.rebuildAutolevel){
      var ret = this._rebuildBottomAutolevelArray();
      millingjob.autolevelBottom = ret.arr;
      millingjob.autolevelBottomMinmax = ret.minmax;
      var ret = this._rebuildTopAutolevelArray();
      millingjob.autolevelTop = ret.arr;
      millingjob.autolevelTopMinmax = ret.minmax;
      millingjob.redrawAutolevel = true;
      millingjob.rebuildAutolevel = false;
    }else if (this.props.home.state.millingjob.redrawAutolevel) {
      this._drawAutoLevel();
      millingjob.redrawAutolevel = false;
    }
    if (this.props.home.state.millingjob.currentLayer == null){
      var layer;
      if (this.props.home.state.millingjob.bottomEGcode.length>0){
        millingjob.currentLayer= "bottomlayer"
      }else if (this.props.home.state.millingjob.topEGcode.length>0 || this.props.home.state.millingjob.topHGcode.length>0 || this.props.home.state.millingjob.topMGcode.length>0){
        millingjob.currentLayer= "toplayer"
      }
    }
//    this._millingState = this.props.home.state.millingjob.millingState;
    if (Object.keys(millingjob).length>0){
      this.props.home.setState({
        millingjob: Object.assign({}, this.props.home.state.millingjob, millingjob)
      });
    }
  }
  _handleChange = (e) => {
    console.log(this.props.home.state.millingjob.gridSize, this.refs.gridSize.getValue());
    if (  this.props.home.state.millingjob.gridSize != this.refs.gridSize.getValue() ||
          this.props.home.state.millingjob.gridOffsetMinX != this.refs.gridOffsetMinX.getValue() ||
          this.props.home.state.millingjob.gridOffsetMinY != this.refs.gridOffsetMinY.getValue() ||
          this.props.home.state.millingjob.gridOffsetMaxX != this.refs.gridOffsetMaxX.getValue() ||
          this.props.home.state.millingjob.gridOffsetMaxY != this.refs.gridOffsetMaxY.getValue()){
      if (confirm("You have modified the settings and autolevel grids will be recreated\n\nAre you sure to commit the changes?")){
        this.props.home.setState({
          millingjob: Object.assign({}, this.props.home.state.millingjob, {
            rebuildAutolevel: true,
            probeSpeed: this.refs.probeSpeed.getValue(),
            safeDepth: this.refs.safeDepth.getValue(),
            maxProbeDepth: this.refs.maxProbeDepth.getValue(),
            clearance: this.refs.clearance.getValue(),
            gridSize: this.refs.gridSize.getValue(),
            gridOffsetMinX: this.refs.gridOffsetMinX.getValue(),
            gridOffsetMinY: this.refs.gridOffsetMinY.getValue(),
            gridOffsetMaxX: this.refs.gridOffsetMaxX.getValue(),
            gridOffsetMaxY: this.refs.gridOffsetMaxY.getValue()
          })
        })
      }
    }else{
      this.props.home.setState({
        millingjob: Object.assign({}, this.props.home.state.millingjob, {
          probeSpeed: this.refs.probeSpeed.getValue(),
          safeDepth: this.refs.safeDepth.getValue(),
          maxProbeDepth: this.refs.maxProbeDepth.getValue(),
          clearance: this.refs.clearance.getValue(),
        })
      })
    }
  }
  _foundZero = (err, x, y, callback) => {
    if (err){
      console.log(err);
      callback(err);
    }else{
      var safeHeight = Number(this.props.home.state.millingjob.lastZero) + Number(this.props.home.state.millingjob.clearance);
      this.props.home._addCommand.call(this.props.home, "G00 Z"+Number(safeHeight).toFixed(4)+ " F"+Number(this.props.home.state.settings.fastfeedrate).toFixed(4));
      this.props.home._sendCommand.call(this.props.home);
      this._arr.push([x, y, Number(this.props.home.state.millingjob.lastZero)]);
      callback();
    }
  }
  _waitForZero = (x, y, callback) => {
    if (this._autolevelBottomStarted || this._autolevelTopStarted || this._autolevelBEFSeekZero || this._autolevelTEFSeekZero || this._autolevelTHFSeekZero || this._autolevelTMFSeekZero){
      if (this._seekingZero) {
        window.setTimeout(this._waitForZero.bind(this, x, y, callback), 300);
      }else{
        callback(null, x, y, callback);
      }
    }else{
      callback("User Stopped");
    }
  }
  _millingDone = (err, callback) => {
    this._waitingOK = false;
    if (err){
      if (err == "Milling Paused By User"){
        // this._millingState = 'paused';
        // this.props.home.setState({
        //   millingjob: Object.assign({}, this.props.home.state.millingjob, {
        //     millingState: 'paused',
        //   })
        // })
        alert("Milling paused at line: "+this._index);
      }else{
        this._millingState = "idle";
        this._index = 0;
        alert(err);
        console.log(err)
      }
      console.log(err, this._index);
    }else{
      callback();
    }
  }
  _waitingOK = false;
  _index = 0;
  _millingState = 'idle';
  _sendMillingCommand = (cmd, callback) => {
    if (this._millingState == "befstarted" || this._millingState == "tefstarted" || this._millingState == "thfstarted" || this._millingState == "tmfstarted" ){
      if (this.props.home.serialconnection.commandPending) {
        window.setTimeout(this._sendMillingCommand.bind(this, cmd, callback), 100);
      }else{
        if (!this._waitingOK){
          this._index += 1;
          this.props.home._addCommand.call(this.props.home, cmd[0]);
          this.props.home._sendCommand.call(this.props.home);
          var millingProgress = Number(this._index/Number(this.props.home.state.millingjob.millingGCodes.length)*100).toFixed(0);
          this.props.home.setState({
            millingjob: Object.assign({}, this.props.home.state.millingjob, {
              millingProgress: millingProgress,
              millingLastZero: cmd[1]
            })
          })
          callback(null, callback);
        }else {
          window.setTimeout(this._sendMillingCommand.bind(this, cmd, callback), 100);
        }
      }
    }else if (this._millingState.indexOf('paused')>0){
      callback("Milling Paused By User");
    }else{
      callback("Milling Stopped");
    }
  }
  _autolevelBottomStarted = false;
  _autolevelTopStarted = false;
  _autolevelBEFSeekZero = false;
  _autolevelTEFSeekZero = false;
  _autolevelTHFSeekZero = false;
  _autolevelTMFSeekZero = false;
  _seekingZero = false;
  _settingZero = false;
  _arr = [];
  _lastZero = 0;
  _lastActionFile = '';
  _setZero = (file) => {
    this.props.home.setState({
      millingjob: Object.assign({}, this.props.home.state.millingjob, {
        lastActionFile: file,
        receivedPostion: false
      })
    })
    this.props.home._addCommand.call(this.props.home, "M114");
    this.props.home._sendCommand.call(this.props.home);
    this._settingZero = true;
  }
  _seekZero = (row, callback) => {
    if (this._autolevelBottomStarted || this._autolevelTopStarted || this._autolevelBEFSeekZero || this._autolevelTEFSeekZero || this._autolevelTHFSeekZero || this._autolevelTMFSeekZero){
        var file = '';
      if (this._autolevelBEFSeekZero) file = 'bef';
      if (this._autolevelTEFSeekZero) file = 'tef';
      if (this._autolevelTHFSeekZero) file = 'thf';
      if (this._autolevelTMFSeekZero) file = 'tmf';
      this._seekingZero = true;
      this.props.home.setState({
        millingjob: Object.assign({}, this.props.home.state.millingjob, {
          lastActionFile: file,
        })
      })
      this._seekingZero = true;
      if (typeof row !== 'undefined'){
        var x = row[0], y = row[1];
        this.props.home._addCommand.call(this.props.home, "G00 X"+Number(x).toFixed(4)+" Y"+Number(y).toFixed(4)+" F"+Number(this.props.home.state.settings.fastfeedrate).toFixed(4));
      }
      this.props.home._addCommand.call(this.props.home, "SEEKZERO G01 Z"+Number(this.props.home.state.millingjob.maxProbeDepth).toFixed(4)+ " F"+Number(this.props.home.state.millingjob.probeSpeed).toFixed(4));
      this.props.home._sendCommand.call(this.props.home, true);
      this._waitForZero.call(this, x, y, this._foundZero.bind(this, null, x, y, callback));
    }else{
      callback("User Stopped");
    }
  }
  _bottomSeekZeroDone = (err) => {
    this._autolevelBEFSeekZero = false;
    if (err) console.log(err);
    else {
      this._lastZero = this.props.home.state.millingjob.lastZero;
      this._seekingZero = false;
      console.log('Bottom found zero');
      this.props.home.setState({
        millingjob: Object.assign({}, this.props.home.state.millingjob, {
          setZero: this.props.home.state.millingjob.lastZero,
          lastActionFile: ""
        })
      })
    }
  }
  _topSeekZeroDone = (err) => {
    this._autolevelTEFSeekZero = false;
    this.forceUpdate();
    if (err) console.log(err);
    else {
      this._lastZero = this.props.home.state.millingjob.lastZero;
      this._seekingZero = false;
      console.log('Bottom found zero');
      this.props.home.setState({
        millingjob: Object.assign({}, this.props.home.state.millingjob, {
          setZero: this.props.home.state.millingjob.lastZero,
          lastActionFile: ""
        })
      })
    }
  }
  _bottomAutolevelDone = (err) => {
    if (err) {
      console.log(err);
      alert(err);
    } else {
      this._autolevelBottomStarted = false;
      console.log(this._arr);
      this.props.home.setState({
        millingjob: Object.assign({}, this.props.home.state.millingjob, {
          autolevelBottom: this._arr,
          redrawAutolevel: true,
          lastActionFile: ''
        })
      })
      var zero = this._calculateAutolevelMinMax(this._arr);
      var msg = "Z Min: "+zero.minz+" Max: "+zero.maxz;
      alert("Bottom Autolevel Done\nTotal Points generated:"+this._arr.length+"\n"+msg);
    }
  }
  _topAutolevelDone = (err) => {
    if (err) {
      console.log(err);
      alert(err);
    } else {
      this._autolevelTopStarted = false;
      console.log(this._arr);
      this.props.home.setState({
        millingjob: Object.assign({}, this.props.home.state.millingjob, {
          autolevelTop: this._arr,
          redrawAutolevel: true,
          lastActionFile: ''
        })
      })
      alert("Top Autolevel Done\nTotal Points generated:"+this._arr.length);
    }
  }
  _handleJob = (action) => {
    switch (action){
      case "clearbottomautolevel":
        if (confirm("Are you sure you want to clean up the Bottom Autolevel Grid?")){
          var ret = this._rebuildBottomAutolevelArray();
          this.props.home.setState({
            millingjob: Object.assign({}, this.props.home.state.millingjob, {
              autolevelBottom: ret.arr,
              autolevelBottomMinmax: ret.minmax,
              redrawAutolevel: true,
              rebuildAutolevel: false
            })
          })
        }
        break;
      case "bottomautolevel":
        if (this.props.home.state.millingjob.autolevelBottom.length ==0){
          alert("You must create the grid first using Clear Grid");
        }else{
          if (this.props.home.state.isConnected){
            if (confirm("Have you connected the Probe?")){
              this._autolevelBottomStarted = true;
              this._arr = [];
              this.props.home.setState({
                millingjob: Object.assign({}, this.props.home.state.millingjob, {
                  lastActionFile: 'bef',
                  autolevelState: 'bef'
                })
              })
              this.props.home._addCommand.call(this.props.home, "G28 X Y Z");
              this.props.home._sendCommand.call(this.props.home);
              async.eachSeries.call(this, this.props.home.state.millingjob.autolevelBottom, this._seekZero.bind(this), this._bottomAutolevelDone.bind(this));
            }
          }else{
            alert("Sorry no connection");
          }
        }
        break;
      case "bottomseekzero":
        if (this.props.home.state.isConnected){
          if (confirm("Have you connected the Probe?")){
            this._autolevelBEFSeekZero = true;
            this._lastZero = 999;
            this.props.home._addCommand.call(this.props.home, "G28 X Y Z");
            this.props.home._addCommand.call(this.props.home, "G00 Z"+Number(this.props.home.state.millingjob.safeDepth).toFixed(4)+ " F600");
            this.props.home._sendCommand.call(this.props.home);
            async.eachSeries.call(this, [this.props.home.state.millingjob.autolevelBottom[0]], this._seekZero.bind(this), this._bottomSeekZeroDone.bind(this));
          }
        }else{
          alert("Sorry no connection");
        }
        break;
      case "bottommilling":
        this._startMilling(this.props.home.state.millingjob.bottomEGcode, this.props.home.state.millingjob.autolevelBottom, this.props.home.state.millingjob.autolevelBottomMinmax, this.props.home.state.millingjob.lastZero, "befstarted");
        break;
      case "cleartopautolevel":
        if (confirm("Are you sure you want to clean up the Top Autolevel Grid?")){
          this._rebuildTopAutolevelArray();
          var ret = this._rebuildBottomAutolevelArray();
          this.props.home.setState({
            millingjob: Object.assign({}, this.props.home.state.millingjob, {
              autolevelTop: ret.arr,
              autolevelTopMinmax: ret.minmax,
              redrawAutolevel: true,
              rebuildAutolevel: false
            })
          })
        }
        break;
      case "topautolevel":
        if (this.props.home.state.isConnected){
          if (confirm("Have you connected the Probe?")){
            this._autolevelTopStarted = true;
            this._arr = [];
            this.props.home.setState({
              millingjob: Object.assign({}, this.props.home.state.millingjob, {
                lastActionFile: 'tef',
                autolevelState: 'tef'
              })
            })
            this.props.home._addCommand.call(this.props.home, "G28 X Y Z");
            this.props.home._sendCommand.call(this.props.home);
            async.eachSeries.call(this, this.props.home.state.millingjob.autolevelTop, this._seekZero.bind(this), this._topAutolevelDone.bind(this));
          }
        }else{
          alert("Sorry no connection");
        }
        break;
      case "topseekzero":
        if (this.props.home.state.isConnected){
          if (confirm("Have you connected the Probe?")){
            this._autolevelTEFSeekZero = true;
            this._lastZero = 999;
            this.props.home._addCommand.call(this.props.home, "G28 X Y Z");
            this.props.home._addCommand.call(this.props.home, "G00 Z"+Number(this.props.home.state.millingjob.safeDepth).toFixed(4)+ " F600");
            this.props.home._sendCommand.call(this.props.home);
            async.eachSeries.call(this, [this.props.home.state.millingjob.autolevelTop[0]], this._seekZero.bind(this), this._topSeekZeroDone.bind(this));
          }
        }else{
          alert("Sorry no connection");
        }
        break;
      case "topmilling":
        this._startMilling(this.props.home.state.millingjob.topEGcode, this.props.home.state.millingjob.autolevelTop, this.props.home.state.millingjob.autolevelTopMinmax, this.props.home.state.millingjob.lastZero, "tefstarted");
        break;
      case "topholesseekzero":
        if (this.props.home.state.isConnected){
          if (confirm("Have you connected the Probe?")){
            this._autolevelTHFSeekZero = true;
            this._lastZero = 999;
            this.props.home._addCommand.call(this.props.home, "G28 X Y Z");
            this.props.home._sendCommand.call(this.props.home);
            async.eachSeries.call(this, [this.props.home.state.millingjob.autolevelTop[0]], this._seekZero.bind(this), this._topSeekZeroDone.bind(this));
          }
        }else{
          alert("Sorry no connection");
        }
        break;
      case "topholesmilling":
        this._startMilling(this.props.home.state.millingjob.topHGcode, this.props.home.state.millingjob.autolevelTop, this.props.home.state.millingjob.autolevelTopMinmax, this.props.home.state.millingjob.lastZero, "thfstarted");
        break;
      case "topmillingseekzero":
        if (this.props.home.state.isConnected){
          if (confirm("Have you connected the Probe?")){
            if (this.props.home.state.millingjob.autolevelTop.length == 0){
              this._rebuildTopAutolevelArray();
            }
            this._autolevelTMFSeekZero = true;
            this._lastZero = 999;
            this.props.home._addCommand.call(this.props.home, "G28 X Y Z");
            this.props.home._sendCommand.call(this.props.home);
            async.eachSeries.call(this, [this.props.home.state.millingjob.autolevelTop[0]], this._seekZero.bind(this), this._topSeekZeroDone.bind(this));
          }
        }else{
          alert("Sorry no connection");
        }
        break;
      case "topfilemilling":
        this._startMilling(this.props.home.state.millingjob.topMGcode, this.props.home.state.millingjob.autolevelTop, this.props.home.state.millingjob.autolevelTopMinmax, this.props.home.state.millingjob.lastZero, "tmfstarted");
        break;
      case "stop":
        this._autolevelBottomStarted = false;
        this._autolevelBEFSeekZero = false;
        this._autolevelTEFSeekZero = false;
        this._autolevelTHFSeekZero = false;
        this._autolevelTMFSeekZero = false;
        this._autolevelTopStarted = false;
        this._millingState = 'idle';
        this.props.home.setState({
          millingjob: Object.assign({}, this.props.home.state.millingjob, {
            // lastActionFile: '',
            // millingState: 'idle',
            millingProgress: 0,
            autolevelState: ''
          })
        })
        break;
      case "befpause":
        if (this._millingState == 'befpaused'){
          this._millingState = 'befstarted';
          this._startMilling(this.props.home.state.millingjob.bottomEGcode, this.props.home.state.millingjob.autolevelBottom, this.props.home.state.millingjob.autolevelBottomMinmax, this.props.home.state.millingjob.lastZero, "befstarted");
        } else {
          this._millingState = 'befpaused';
        }
        this.forceUpdate();
        break;
      case "tefpause":
        if (this._millingState == 'tefpaused'){
          this._millingState = 'tefstarted';
          this._startMilling(this.props.home.state.millingjob.topEGcode, this.props.home.state.millingjob.autolevelTop, this.props.home.state.millingjob.autolevelTopMinmax, this.props.home.state.millingjob.lastZero, "tefstarted");
        } else {
          this._millingState = 'tefpaused';
        }
        this.forceUpdate();
        break;
      case "thfpause":
        if (this._millingState == 'thfpaused'){
          this._millingState = 'thfstarted';
          this._startMilling(this.props.home.state.millingjob.topHGcode, this.props.home.state.millingjob.autolevelTop, this.props.home.state.millingjob.autolevelTopMinmax, this.props.home.state.millingjob.lastZero, "thfstarted");
        } else {
          this._millingState = 'thfpaused';
        }
        this.forceUpdate();
        break;
      case "tmfpause":
        if (this._millingState == 'tmfpaused'){
          this._millingState = 'tmfstarted';
          this._startMilling(this.props.home.state.millingjob.topMGcode, this.props.home.state.millingjob.autolevelTop, this.props.home.state.millingjob.autolevelTopMinmax, this.props.home.state.millingjob.lastZero, "tmfstarted");
        } else {
          this._millingState = 'tmfpaused';
        }
        this.forceUpdate();
        break;
      case "bottomsetzero":
        if (this.props.home.state.isConnected){
          this._setZero('bef');
        }else{
          alert("Sorry no connection");
        }
        break;
      case "topsetzero":
        if (this.props.home.state.isConnected){
          this._setZero('tef');
        }else{
          alert("Sorry no connection");
        }
        break;
      case "topholessetzero":
        if (this.props.home.state.isConnected){
          this._setZero('thf');
        }else{
          alert("Sorry no connection");
        }
        break;
      case "topmillingsetzero":
        if (this.props.home.state.isConnected){
          this._setZero('tmf');
        }else{
          alert("Sorry no connection");
        }
        break;
      default:
    }
  }
  _handleLayerChange = (event, index, value) => {
    this.setState({
      currentLayer: value
    });
  }
  _calculateZero = (x, y, z, autolevel, lastZero) => {
    var nearX = 0;
    var nearY = 0;
    var dx = 9999, dy=9999;
    var nearZ = 9999;
    for (var i=0; i<autolevel.length; i++){
      if (autolevel[i][2]!=-9999){
        var xdiff = Math.abs(autolevel[i][0]-x);
        var ydiff = Math.abs(autolevel[i][1]-y);
        if (xdiff<=dx && ydiff<=dy){
          dx = xdiff;
          dy = ydiff;
          nearX = autolevel[i][0];
          nearY = autolevel[i][1];
          nearZ = autolevel[i][2];
          // console.log("x: "+x, "y: "+y, "AX: "+autolevel[i][0], "AY: "+autolevel[i][1], "xdiff: "+xdiff, "ydiff: "+ydiff, "dx: "+dx, "dy: "+dy, "newZ: "+nearZ);
        }else{
          // console.log("x: "+x, "y: "+y, "AX: "+autolevel[i][0], "AY: "+autolevel[i][1], "xdiff: "+xdiff, "ydiff: "+ydiff, "dx: "+dx, "dy: "+dy);
        }
      }
    }
    if (nearZ !=9999){
      console.log(x, y, z, Number(Number(z) + Number(nearZ)));
      return Number(Number(z) + Number(nearZ));
    }else{
      console.log(x, y, z, Number(Number(z) + Number(lastZero)));
      return Number(Number(z)+Number(lastZero));
    }
  }
  _calculateAutolevelMinMax = (autolevel) => {
    var minZ = 9999;
    var maxZ = -9999;
    for (var i=0; i<autolevel.length; i++){
      if (autolevel[i][2] != -9999){
        if (autolevel[i][2] < minZ) minZ = autolevel[i][2];
        if (autolevel[i][2] > maxZ) maxZ = autolevel[i][2];
      }
    }
    return ({minz: minZ, maxz: maxZ});
  }
  _startMilling = (data, autolevel, minmax, lastZero, millingState) => {
    if (this._index>0){
      // un pause it
      if (this._index<this.props.home.state.millingjob.millingGCodes.length-1){
        async.eachSeries.call(this,
          this.props.home.state.millingjob.millingGCodes.slice(this._index+1),
          this._sendMillingCommand.bind(this),
          this._millingDone.bind(this)
        );
      }else{
        this._millingState = 'idle';
        this._index = 0;
      }
    }else{
      var gcodes = [["G90", 0.0000]];
      this._index = 0;
      var lastx = 0;
      var lasty = 0;
      var lastz = 0;
      var zero = this._calculateAutolevelMinMax(autolevel);
      var useAutolevel = false;
      var useSetZero = false;
      var msg;
      if (zero.minz != 9999 && zero.maxz!= -9999){
        useAutolevel = true;
        msg = "Using Autolevel Data \nZ Min: "+zero.minz+" Max: "+zero.maxz;
      }else if (this.props.home.state.millingjob.setZero != 9999){
          useSetZero = true;
          msg = "No Autolevel data\n Use Last Seeked Zero at: "+ this.props.home.state.millingjob.setZero;
      }
      if (!useAutolevel && !useSetZero){
        alert("Sorry Autolevel or Seek Zero is must for milling to start.");
      }else{
        if (confirm("You are about to start the BOTTOM milling process.\n " +msg+"\nDo you want to Continue?")){
          if (data.length>0){
            for (var i=0; i<data.length; i++){
              var line = data[i];
              if (line.indexOf('(') != 0 && line.indexOf(')') != 0){
                var tokens = line.split(' ');
                if (tokens[0] == 'G00' || tokens[0] == 'G01'){
                  var axis= tokens[1].substring(0,1);
                  var move = tokens[1].substring(1);
                  if (axis == "Z"){
                    var z = Number(this._calculateZero(lastx, lasty, move, autolevel, this.props.home.state.millingjob.setZero));
                    lastz = z;
                    var t = ""; for (var m=2; m<tokens.length; m++){ t += tokens[m]; }
                    gcodes.push([tokens[0] + " Z"+Number(z).toFixed(4)+" "+t, lastz]);
                  }else{
                    lastx = Number(tokens[1].substring(1));
                    lasty = Number(tokens[2].substring(1));
                    gcodes.push([line, lastz]);
                  }
                }else{
                  gcodes.push([line, lastz]);
                }
              }else{
                gcodes.push([line, lastz]);
              }
            }
          }
        }
      }
      if (gcodes.length>0){
        this._millingState = millingState;
        async.eachSeries.call(this,
          gcodes,
          this._sendMillingCommand.bind(this),
          this._millingDone.bind(this)
        );
        this.props.home.setState({
          millingjob: Object.assign({}, this.props.home.state.millingjob, {
            // millingState: millingState,
            millingProgress: 0,
            millingLastZero: 0,
            millingGCodes: gcodes,
          })
        })
      }
    }
  }
  render() {
    if (["millingjob"].indexOf(this.props.home.state.menu.page)<0) return (null);
    var buttons =[];
    var busy = this._seekingZero;
    var disableBE = false, disableTE = false, disableTH = false, disableTM = false;
    if        (this._millingState == 'befstarted' ||
              (this.props.home.state.millingjob.autolevelState == 'bef')) {
       disableBE = false; disableTE = true; disableTH = true; disableTM = true;
       busy = true;
    }else if  (this._millingState == 'tefstarted' ||
              (this.props.home.state.millingjob.autolevelState == 'tef')) {
      disableBE = true; disableTE = false; disableTH = true; disableTM = true;
      busy = true;
    }else if  (this._millingState == 'thfstarted' ||
              (this.props.home.state.millingjob.autolevelState == 'thf')) {
      disableBE = true; disableTE = true; disableTH = false; disableTM = true;
      busy = true;
    }else if  (this._millingState == 'tmfstarted' ||
              (this.props.home.state.millingjob.autolevelState == 'tmf')) {
      disableBE = true; disableTE = true; disableTH = true; disableTM = false;
      busy = true;
    }
    if (this.props.home.state.millingjob.bottomEGcode.length>0){
      if (this._millingState == "befstarted" || this._millingState == 'befpaused'){
        buttons.push(
          <GridList cellHeight={40} cols={6} padding={0} style={{overflowY: 'auto', backgroundColor: 'white', borderBottom: "1px solid black"}}>
            <GridTile key={1} cols={6} rows={1}><center><h4>Bottom Etching File</h4></center></GridTile>
              <GridTile key={2} cols={4} rows={1}><ProgressBar now={Number(Number(this.props.home.state.millingjob.millingProgress).toFixed(4))} /></GridTile>
            <GridTile key={3} cols={1} rows={1}><Button style={{marginLeft: 10, width:'100%'}} bsStyle="default" onClick={this._handleJob.bind(this, 'befpause')}>Pause</Button></GridTile>
            <GridTile key={4} cols={1} rows={1}><Button style={{marginLeft: 10, width:'100%'}} bsStyle="danger" onClick={this._handleJob.bind(this, 'stop')}>Stop</Button></GridTile>
          </GridList>
          );
      }else{
        buttons.push(
          <GridList cellHeight={40} cols={6} padding={1} style={{overflowY: 'auto', backgroundColor: 'white', borderBottom: "1px solid black"}}>
            <GridTile key={5} cols={6} rows={1}><center><h4>Bottom Etching File</h4></center></GridTile>
            <GridTile key={6} cols={1} rows={1}><Button style={{marginLeft: 10, width: '100%'}} bsStyle="primary" disabled={disableBE || busy} onClick={this._handleJob.bind(this, 'clearbottomautolevel')}>Clear Grid</Button></GridTile>
            <GridTile key={7} cols={1} rows={1}><Button style={{marginLeft: 10, width: '100%'}} bsStyle="primary" disabled={disableBE || busy} primary={true} onClick={this._handleJob.bind(this, 'bottomautolevel')}>Start Autolevel</Button></GridTile>
            <GridTile key={8} cols={1} rows={1}><Button style={{marginLeft: 10, width: '100%'}} bsStyle="primary"  disabled={disableBE || busy} onClick={this._handleJob.bind(this, 'bottomsetzero')}>Set Zero</Button></GridTile>
            <GridTile key={9} cols={1} rows={1}><Button style={{marginLeft: 10, width: '100%'}} bsStyle="primary"  disabled={disableBE || busy} onClick={this._handleJob.bind(this, 'bottomseekzero')}>Seek Zero</Button></GridTile>
            <GridTile key={10} cols={1} rows={1}><Button style={{marginLeft: 10, width: '100%'}} bsStyle="primary" disabled={disableBE || busy} onClick={this._handleJob.bind(this, 'bottommilling')}>Start Milling</Button></GridTile>
            <GridTile key={11} cols={1} rows={1}><Button style={{marginLeft: 10, width: '100%'}} bsStyle="danger" disabled={disableBE} onClick={this._handleJob.bind(this, 'stop')}>STOP</Button></GridTile>
          </GridList>
          );
      }
    }
    if (this.props.home.state.millingjob.topEGcode.length>0){
      if (this._millingState == "tefstarted" || this._millingState == 'tefpaused'){
        buttons.push(
          <GridList cellHeight={40} cols={6} padding={0} style={{overflowY: 'auto', backgroundColor: 'white', borderBottom: "1px solid black"}}>
            <GridTile key={12} cols={6} rows={1}><center><h4>Top Etching File</h4></center></GridTile>
            <GridTile key={2} cols={4} rows={1}><ProgressBar now={Number(this.props.home.state.millingjob.millingProgress).toFixed(4)} /></GridTile>
            <GridTile key={14} cols={1} rows={1}><Button style={{marginLeft: 10, width:'100%'}} bsStyle="default" onClick={this._handleJob.bind(this, 'tefpause')}>{this._millingState == 'tefpaused'? "Resume" : "Pause"}</Button></GridTile>
            <GridTile key={15} cols={1} rows={1}><Button style={{marginLeft: 10, width:'100%'}} bsStyle="danger" onClick={this._handleJob.bind(this, 'stop')}>Stop</Button></GridTile>
          </GridList>
          );
      }else{
        buttons.push(
          <GridList cellHeight={40} cols={6} padding={1} style={{overflowY: 'auto', backgroundColor: 'white', borderBottom: "1px solid black"}}>
            <GridTile key={16} cols={6} rows={1}><center><h4>Top Etching File</h4></center></GridTile>
            <GridTile key={17} cols={1} rows={1}><Button style={{marginLeft: 10, width: '100%'}} bsStyle="primary" disabled={disableTE || busy} onClick={this._handleJob.bind(this, 'cleartopautolevel')}>Clear Grid</Button></GridTile>
            <GridTile key={18} cols={1} rows={1}><Button style={{marginLeft: 10, width: '100%'}} bsStyle="primary" disabled={disableTE || busy} primary={true} onClick={this._handleJob.bind(this, 'topautolevel')}>Start Autolevel</Button></GridTile>
            <GridTile key={19} cols={1} rows={1}><Button style={{marginLeft: 10, width: '100%'}} bsStyle="primary"  disabled={disableTE || busy} onClick={this._handleJob.bind(this, 'topsetzero')}>Set Zero</Button></GridTile>
            <GridTile key={20} cols={1} rows={1}><Button style={{marginLeft: 10, width: '100%'}} bsStyle="primary"  disabled={disableTE || busy} onClick={this._handleJob.bind(this, 'topseekzero')}>Seek Zero</Button></GridTile>
            <GridTile key={21} cols={1} rows={1}><Button style={{marginLeft: 10, width: '100%'}} bsStyle="primary" disabled={disableTE || busy} onClick={this._handleJob.bind(this, 'topmilling')}>Start Milling</Button></GridTile>
            <GridTile key={22} cols={1} rows={1}><Button style={{marginLeft: 10, width: '100%'}} bsStyle="danger" disabled={disableTE} onClick={this._handleJob.bind(this, 'stop')}>STOP</Button></GridTile>
          </GridList>
        );
      }
    }
    if (this.props.home.state.millingjob.topHGcode.length>0){
      if (this._millingState == "thfstarted" || this._millingState == 'thfpaused'){
        buttons.push(
          <GridList cellHeight={40} cols={6} padding={1} style={{overflowY: 'auto', backgroundColor: 'white', borderBottom: "1px solid black"}}>
            <GridTile key={23} cols={6} rows={1}><center><h4>Top Holes File</h4></center></GridTile>
            <GridTile key={2} cols={4} rows={1}><ProgressBar now={Number(this.props.home.state.millingjob.millingProgress).toFixed(4)} /></GridTile>
            <GridTile key={25} cols={1} rows={1}><Button style={{marginLeft: 10, width:'100%'}} bsStyle="default" onClick={this._handleJob.bind(this, 'thfpause')}>Pause</Button></GridTile>
            <GridTile key={26} cols={1} rows={1}><Button style={{marginLeft: 10, width:'100%'}} bsStyle="danger" onClick={this._handleJob.bind(this, 'stop')}>Stop</Button></GridTile>
          </GridList>
          );
      }else{
        buttons.push(
          <GridList cellHeight={40} cols={6} padding={1} style={{overflowY: 'auto', backgroundColor: 'white', borderBottom: "1px solid black"}}>
            <GridTile key={27} cols={6} rows={1}><center><h4>Top Holes File</h4></center></GridTile>
            <GridTile key={28} cols={1} rows={1}></GridTile>
            <GridTile key={29} cols={1} rows={1}><Button style={{marginLeft: 10, width: '100%'}} bsStyle="primary" disabled={disableTH || busy} onClick={this._handleJob.bind(this, 'cleartopautolevel')}>Clear Grid</Button></GridTile>
            <GridTile key={30} cols={1} rows={1}><Button style={{marginLeft: 10, width: '100%'}} bsStyle="primary"  disabled={disableTH || busy} onClick={this._handleJob.bind(this, 'topholessetzero')}>Set Zero</Button></GridTile>
            <GridTile key={31} cols={1} rows={1}><Button style={{marginLeft: 10, width: '100%'}} bsStyle="primary"  disabled={disableTH || busy} onClick={this._handleJob.bind(this, 'topholesseekzero')}>Seek Zero</Button></GridTile>
            <GridTile key={32} cols={1} rows={1}><Button style={{marginLeft: 10, width: '100%'}} bsStyle="primary" disabled={disableTH || busy} onClick={this._handleJob.bind(this, 'topholesmilling')}>Start Milling</Button></GridTile>
            <GridTile key={33} cols={1} rows={1}><Button style={{marginLeft: 10, width: '100%'}} bsStyle="danger" disabled={disableTH} onClick={this._handleJob.bind(this, 'stop')}>STOP</Button></GridTile>
          </GridList>
          );
      }
    }
    if (this.props.home.state.millingjob.topMGcode.length>0){
      if (this._millingState == "tmfstarted" || this._millingState == 'tmfpaused'){
        buttons.push(
          <GridList cellHeight={40} cols={6} padding={1} style={{overflowY: 'auto', backgroundColor: 'white', borderBottom: "1px solid black"}}>
            <GridTile key={34} cols={6} rows={1}><center><h4>Top Milling File</h4></center></GridTile>
            <GridTile key={2} cols={4} rows={1}><ProgressBar now={Number(this.props.home.state.millingjob.millingProgress).toFixed(4)} /></GridTile>
            <GridTile key={36} cols={1} rows={1}><Button style={{marginLeft: 10, width:'100%'}} bsStyle="default" onClick={this._handleJob.bind(this, 'tmfpause')}>Pause</Button></GridTile>
            <GridTile key={37} cols={1} rows={1}><Button style={{marginLeft: 10, width:'100%'}} bsStyle="danger" onClick={this._handleJob.bind(this, 'stop')}>Stop</Button></GridTile>
          </GridList>
          );
      }else{
        buttons.push(
          <GridList cellHeight={40} cols={6} padding={1} style={{overflowY: 'auto', backgroundColor: 'white', borderBottom: "1px solid black"}}>
            <GridTile key={38} cols={6} rows={1}><center><h4>Top Milling File</h4></center></GridTile>
            <GridTile key={39} cols={1} rows={1}></GridTile>
            <GridTile key={40} cols={1} rows={1}><Button style={{marginLeft: 10, width: '100%'}} bsStyle="primary" disabled={disableTM || busy} onClick={this._handleJob.bind(this, 'cleartopautolevel')}>Clear Grid</Button></GridTile>
            <GridTile key={41} cols={1} rows={1}><Button style={{marginLeft: 10, width: '100%'}} bsStyle="primary"  disabled={disableTM || busy} onClick={this._handleJob.bind(this, 'topmillingsetzero')}>Set Zero</Button></GridTile>
            <GridTile key={42} cols={1} rows={1}><Button style={{marginLeft: 10, width: '100%'}} bsStyle="primary"  disabled={disableTM || busy} onClick={this._handleJob.bind(this, 'topmillingseekzero')}>Seek Zero</Button></GridTile>
            <GridTile key={43} cols={1} rows={1}><Button style={{marginLeft: 10, width: '100%'}} bsStyle="primary" disabled={disableTM || busy} onClick={this._handleJob.bind(this, 'topfilemilling')}>Start Milling</Button></GridTile>
            <GridTile key={44} cols={1} rows={1}><Button style={{marginLeft: 10, width: '100%'}} bsStyle="danger" disabled={disableTM} onClick={this._handleJob.bind(this, 'stop')}>STOP</Button></GridTile>
          </GridList>
          );
      }
    }
    var canvases =[];
    var layers = [];
    var bottomCanvasStyle = {display: "none"};
    var topCanvasStyle = {display: "none"};
    var currentLayer = '';
    if (this.props.home.state.millingjob.bottomEGcode.length>0){
        layers.push(<MenuItem key={1} value={"bottomlayer"} primaryText={"Bottom Layer"} label={"Bottom Layer"}/>);
        currentLayer = 'bottomlayer';
    }
    if (this.props.home.state.millingjob.topEGcode.length>0 || this.props.home.state.millingjob.topHGcode.length>0 || this.props.home.state.millingjob.topMGcode.length>0){
      layers.push(<MenuItem key={2} value={"toplayer"} primaryText={"Top Layer"} label={"Top Layer"}/>);
      currentLayer = 'toplayer';
    }
    if (this.props.home.state.millingjob.currentLayer) currentLayer = this.props.home.state.millingjob.currentLayer;
    if (currentLayer == "bottomlayer"){
      bottomCanvasStyle = {display: "block"};
    }
    if (currentLayer == "toplayer"){
      topCanvasStyle = {display: "block"};
    }
    canvases.push(<canvas style={bottomCanvasStyle} key={1} ref={(c) => this._bottomAutoLevelCanvas = c} />);
    canvases.push(<canvas style={topCanvasStyle} key={2} ref={(c) => this._topAutoLevelCanvas = c} />);

    return (
      <div >
      <GridList cellHeight={70} cols={11} padding={1} style={{overflowY: 'auto', backgroundColor: 'white', padding: 10, display: 'inline-flex', width: '100%'}}>
        <GridTile key={0} cols={1} rows={1}><TextField style={{width: 110}} defaultValue={this.props.home.state.millingjob.probeSpeed} ref="probeSpeed" floatingLabelText="Z Probe Speed" /></GridTile>
        <GridTile key={1} cols={1} rows={1}><TextField style={{width: 110}}  defaultValue={this.props.home.state.millingjob.safeDepth}  ref="safeDepth" floatingLabelText="Safe Depth" /></GridTile>
        <GridTile key={2} cols={1} rows={1}><TextField style={{width: 130}}  defaultValue={this.props.home.state.millingjob.maxProbeDepth} ref="maxProbeDepth" floatingLabelText="Max Probe Depth" /></GridTile>
        <GridTile key={3} cols={1} rows={1}><TextField style={{width: 120}}  defaultValue={this.props.home.state.millingjob.clearance} ref="clearance" floatingLabelText="Probe Clearance" /></GridTile>
        <GridTile key={4} cols={1} rows={1}><TextField style={{width: 110}}  defaultValue={this.props.home.state.millingjob.gridOffsetMinX} ref="gridOffsetMinX" floatingLabelText="<- X" /></GridTile>
        <GridTile key={5} cols={1} rows={1}><TextField style={{width: 110}}  defaultValue={this.props.home.state.millingjob.gridOffsetMaxX} ref="gridOffsetMaxX" floatingLabelText="X ->" /></GridTile>
        <GridTile key={6} cols={1} rows={1}><TextField style={{width: 110}}  defaultValue={this.props.home.state.millingjob.gridOffsetMinY} ref="gridOffsetMinY" floatingLabelText="<-- Y" /></GridTile>
        <GridTile key={7} cols={1} rows={1}><TextField style={{width: 110}}  defaultValue={this.props.home.state.millingjob.gridOffsetMaxY} ref="gridOffsetMaxY" floatingLabelText="Y -->" /></GridTile>
        <GridTile key={8} cols={1} rows={1}><TextField style={{width: 110}}  defaultValue={this.props.home.state.millingjob.gridSize} ref="gridSize" floatingLabelText="Grid" /></GridTile>
        <GridTile style={{marginTop: 15}} key={10} cols={1} rows={1}><DropDownMenu value={this.props.home.state.millingjob.currentLayer} onChange={this._handleLayerChange}>
          {layers}
        </DropDownMenu></GridTile>
        <GridTile key={9} cols={1} rows={1}><FlatButton style={{marginLeft: 10, marginTop: 20}} label="Update Settings" primary={true} onClick={this._handleChange}/></GridTile>
      </GridList>
      <GridList cellHeight={350} cols={6} padding={10} style={{backgroundColor: 'white', borderBottom: "1px solid black"}}>
        <GridTile key={27} cols={4} rows={1} style={{marginLeft: 10}} >{buttons}</GridTile>
        <GridTile key={28} cols={2} rows={1}><SerialMonitor home={this.props.home} rows={10} height={350}/></GridTile>
      </GridList>
      <GridList cellHeight={600} cols={1} padding={1} style={{overflowY: 'auto', backgroundColor: 'white'}}>
        <GridTile key={1} cols={1} rows={1} style={{overflow: 'scroll', height: 600}} titleBackground={"blue"}>
          {canvases}
        </GridTile>
      </GridList>

      </div>
    );
  }
}
