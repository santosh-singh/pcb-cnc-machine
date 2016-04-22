import React, { Component, PropTypes } from 'react';
import FontIcon from 'material-ui/lib/font-icon';
import MenuItem from 'material-ui/lib/menus/menu-item';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import TextField from 'material-ui/lib/text-field';
import AutoComplete from 'material-ui/lib/auto-complete';
import Divider from 'material-ui/lib/divider';
import Paper from 'material-ui/lib/paper';
import SelectField from 'material-ui/lib/select-field';
import ContentSend from 'material-ui/lib/svg-icons/content/send';
import Snackbar from 'material-ui/lib/snackbar';
import {Label} from 'react-bootstrap';

export default class SerialControl extends Component {
    propTypes: {
        home: PropTypes.object.isRequired
    }
    constructor(props) {
      super(props);
    }
    refresh = () => {
      this.props.home._refreshPorts.call(this.props.home);
    }
    componentDidUnMount= ()=>{
    }
    handlePortChange = (event, index, value) => {
      this.props.home.setState({serialcontrol: Object.assign({}, this.props.home.state.serialcontrol, {
        selectedPort: value
      })});
    }
    handleBaudrateChange = (event, index, value) => {
      this.props.home.setState({serialcontrol: Object.assign({}, this.props.home.state.serialcontrol, {
        selectedBaudrate: value
      })});
    }
    _connect = () => {
      this.props.home._connect.call(this.props.home, this.props.home.state.serialcontrol.selectedPort, this.props.home.state.serialcontrol.selectedBaudrate);
    }
    _disconnect = () => {
        this.props.home._disconnect.call(this.props.home);
    }
    _send = (e) => {
        var val = this.refs.sendText.getValue();
        this.refs.sendText.searchText = "";
        this.refs.sendText.blur();
        this.props.home._addCommand.call(this.props.home, val);
        this.props.home._sendCommand.call(this.props.home);
    }
    _baudrateList = () => {
      let b = [];
      for (let i = 0; i < this.props.home.state.baudrates.length; i++) {
          b.push(<MenuItem key={"baudrate_"+i} value={this.props.home.state.baudrates[i]} primaryText={this.props.home.state.baudrates[i]} label={this.props.home.state.baudrates[i]}/>);
      }
      return b;
    }
    _portList = () => {
      let items = [];
      for (let i = 0; i < this.props.home.state.ports.length; i++) {
          items.push(<MenuItem key={"port_"+i} value={this.props.home.state.ports[i].comName} primaryText={this.props.home.state.ports[i].comName} label={this.props.home.state.ports[i].comName}/>);
      }
      return items;
    }
    _portLabel = () => {
      return "Connected to: "+this.props.home.state.connectionPort+" "+this.props.home.state.connectionBaudrate;
    }
    render() {
      if (["millingplan", "millingfiles", "millingjob", "advancedcontrol", "serialmonitor"].indexOf(this.props.home.state.menu.page)<0) return (null);
        var buttons;
        if (this.props.home.state.serialcontrol.selectedPort == "none"){
            buttons = <RaisedButton label="Connect" default={true} disabled={true}/>
        }else if (this.props.home.state.isConnected){
            buttons = <RaisedButton label="Disconnect" secondary={true} onTouchTap={this._disconnect}/>
        }else{
            buttons = <RaisedButton label="Connect" primary={true} onTouchTap={this._connect}/>
        }
        var ports = this._portList();
        var baudrates = this._baudrateList();
        var label = this._portLabel();
        if (this.props.home.state.isConnected){
            return (
                <div>
                <Toolbar style={{paddingLeft: 10, paddingRight: 10}}>
                    <ToolbarGroup float="left">
                      <TextField
                        style={{float:'left'}}
                        fullWidth={false}
                          ref="sendText"
                          onKeyDown={this.send}
                        />
                      <RaisedButton label="Send" primary={true} onTouchTap={this._send}/>
                    </ToolbarGroup>
                    <ToolbarGroup float="right">
                        <FlatButton
                          label={label}
                          secondary={true}
                          disabled={true}
                          icon={<FontIcon className="muidocs-icon-custom-github" />}
                        />
                        {buttons}
                    </ToolbarGroup>
                </Toolbar>
                </div>
            );
        }else{
            return (
            <div>
                <Paper zDepth={1}>
                <Toolbar>
                    <ToolbarGroup firstChild={true} float="left">
                        <DropDownMenu value={this.props.home.state.serialcontrol.selectedPort} onChange={this.handlePortChange}>
                            {ports}
                        </DropDownMenu>
                        <DropDownMenu value={this.props.home.state.serialcontrol.selectedBaudrate}  onChange={this.handleBaudrateChange}>
                            {baudrates}
                        </DropDownMenu>
                        <ToolbarSeparator />
                        <RaisedButton label="Refresh Ports" default={true} onTouchTap={this.refresh}/>
                    </ToolbarGroup>
                    <ToolbarGroup float="right">
                        {buttons}
                    </ToolbarGroup>
                </Toolbar>
                </Paper>
            </div>
            );

        }
    }
}
