import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import SelectField from 'material-ui/lib/select-field';
import Checkbox from 'material-ui/lib/checkbox';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import Paper from 'material-ui/lib/paper';
import MenuItem from 'material-ui/lib/menus/menu-item';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';

export default class MillingControl extends Component {
  propTypes: {
    home : React.PropTypes.object
  }
  constructor(props) {
      super(props);
  }
  _getPosition = (e) => {

  }
  _handleChange = (e) => {
    var state = this.props.home.state;
    this.props.home.setState(Object.assign({}, this.props.home.state, {
      millingcontrol: Object.assign({}, this.props.home.state.millingcontrol,{
        canvasWidth: this.refs.XSize.getValue(),
        canvasHeight: this.refs.YSize.getValue(),
        boardX: this.refs.boardX.getValue(),
        boardY: this.refs.boardY.getValue(),
        boardWidth: this.refs.boardWidth.getValue(),
        boardHeight: this.refs.boardHeight.getValue(),
        cuttingX: this.refs.cuttingX.getValue(),
        cuttingY: this.refs.cuttingY.getValue(),
      }),
      millingplan: Object.assign({}, this.props.home.state.millingplan, {
        redrawAll: true
      })
    }));
  }
  render() {
    if (["millingplan", "millingfiles", "millingjob"].indexOf(this.props.home.state.menu.page)<0) return (null);
    return (
      <div>
        <GridList cellHeight={70} cols={9} padding={10} style={{overflowY: 'auto', backgroundColor: 'white', display: 'inline-flex', width: '100%', margin: 0}}>
          <GridTile key={0} cols={1} rows={1}><TextField style={{width: 130}} defaultValue={this.props.home.state.millingcontrol.canvasWidth} ref="XSize" floatingLabelText="Platform Width" /></GridTile>
          <GridTile key={1} cols={1} rows={1}><TextField style={{width: 130}}  defaultValue={this.props.home.state.millingcontrol.canvasHeight}  ref="YSize" floatingLabelText="Platform Height" /></GridTile>
          <GridTile key={2} cols={1} rows={1}><TextField style={{width: 130}}  defaultValue={this.props.home.state.millingcontrol.boardX} ref="boardX" floatingLabelText="Board Offset X" /></GridTile>
          <GridTile key={3} cols={1} rows={1}><TextField style={{width: 120}}  defaultValue={this.props.home.state.millingcontrol.boardY} ref="boardY" floatingLabelText="Board Offset Y" /></GridTile>
          <GridTile key={4} cols={1} rows={1}><TextField style={{width: 110}}  defaultValue={this.props.home.state.millingcontrol.boardWidth} ref="boardWidth" floatingLabelText="Board Width" /></GridTile>
          <GridTile key={5} cols={1} rows={1}><TextField style={{width: 110}}  defaultValue={this.props.home.state.millingcontrol.boardHeight} ref="boardHeight" floatingLabelText="Board Height" /></GridTile>
          <GridTile key={6} cols={1} rows={1}><TextField style={{width: 110}}  defaultValue={this.props.home.state.millingcontrol.cuttingX} ref="cuttingX" floatingLabelText="Cutting X" /></GridTile>
          <GridTile key={7} cols={1} rows={1}><TextField style={{width: 110}}  defaultValue={this.props.home.state.millingcontrol.cuttingY} ref="cuttingY" floatingLabelText="Cutting Y" /></GridTile>
          <RaisedButton style={{marginTop: 20}} label="Update Settings" primary={true} onClick={this._handleChange}/>
        </GridList>
      </div>
    );
  }
}
