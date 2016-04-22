import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import SelectField from 'material-ui/lib/select-field';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import Paper from 'material-ui/lib/paper';
import MenuItem from 'material-ui/lib/menus/menu-item';

const styles = {
  tab:{
    backgroundColor: '#028494',
    overflow: scroll
  }
}
export default class MillingPlan extends Component {
  propTypes: {
    home: React.PropTypes.object
  }
  constructor(props) {
      super(props);
      this.state = {
        reProcessBEFile: false,
        reProcessTEFile: false,
        reProcessTHFile: false,
        reProcessTMFile: false,
        redrawBEFile: false,
        redrawTEFile: false,
        redrawTHFile: false,
        redrawTMFile: false
      }
  }
  _drawCanvas = (ctx, canvas) => {
    if (canvas){
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
  _drawBoard = (ctx, canvas) => {
    if (canvas){
      var origShadowColor = ctx.shadowColor;
      ctx.shadowColor = "black";
      ctx.shadowOffsetX = 3;
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#D4CF39";
      ctx.fillRect((this.props.home.state.millingcontrol.boardX*10+10), (this.props.home.state.millingcontrol.boardY*10+10), this.props.home.state.millingcontrol.boardWidth*10, this.props.home.state.millingcontrol.boardHeight*10);
      ctx.shadowColor = origShadowColor;
    }
  }
  _drawBEFile = (level)=>{
    if (this._befCanvas){
      let ctx = this._befCanvas.getContext("2d");
      this._drawCanvas(ctx, this._befCanvas);
      this._drawBoard(ctx, this._befCanvas);
      this._drawGcode(ctx, this._befCanvas, this.props.home.state.millingplan.bottomELines, this.props.home.state.millingplan.bottomELevels, level, true);
    }
  }
  _drawTEFile = (level)=>{
    if (this._tefCanvas){
      let ctx = this._tefCanvas.getContext("2d");
      this._drawCanvas(ctx, this._tefCanvas);
      this._drawBoard(ctx, this._tefCanvas);
      this._drawGcode(ctx, this._tefCanvas, this.props.home.state.millingplan.topELines, this.props.home.state.millingplan.topELevels, level);
    }
  }
  _drawTHFile = (level)=>{
    if (this._thfCanvas){
      let ctx = this._thfCanvas.getContext("2d");
      this._drawCanvas(ctx, this._thfCanvas);
      this._drawBoard(ctx, this._thfCanvas);
      this._drawGcode(ctx, this._thfCanvas, this.props.home.state.millingplan.topHLines, this.props.home.state.millingplan.topHLevels, level);
    }
  }
  _drawTMFile = (level)=>{
    if (this._tmfCanvas){
      let ctx = this._tmfCanvas.getContext("2d");
      this._drawCanvas(ctx, this._tmfCanvas);
      this._drawBoard(ctx, this._tmfCanvas);
      this._drawGcode(ctx, this._tmfCanvas, this.props.home.state.millingplan.topMLines, this.props.home.state.millingplan.topMLevels, level);
    }
  }
  _befCanvas=null;
  _tefCanvas=null;
  _thfCanvas=null;
  _tmfCanvas=null;
  _handleTabChange = (value) => {
    this.props.home.setState({millingplan: Object.assign({}, this.props.home.state.millingplan, {
      tab:value
    })});
  };
  componentDidMount = () => {
    // console.log("componentDidMount called", this.props.home.state.millingplan);
    this._drawBEFile(this.props.home.state.millingplan.bottomELevel);
    this._drawTEFile(this.props.home.state.millingplan.topELevel);
    this._drawTHFile(this.props.home.state.millingplan.topHLevel);
    this._drawTMFile(this.props.home.state.millingplan.topMLevel);
    this.processUpdates(this.props);
  }
  processUpdates = (nextProps) => {
    var millingplan = {};
    var millingjob = {};
    if (nextProps.home.state.millingplan.redrawBEFile || nextProps.home.state.millingplan.redrawAll){
      this._drawBEFile(this.props.home.state.millingplan.bottomELevel);
      millingplan.redrawBEFile= false;
      millingplan.redrawAll= false;
    }
    if (nextProps.home.state.millingplan.redrawTEFile || nextProps.home.state.millingplan.redrawAll){
      this._drawTEFile(this.props.home.state.millingplan.topELevel);
      millingplan.redrawTEFile = false;
      millingplan.redrawAll= false;
    }
    if (nextProps.home.state.millingplan.redrawTHFile || nextProps.home.state.millingplan.redrawAll){
      this._drawTHFile(this.props.home.state.millingplan.topHLevel);
      millingplan.redrawTHFile = false;
      millingplan.redrawAll= false;
    }
    if (nextProps.home.state.millingplan.redrawTMFile || nextProps.home.state.millingplan.redrawAll){
      this._drawTMFile(this.props.home.state.millingplan.topMLevel);
      millingplan.redrawTMFile = false;
      millingplan.redrawAll= false;
    }
    if (nextProps.home.state.millingplan.reProcessBEFile){
      var ret = this._processGcode(this.props.home.state.millingfiles.bottomEFile, true)
      millingplan.bottomELines = ret.lines;
      millingplan.bottomELevels = ret.levels;
      millingplan.bottomELevel = ret.level;
      millingplan.redrawBEFile = true;
      millingplan.reProcessBEFile = false;
      millingjob.bottomEGcode = ret.gcode;
      millingjob.redrawBEFile = true;
      millingjob.currentLayer = 'bottomlayer';
    }
    if (nextProps.home.state.millingplan.reProcessTEFile){
      var ret = this._processGcode(this.props.home.state.millingfiles.topEFile);
      millingplan.topELines = ret.lines;
      millingplan.topELevels = ret.levels;
      millingplan.topELevel = ret.level;
      millingplan.redrawTEFile = true;
      millingplan.reProcessTEFile = false;
      millingjob.topEGcode = ret.gcode;
      millingjob.redrawTEFile = true;
      millingjob.currentLayer = 'toplayer';
    }
    if (nextProps.home.state.millingplan.reProcessTHFile){
      var ret = this._processGcode(this.props.home.state.millingfiles.topHFile);
      millingplan.topHLines = ret.lines;
      millingplan.topHLevels = ret.levels;
      millingplan.topHLevel = ret.level;
      millingplan.redrawTHFile = true;
      millingplan.reProcessTHFile = false;
      millingjob.topHGcode = ret.gcode;
      millingjob.redrawTHFile = true;
      millingjob.currentLayer = 'toplayer';
    }
    if (nextProps.home.state.millingplan.reProcessTMFile){
      var ret = this._processGcode(this.props.home.state.millingfiles.topMFile);
      millingplan.topMLines = ret.lines;
      millingplan.topMLevels = ret.levels;
      millingplan.topMLevel = ret.level;
      millingplan.redrawTMFile = true;
      millingplan.reProcessTMFile = false;
      millingjob.topMGcode = ret.gcode;
      millingjob.redrawTMFile = true;
      millingjob.currentLayer = 'toplayer';
    }
    if (Object.keys(millingplan).length>0 || Object.keys(millingjob).length>0){
      nextProps.home.setState(Object.assign({}, nextProps.home.state, {
        millingplan: Object.assign({}, nextProps.home.state.millingplan, millingplan),
        millingjob: Object.assign({}, nextProps.home.state.millingjob, millingjob),
      }));
    }
  }
  componentDidUpdate = (nextProps, nextState) => {
    // console.log("componentWillUpdate called", nextProps.home.state.millingplan);
    this.processUpdates(nextProps);
  }
  _handleLevelChange = (layer, event, index, value) => {
    var millingplan = this.props.home.state.millingplan;
    switch (layer){
      case "bef":
        this.props.home.setState({millingplan: Object.assign({}, this.props.home.state.millingplan, {
          bottomELevel: value,
          redrawBEFile: true
        })});
        break;
      case "tef":
        this.props.home.setState({millingplan: Object.assign({}, this.props.home.state.millingplan, {
          topELevel: value,
          redrawTEFile: true
        })});
        break;
      case "thf":
        this.props.home.setState({millingplan: Object.assign({}, this.props.home.state.millingplan, {
          topHLevel: value,
          redrawTHFile: true
        })});
        break;
      case "tmf":
        this.props.home.setState({millingplan: Object.assign({}, this.props.home.state.millingplan, {
          topMLevel: value,
          redrawTMFile: true
        })});
        break;
      default:
    }
  }
  render() {
    if (["millingplan"].indexOf(this.props.home.state.menu.page)<0) return (null);
    var bottomELevels = []
    for (var i=0; i<this.props.home.state.millingplan.bottomELevels.length; i++){
        bottomELevels.push(<MenuItem key={i} value={this.props.home.state.millingplan.bottomELevels[i]} primaryText={this.props.home.state.millingplan.bottomELevels[i]}/>);
    }
    var topELevels = []
    for (var i=0; i<this.props.home.state.millingplan.topELevels.length; i++){
        topELevels.push(<MenuItem key={i} value={this.props.home.state.millingplan.topELevels[i]} primaryText={this.props.home.state.millingplan.topELevels[i]}/>);
    }
    var topHLevels = []
    for (var i=0; i<this.props.home.state.millingplan.topHLevels.length; i++){
        topHLevels.push(<MenuItem key={i} value={this.props.home.state.millingplan.topHLevels[i]} primaryText={this.props.home.state.millingplan.topHLevels[i]}/>);
    }
    var topMLevels = []
    for (var i=0; i<this.props.home.state.millingplan.topMLevels.length; i++){
        topMLevels.push(<MenuItem key={i} value={this.props.home.state.millingplan.topMLevels[i]} primaryText={this.props.home.state.millingplan.topMLevels[i]}/>);
    }
    return (
      <div>
        <Tabs onChange={this._handleTabChange.bind(this)} value={this.props.home.state.millingplan.tab}>
          <Tab style={styles.tab} value={"bef"} label="Bottom Etch File">
            <GridList cellHeight={70} cols={1} padding={0}>
              <GridTile key={0} cols={1} rows={1} titleBackground={"#deffee"} >
                <Paper style={{margin:0}}>
                  <SelectField style={{marginLeft: 20}}  value={this.props.home.state.millingplan.bottomELevel} onChange={this._handleLevelChange.bind(this, 'bef')} floatingLabelText="Level">
                    {bottomELevels}
                  </SelectField>
                </Paper>
              </GridTile>
              <GridTile key={1} cols={1} rows={1} titleBackground={"#deffee"} style={{overflow: 'scroll', height: 'auto'}}>
                <canvas ref={(c) => this._befCanvas = c} />
              </GridTile>
            </GridList>
          </Tab>
          <Tab style={styles.tab} value={"tef"} label="Top Etch File">
            <GridList cellHeight={70} cols={1} padding={1}>
              <GridTile key={0} cols={1} rows={1} titleBackground={"#deffee"} >
                <Paper style={{margin:0}}>
                  <SelectField style={{marginLeft: 20}} value={this.props.home.state.millingplan.topELevel} onChange={this._handleLevelChange.bind(this, 'tef')} floatingLabelText="Level">
                    {topELevels}
                  </SelectField>
                </Paper>
              </GridTile>
              <GridTile key={1} cols={1} rows={1} titleBackground={"#deffee"} style={{overflow: 'scroll', height: 'auto'}}>
                <canvas ref={(c) => this._tefCanvas = c} />
              </GridTile>
            </GridList>
          </Tab>
          <Tab style={styles.tab} value={"thf"} label="Top Holes File">
            <GridList cellHeight={70} cols={1} padding={1}>
              <GridTile key={0} cols={1} rows={1} titleBackground={"#deffee"} >
                <Paper style={{margin:0}}>
                  <SelectField style={{marginLeft: 20}} value={this.props.home.state.millingplan.topHLevel} onChange={this._handleLevelChange.bind(this, 'thf')} floatingLabelText="Level">
                    {topHLevels}
                  </SelectField>
                </Paper>
              </GridTile>
              <GridTile key={1} cols={1} rows={1} titleBackground={"#deffee"} style={{overflow: 'scroll', height: 'auto'}}>
                <canvas ref={(c) => this._thfCanvas = c} />
              </GridTile>
            </GridList>
          </Tab>
          <Tab style={styles.tab} value={"tmf"} label="Top Milling File">
            <GridList cellHeight={70} cols={1} padding={1}>
              <GridTile key={0} cols={1} rows={1} titleBackground={"#deffee"} >
                <Paper style={{margin:0}}>
                  <SelectField style={{marginLeft: 20}} value={this.props.home.state.millingplan.topMLevel} onChange={this._handleLevelChange.bind(this, 'tmf')} floatingLabelText="Level">
                    {topMLevels}
                  </SelectField>
                </Paper>
              </GridTile>
              <GridTile key={1} cols={1} rows={1} titleBackground={"#deffee"} style={{overflow: 'scroll', height: 'auto'}}>
                <canvas ref={(c) => this._tmfCanvas = c} />
              </GridTile>
            </GridList>
          </Tab>
        </Tabs>
      </div>
    );
  }
}
MillingPlan.prototype._drawGcode = function(ctx, canvas, lines, levels, level, isBottomLayer){
  // ready to draw
  this._drawCanvas(ctx, canvas);
  this._drawBoard(ctx, canvas);
  if (level != undefined){
    var levellines = lines[level];
    if (levellines != undefined){
      ctx.strokeStyle = "#121212";
      ctx.fillStyle = "#0000dd";
      ctx.lineWidth = 1;
      var offsetX = this.props.home.state.millingcontrol.boardX*10+this.props.home.state.millingcontrol.cuttingX*10+10;
      var offsetY = this.props.home.state.millingcontrol.boardY*10+this.props.home.state.millingcontrol.cuttingY*10+10;
      if (isBottomLayer){
        offsetX = Number(this.props.home.state.millingcontrol.boardX*10-this.props.home.state.millingcontrol.cuttingX*10+this.props.home.state.millingcontrol.boardWidth*10+10);
      }
      for (var i=0; i<levellines.length; i++){
        var l = levellines[i];
        if (l.length>1){
          ctx.beginPath();
          ctx.moveTo(offsetX+l[0][0]*10, offsetY+l[0][1]*10);
          for(var j=1; j<l.length; j++){
            ctx.lineTo(offsetX+l[j][0]*10, offsetY+l[j][1]*10);
          }
          ctx.stroke();
        }else if (l.length==1){
          ctx.beginPath();
          ctx.arc(offsetX+l[0][0]*10, offsetY+l[0][1]*10, 1, 0, 2 * Math.PI, false);
          ctx.fill();
          ctx.stroke();
        }
      }
    }
  }else{
    console.log("No level to draw GCODE");
  }
}
MillingPlan.prototype._processGcode = function(data, isBottomLayer){
  var gcodes = [];
  var lines = [];
  var levels = [];
  var thislevel;
  if (data.length>0){
    if (isBottomLayer == undefined) isBottomLayer = false;
    var lastlevel;
    var segment = [];
    var lastx = 0;
    var lasty = 0;
    var offsetX = Number(this.props.home.state.millingcontrol.boardX)+Number(this.props.home.state.millingcontrol.cuttingX);
    var offsetY = Number(this.props.home.state.millingcontrol.boardY)+Number(this.props.home.state.millingcontrol.cuttingY);
    console.log(offsetX, offsetY);
    if (isBottomLayer){
      offsetX = Number(this.props.home.state.millingcontrol.boardX)-Number(this.props.home.state.millingcontrol.cuttingX)+Number(this.props.home.state.millingcontrol.boardWidth);
    }
    for (var i=0; i<data.length; i++){
      var line = data[i];
      if (line.indexOf('(') != 0 && line.indexOf(')') != 0){
        var tokens = line.split(' ');
        if (tokens[0] == 'G00' || tokens[0] == 'G01'){
          var axis= tokens[1].substring(0,1);
          var move = tokens[1].substring(1);
          if (axis == "Z"){
            thislevel = Number(move);
            if (!lastlevel){
              lastlevel = Number(move);
            }
            if (lastlevel != thislevel){
              if (lines[lastlevel] == undefined) lines[lastlevel] = [];
              lines[lastlevel].push(segment);
              if (levels.indexOf(lastlevel)<0){
                levels.push(lastlevel);
              }
              lastlevel = thislevel;
              segment = [];
              segment.push([lastx, lasty]);
            }
            gcodes.push(line);
          }else{
            if (!thislevel) {
              thislevel = 'unknown';
              lastlevel = 'unknown';
              lines[thislevel] = [];
              segment = [];
              levels.push(thislevel);
            }
            lastx = Number(tokens[1].substring(1));
            lasty = Number(tokens[2].substring(1));
            segment.push([lastx, lasty]);
            var t = "";
            for (var m=3; m<tokens.length; m++){
              t += tokens[m];
            }
            gcodes.push("G00 X"+Number(lastx+offsetX).toFixed(4)+" Y"+Number(lasty+offsetY).toFixed(4)+" "+t);
          }
        }else{
          gcodes.push(line);
        }
      }else{
        gcodes.push(line);
      }
    }
    if (lines[lastlevel] == undefined) lines[lastlevel] = [];
    lines[lastlevel].push(segment);
    if (levels.indexOf(lastlevel)<0){
      levels.push(lastlevel);
    }
    if (levels.length>0) thislevel = levels[levels.length-1];
    // console.log({lines: lines, levels: levels, level: thislevel, gcode: gcodes});
  }
  return ({lines: lines, levels: levels, level: thislevel, gcode: gcodes});
}
