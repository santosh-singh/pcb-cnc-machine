import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {Grid, Row, Col, Panel, Table, Button, ButtonGroup, Input} from 'react-bootstrap';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import Divider from 'material-ui/lib/divider';
import Checkbox from 'material-ui/lib/checkbox';
import Toggle from 'material-ui/lib/toggle';
import RaisedButton from 'material-ui/lib/raised-button';

export default class SerialMonitor extends Component {
  propTypes: {
    height: React.PropTypes.number,
    rows: React.PropTypes.number.isRequired,
    home: React.PropTypes.object
  }
  constructor(props) {
    super(props);
  }
  _handleClean = () => {
    this.props.home.setState({commandLogs:[]});
  }
  _handleShowOutgoing = (e, isOn) => {
    this.props.home.setState({showOutgoing: isOn});
  }
  _handleShowIncoming = (e, isOn) => {
    this.props.home.setState({showIncoming: isOn});
  }
  _renderList = () => {
    var logs = [];
    for (var i=0; i<this.props.home.state.commandLogs.length; i++){
      var line = this.props.home.state.commandLogs[i];
      var style = {marginTop: 10, borderBottom: '1px solid #dddddd', color: 'green'};
      if (line.indexOf(">>") == 0){
        if (this.props.home.state.showOutgoing) {
          line = line.substring(2);
          style = {marginTop: 10, borderBottom: '1px solid #dddddd', color: 'blue', fontWeight: 'bold'};
          logs.push (
            <GridTile key={i} cols={1} rows={1} style={style}>
              {line}
            </GridTile>
          );
        }
      }else if (this.props.home.state.showIncoming){
        logs.push(
          <GridTile key={i} cols={1} rows={1} style={style}>
            {line}
          </GridTile>
        );
      }
    }
    return logs;
  }
  render() {
    if (["serialmonitor", "millingjob", "advancedcontrol"].indexOf(this.props.home.state.menu.page)<0) return (null);
    var height = Number(this.props.rows)*22;
    if (this.props.height != undefined) height = this.props.height;
    const monitor = {
        overflowY: 'scroll',
        width: '100%',
        maxHeight: height
    }
    if (this.props.home.state.commandLogs.length==0){
      var style = {marginTop: 1, borderBottom: '1px solid #222', color: '#222'};
      return (
        <div>
          <Panel header={this.props.home.state.connectionPort}>
            <GridList key={1} cellHeight={30} cols={1} padding={5} style={monitor}>
              <GridTile key={1} cols={1} rows={1} style={style}>
                {"No logs to display..."}
              </GridTile>
            </GridList>
          </Panel>
        </div>
      );
    }
    var list = this._renderList();
    return (
        <div>
        <Panel header={this.props.home.state.connectionPort}>
          <GridList key={1} cellHeight={50} cols={3} padding={1}>
            <GridTile key={1} cols={1} rows={1} style={{}}>
              <Toggle key={1} labelStyle={{width: ''}} label="Show Incoming" defaultToggled={this.props.home.state.showIncoming} onToggle={this._handleShowIncoming.bind(this)}/>
            </GridTile>
            <GridTile key={2} cols={1} rows={1} style={{}}>
              <Toggle key={2} labelStyle={{width: ''}} label="Show Outgoing" defaultToggled={this.props.home.state.showOutgoing} onToggle={this._handleShowOutgoing.bind(this)}/>
            </GridTile>
            <GridTile key={4} cols={1} rows={1} style={{float: "right"}}>
              <RaisedButton label="Clear" secondary={true} onTouchTap={this._handleClean.bind(this)}/>
            </GridTile>
          </GridList>
          <Divider />
          <GridList key={2} cellHeight={30} cols={1} padding={5} style={monitor}>
            {list}
          </GridList>
        </Panel>
        </div>
    );
  }
}
