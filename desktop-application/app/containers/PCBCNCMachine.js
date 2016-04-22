import React, { Component } from 'react';
import serialport from 'serialport';
//components
import * as SerialConnection from '../actions/serialconnection';
import Menu from '../components/MenuComponent';
import Home from '../components/Home';
import SerialControl from '../components/serialcontrol';
import SerialMonitor from '../components/serialmonitor';
import AdvancedControl from '../components/advancedcontrol';
import MillingControl from '../components/millingcontrol';
import MillingFiles from '../components/millingfiles';
import MillingPlan from '../components/millingplan';
import MillingJob from '../components/millingjob';
//controls
import Paper from 'material-ui/lib/paper';

export default class PCBCNCMachine extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    store: React.PropTypes.object
  }
  propTypes: {
      route: React.PropTypes.string
  }
  constructor(props) {
    super(props);
    this.state = {
      menu: {
        title: 'PCB CNC Machine',
        open: false, //true false
        page: 'home' //'settings' 'advancedcontrol' 'millingjob'
      },
      ports: [{comName: 'Simulator'}],
      baudrates: [9600, 19200, 38400, 57600, 74880, 115200, 230400, 250000],
      isConnected: false,
      connectionPort: '',
      connectionBaudrate: 115200,
      logs: [{date: new Date, from: 'PCBCNCMachine', message: "Welcome to PCB CNC Machine"}],
      commandLogs: [],
      showOutgoing: true,
      showIncoming: true,
      xposition: 0.00,
      yposition: 0.00,
      zposition: 0.00,
      serialcontrol: {
        selectedPort: 'Simulator',
        selectedBaudrate: 115200
      },
      settings: {
        fastfeedrate: 600.00
      },
      millingcontrol: {
        boardX : 0,
        boardY : 0,
        boardHeight : 100,
        boardWidth : 70,
        canvasHeight : 200,
        canvasWidth : 200,
        cuttingX : 5,
        cuttingY : 5
      },
      millingfiles: {
        bottomEFileText: '',
        topEFileText: '',
        topHFileText: '',
        topMFileText: '',
        bottomEFile: [],
        topEFile: [],
        topHFile: [],
        topMFile: []
      },
      millingfilesdata: {
        tab: 'bef'
      },
      millingplan:{
        tab: 'bef',
        bottomELines: [],
        topELines: [],
        topHLines: [],
        topMLines: [],
        bottomELevels: ["none"],
        topELevels: ["none"],
        topHLevels: ["none"],
        topMLevels:["none"],
        bottomELevel: '',
        topElevel: '',
        topHLevel: '',
        topMLevel: '',
        reProcessBEFile: false,
        reProcessTEFile: false,
        reProcessTHFile: false,
        reProcessTMFile: false,
        redrawBEFile: false,
        redrawTEFile: false,
        redrawTHFile: false,
        redrawTMFile: false,
        redrawAll: false
      },
      millingjob: {
        gridSize: 10,
        gridOffsetMinX: 0,
        gridOffsetMinY: 0,
        gridOffsetMaxX: 0,
        gridOffsetMaxY: 0,
        probeSpeed: 10,
        safeDepth: 20,
        maxProbeDepth: 10,
        clearance: 5,
        autolevelBottom: [],
        autolevelBottomMinmax: {minx: 0, maxx: 0, miny:0, maxy:0},
        autolevelTop: [],
        autolevelTopMinmax: {minx: 0, maxx: 0, miny:0, maxy:0},
        autolevelState: '',
        seekZero: false,
        lastZero: 0.00,
        setZero: 9999,
        receivedPostion: false,
        millingState: 'idle',
        millingProgress: 0,
        millingLastZero: 0,
        millingGCodes: [],
        lastActionFile: '',
        bottomEGcode: [],
        topEGcode: [],
        topHGcode: [],
        topMGcode: [],
        redrawBEFile: false,
        redrawTEFile: false,
        redrawTHFile: false,
        redrawTMFile: false,
        redrawAll: false,
        redrawAutolevel: false,
        rebuildAutolevel: false,
        currentLayer: null,
      }
    }
  }
  serialconnection = {
    sp: null,
    queue: [],
    commandPending: false,
    lastCommand: null,
    commandResponse: [],
    isSimulator: false
  }
  render() {
    var home= 'hidden';
    var serialmonitor= 'hidden';
    var advancedcontrol= 'hidden';
    var millingfiles= 'hidden';
    var millingplan= 'hidden';
    var millingjob= 'hidden';
    var settings = 'hidden';

    switch (this.state.menu.page){
      case "home":
        home = '';
        break;
      case "serialmonitor":
        serialmonitor = '';
        break;
      case "advancedcontrol":
        advancedcontrol = '';
        break;
      case "millingfiles":
        millingfiles = '';
        break;
      case "millingplan":
        millingplan = '';
        break;
      case "millingjob":
        millingjob = '';
        break;
      case "settings":
        settings = '';
        break;
    }
    if (["serialmonitor"].indexOf(this.state.menu.page)<0) {
      return(

        <div>
              <Menu home={this}/>
              <SerialControl home={this}/>
              <MillingControl home={this}/>
              <MillingPlan home={this}/>
              <MillingFiles home={this}/>
              <MillingJob home={this}/>
              <AdvancedControl home={this}/>
              <Home home={this}/>
          </div>
        );

    }else{
      return(
          <div>
              <Menu home={this}/>
              <SerialControl home={this}/>
              <SerialMonitor rows={10} home={this}/>
              <MillingControl home={this}/>
              <MillingPlan home={this}/>
              <MillingFiles home={this}/>
              <MillingJob home={this}/>
              <AdvancedControl home={this}/>
              <Home home={this}/>
          </div>
        );
    }
  }
  _refreshPorts = () => {
    serialport.list(function (err, portlist) {
      portlist.unshift({comName: 'Simulator'});
      console.log("ports refreshed", portlist);
      this.setState({ports: portlist});
    }.bind(this));
  }
  _connect = (port, baudrate) => {
    SerialConnection.connect.call(this, port, baudrate);
  }
  _disconnect = () => {
    SerialConnection.disconnect.call(this);
  }
  _addCommand = (data) => {
    // console.log("command added: ", data);
    SerialConnection.add.call(this, data);
  }
  _addLog = (line, from) => {
    if (typeof from === "undefined") from = "PCBCNCMachine";
    var logs = this.state.logs;
    logs.unshift({date: new Date(), from: from, message: line, error: false});
    this.setState({logs: logs});
  }
  _addErrorLog = (line, from) => {
    if (typeof from === "undefined") from = "PCBCNCMachine";
    var logs = this.state.logs;
    logs.unshift({date: new Date(), from: from, message: line, error: true});
    this.setState({logs: logs});
  }
  _addCommandLog = (line) => {
    var logs = this.state.commandLogs;
    logs.unshift(line);
    this.setState({commandLogs: logs});
  }
  _sendCommand = (isZero) => {
    this._waitPreviousCommand.call(this, function(isZero) {
      // console.log("waiting over");
      SerialConnection.send.call(this, isZero);
    }.bind(this), isZero);
  }
  _waitPreviousCommand = (callback, isZero) => {
    // console.log("waiting ..... ");
    if (this.serialconnection.commandPending){
        window.setTimeout(this._waitPreviousCommand.bind(this, callback, isZero), 1);
    }else{
      callback(isZero);
    }
  }
}
