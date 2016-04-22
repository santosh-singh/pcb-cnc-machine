import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import {Grid, Row, Col, Panel, Table, Button, Input} from 'react-bootstrap';
import SerialMonitor from '../components/serialmonitor';

const styles = {
    panel:{
        height: '556px',
        textAlign: 'center'
    },
    xyButton: {
        width: '100%',
        backgroundColor: '#ccc'
    },
    button:{
        width: '100%'
    },
    zButtons: {
        width: '100%'
    },
    flowLeft:{
        display: 'inherit',
        float: 'left',
        height: '70px'
    },
    noBorder:{
        border: 0
    }
}
export default class AdvancedControl extends Component {
  propTypes: {
       home: React.PropTypes.object
  }
  constructor(props) {
      super(props);
  }
  handleClick = (axis, move) => {
    switch (axis){
      case 'getposition':
        this.props.home._addCommand.call(this.props.home, "M114");
        this.props.home._sendCommand.call(this.props.home);
        break;
      case 'motorson':
        this.props.home._addCommand.call(this.props.home, "M17");
        this.props.home._sendCommand.call(this.props.home);
        break;
      case 'motorsoff':
        this.props.home._addCommand.call(this.props.home, "M18");
        this.props.home._sendCommand.call(this.props.home);
        break;
      case 'xhome':
        this.props.home._addCommand.call(this.props.home, "G28 X");
        this.props.home._sendCommand.call(this.props.home);
        break;
      case 'yhome':
        this.props.home._addCommand.call(this.props.home, "G28 Y");
        this.props.home._sendCommand.call(this.props.home);
        break;
      case 'zhome':
        this.props.home._addCommand.call(this.props.home, "G28 Z");
        this.props.home._sendCommand.call(this.props.home);
        break;
      case 'xyhome':
        this.props.home._addCommand.call(this.props.home, "G28 X Y");
        this.props.home._sendCommand.call(this.props.home);
        break;
      case 'xyzhome':
        this.props.home._addCommand.call(this.props.home, "G28 X Y Z");
        this.props.home._sendCommand.call(this.props.home);
        break;
      case 'x':
        this.props.home._addCommand.call(this.props.home, ["G21", "G91", "G0 X"+move+" F"+this.props.home.state.settings.fastfeedrate, "G90"]);
        this.props.home._sendCommand.call(this.props.home);
        break;
      case 'y':
        this.props.home._addCommand.call(this.props.home, ["G21", "G91", "G0 Y"+move+" F"+this.props.home.state.settings.fastfeedrate, "G90"]);
        this.props.home._sendCommand.call(this.props.home);
        break;
      case 'z':
        this.props.home._addCommand.call(this.props.home, ["G21", "G91", "G0 Z"+move+" F"+this.props.home.state.settings.fastfeedrate, "G90"]);
        this.props.home._sendCommand.call(this.props.home);
        break;
      default:
    }
  }
  render() {
    if (["advancedcontrol"].indexOf(this.props.home.state.menu.page)<0) return (null);
    return (
      <div>
        <GridList key={1} cellHeight={40} cols={6} padding={10} style={{padding: 10}}>
          <GridTile key={1} cols={1} rows={1} style={{}}>
            <Input type="text" style={{height: 38}} addonBefore="X" value={this.props.home.state.xposition} ref="xPosition" />
          </GridTile>
          <GridTile key={2} cols={1} rows={1} style={{}}>
            <Input type="text" style={{height: 38}}  addonBefore="Y" value={this.props.home.state.yposition} ref="yPosition" />
          </GridTile>
          <GridTile key={3} cols={1} rows={1} style={{}}>
            <Input type="text" style={{height: 38}} addonBefore="Z" value={this.props.home.state.zposition} ref="zPosition" />
          </GridTile>
          <GridTile key={4} cols={3} rows={1} style={{}}>
            <RaisedButton style={{marginRight: 10, marginTop: 2}} onClick={this.handleClick.bind(this, 'getposition')}>Get Position</RaisedButton>
            <RaisedButton style={{marginRight: 10, marginTop: 2}} primary={true} onClick={this.handleClick.bind(this, 'motorson')}>Motors ON</RaisedButton>
            <RaisedButton style={{marginRight: 10, marginTop: 2}} secondary={true} onClick={this.handleClick.bind(this, 'motorsoff')}>Motors OFF</RaisedButton>
          </GridTile>
        </GridList>
        <GridList key={2} cellHeight={500} cols={5} padding={10} style={{}}>
          <GridTile key={1} cols={1} rows={1} style={{}}>
            <Panel header="Z Control" style={styles.panel}>
              <GridList cellHeight={40} cols={1} padding={10}>
                <GridTile key={1} cols={1} rows={1}><RaisedButton style={styles.zButtons} backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'z', 10)}>+10</RaisedButton></GridTile>
                <GridTile key={2} cols={1} rows={1}><RaisedButton style={styles.zButtons} backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'z', 5)}>+5</RaisedButton></GridTile>
                <GridTile key={3} cols={1} rows={1}><RaisedButton style={styles.zButtons} backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'z', 1)}>+1</RaisedButton></GridTile>
                <GridTile key={4} cols={1} rows={1}><RaisedButton style={styles.zButtons} backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'z', 0.1)}>+0.1</RaisedButton></GridTile>
                <GridTile key={5} cols={1} rows={1}><RaisedButton style={styles.zButtons} backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'zhome', 0)}>Home</RaisedButton></GridTile>
                <GridTile key={6} cols={1} rows={1}><RaisedButton style={styles.zButtons} backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'z', -0.1)}>-0.1</RaisedButton></GridTile>
                <GridTile key={7} cols={1} rows={1}><RaisedButton style={styles.zButtons} backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'z', -1)}>-1</RaisedButton></GridTile>
                <GridTile key={8} cols={1} rows={1}><RaisedButton style={styles.zButtons} backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'z', -5)}>-5</RaisedButton></GridTile>
                <GridTile key={9} cols={1} rows={1}><RaisedButton style={styles.zButtons} backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'z', -10)}>-10</RaisedButton></GridTile>
              </GridList>
            </Panel>
          </GridTile>
          <GridTile key={2} cols={2} rows={1} style={{}}>
            <Panel header="X & Y Control" style={styles.panel}>

              <GridList key={1} cellHeight={40} cols={7} padding={10} style={{padding: 0}}>

                <GridTile key={9} cols={2} rows={1} style={{}}><RaisedButton backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'xhome', 0)} >Home X</RaisedButton></GridTile>
                <GridTile key={10} cols={1} rows={1} style={{}}></GridTile>
                <GridTile key={11} cols={1} rows={1} style={{}}><RaisedButton backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'y', -10)} >-10</RaisedButton></GridTile>
                <GridTile key={12} cols={1} rows={1} style={{}}></GridTile>
                <GridTile key={13} cols={2} rows={1} style={{}}><RaisedButton backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'yhome', 0)} >Home Y</RaisedButton></GridTile>

                <GridTile key={1} cols={1} rows={1} style={{}}></GridTile>
                <GridTile key={2} cols={1} rows={1} style={{}}></GridTile>
                <GridTile key={3} cols={1} rows={1} style={{}}></GridTile>
                <GridTile key={4} cols={1} rows={1} style={{}}><RaisedButton backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'y', -1)} >-1</RaisedButton></GridTile>
                <GridTile key={5} cols={1} rows={1} style={{}}></GridTile>
                <GridTile key={6} cols={1} rows={1} style={{}}></GridTile>
                <GridTile key={7} cols={1} rows={1} style={{}}></GridTile>

                <GridTile key={15} cols={1} rows={1} style={{}}></GridTile>
                <GridTile key={16} cols={1} rows={1} style={{}}></GridTile>
                <GridTile key={17} cols={1} rows={1} style={{}}></GridTile>
                <GridTile key={18} cols={1} rows={1} style={{}}><RaisedButton backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'y', -0.1)} >-0.1</RaisedButton></GridTile>
                <GridTile key={19} cols={1} rows={1} style={{}}></GridTile>
                <GridTile key={20} cols={1} rows={1} style={{}}></GridTile>
                <GridTile key={21} cols={1} rows={1} style={{}}></GridTile>

                <GridTile key={22} cols={1} rows={1} style={{}}><RaisedButton backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'x', -10)} >-10</RaisedButton></GridTile>
                <GridTile key={23} cols={1} rows={1} style={{}}><RaisedButton backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'x', -1)} >-1</RaisedButton></GridTile>
                <GridTile key={24} cols={1} rows={1} style={{}}><RaisedButton backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'x', -0.1)} >-0.1</RaisedButton></GridTile>
                <GridTile key={25} cols={1} rows={1} style={{}}><RaisedButton backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'xyhome', 0)} >X Y</RaisedButton></GridTile>
                <GridTile key={26} cols={1} rows={1} style={{}}><RaisedButton backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'x', +10)} >+10</RaisedButton></GridTile>
                <GridTile key={27} cols={1} rows={1} style={{}}><RaisedButton backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'x', +1)} >+1</RaisedButton></GridTile>
                <GridTile key={28} cols={1} rows={1} style={{}}><RaisedButton backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'x', +0.1)} >+0.1</RaisedButton></GridTile>

                <GridTile key={29} cols={1} rows={1} style={{}}></GridTile>
                <GridTile key={30} cols={1} rows={1} style={{}}></GridTile>
                <GridTile key={31} cols={1} rows={1} style={{}}></GridTile>
                <GridTile key={32} cols={1} rows={1} style={{}}><RaisedButton backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'y', 0.1)} >+0.1</RaisedButton></GridTile>
                <GridTile key={33} cols={1} rows={1} style={{}}></GridTile>
                <GridTile key={34} cols={1} rows={1} style={{}}></GridTile>
                <GridTile key={35} cols={1} rows={1} style={{}}></GridTile>

                <GridTile key={36} cols={1} rows={1} style={{}}></GridTile>
                <GridTile key={37} cols={1} rows={1} style={{}}></GridTile>
                <GridTile key={38} cols={1} rows={1} style={{}}></GridTile>
                <GridTile key={39} cols={1} rows={1} style={{}}><RaisedButton backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'y', 0.1)} >+1</RaisedButton></GridTile>
                <GridTile key={40} cols={1} rows={1} style={{}}></GridTile>
                <GridTile key={41} cols={1} rows={1} style={{}}></GridTile>
                <GridTile key={42} cols={1} rows={1} style={{}}></GridTile>

                <GridTile key={43} cols={2} rows={1} style={{}}><RaisedButton backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'zhome', 0)} >Home Z</RaisedButton></GridTile>
                <GridTile key={44} cols={1} rows={1} style={{}}></GridTile>
                <GridTile key={45} cols={1} rows={1} style={{}}><RaisedButton backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'y', 10)} >+10</RaisedButton></GridTile>
                <GridTile key={46} cols={1} rows={1} style={{}}></GridTile>
                <GridTile key={47} cols={2} rows={1} style={{}}><RaisedButton backgroundColor={"#ccc"} onClick={this.handleClick.bind(this, 'xyzhome', 0)} >Home X Y Z</RaisedButton></GridTile>

              </GridList>
            </Panel>
          </GridTile>
          <GridTile key={3} cols={2} rows={1} style={{}}>
            <SerialMonitor home={this.props.home} rows={19} rowsMax={19}/>
          </GridTile>
        </GridList>
      </div>
    );
  }
}
