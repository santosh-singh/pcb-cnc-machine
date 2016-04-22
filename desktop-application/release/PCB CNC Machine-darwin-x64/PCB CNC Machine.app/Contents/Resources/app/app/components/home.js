import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';
import NavigationExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/lib/menus/menu-item';
import AppBar from 'material-ui/lib/app-bar';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import RaisedButton from 'material-ui/lib/raised-button';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import TextField from 'material-ui/lib/text-field';
import SerialMonitor from './serialmonitor';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
var dateFormat = require('dateformat');

export default class Home extends Component {
    constructor(props) {
      super(props);
      this.state = {};
    }
    render() {
      if (["home"].indexOf(this.props.home.state.menu.page)<0) return (null);

        return (
            <div>
            <List>
            {this.props.home.state.logs.map( (log, index) => {
              return (
                <ListItem innerDivStyle={{paddingTop: 0, paddingBottom: 5, color: log.error?"red" : 'black'}} key={index} primaryText={log.from + " " + dateFormat(log.date,"dd/mm/yyyy HH:MM:ss") + ": "+log.message}/>
              )
            })}
            </List>

            </div>
        );
    }
}
