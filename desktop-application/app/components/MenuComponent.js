import React, { Component, PropTypes } from 'react';
import LeftNav from 'material-ui/lib/left-nav';
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Divider from 'material-ui/lib/divider';
import FontIcon from 'material-ui/lib/font-icon';
import ContentCopy from 'material-ui/lib/svg-icons/content/content-copy';
import ContentLink from 'material-ui/lib/svg-icons/content/link';
import Delete from 'material-ui/lib/svg-icons/action/delete';
import HomeIcon from 'material-ui/lib/svg-icons/action/home';
import AdvancedIcon from 'material-ui/lib/svg-icons/action/open-with';
import ActionSettings from 'material-ui/lib/svg-icons/action/settings';
import Download from 'material-ui/lib/svg-icons/file/file-download';
import ActionVisibility from 'material-ui/lib/svg-icons/action/visibility';
import PersonAdd from 'material-ui/lib/svg-icons/social/person-add';
import RemoveRedEye from 'material-ui/lib/svg-icons/image/remove-red-eye';
import MenuBar from 'material-ui/lib/svg-icons/navigation/menu'
import AppBar from 'material-ui/lib/app-bar';


export default class MenuComponent extends Component {
  propTypes: {
    menu: React.PropTypes.bool.isRequired,
    toggleMenu: React.PropTypes.func.isRequired,
    home: React.propTypes.object.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      title: 'PCB CNC Machine',
      open: false, //true false
      page: 'home' //'settings' 'advancedcontrol' 'millingjob'
    }
  }
  _pages = {
    home: 'PCB CNC Machine',
    serialmonitor: 'Serial Monitor',
    advancedcontrol: 'Advanced Control',
    settings: 'Settings',
    millingfiles: 'Milling Files',
    millingplan: 'Plan The Milling',
    millingjob: 'Milling Job',
  }
  _showMenu = () => {
    this.setState({open: true});
    this.props.home.setState({
      menu: Object.assign({}, this.props.home.state.menu, {
        open: true
      })
    });
  }
  _handleChange = (page) => {
    this.setState({open: false});
    if (page != this.props.home.state.menu.page){
      this.props.home.setState({
        menu: Object.assign({}, this.props.home.state.menu, {
          page: page,
          title: this._pages[page],
          open: false
        })
      });
    }else{
      this.props.home.setState({
        menu: Object.assign({}, this.props.home.state.menu, {
          open: false
        })
      });
    }
  }
  render() {
    return (
      <div>
        <AppBar title={this.props.home.state.menu.title} iconClassNameLeft = "fa fa-3x fa-bars" onLeftIconButtonTouchTap={this._showMenu}/>
        <LeftNav docked={true} width={400} open={this.state.open}>
            <Menu value={this.props.home.state.menu.page}>
                  <MenuItem primaryText="Home" leftIcon={<HomeIcon />} value={"home"}
                    onTouchTap={()=>{this._handleChange('home')}}/>
                  <MenuItem primaryText="Serial Monitor" leftIcon={<ActionVisibility />} value={"serialmonitor"}
                    onTouchTap={()=>{this._handleChange('serialmonitor')}}/>
                  <MenuItem primaryText="Advanced Control" leftIcon={<AdvancedIcon />} value={"advancedcontrol"}
                    onTouchTap={()=>{this._handleChange('advancedcontrol')}}/>
                  <MenuItem primaryText="Settings" leftIcon={<ActionSettings />} value={"settings"}
                    onTouchTap={()=>{this._handleChange('settings')}}/>
                  <Divider />
                  <MenuItem primaryText="Milling Files" leftIcon={<ContentCopy />} value={"millingfiles"}
                    onTouchTap={()=>{this._handleChange('millingfiles')}}/>
                  <MenuItem primaryText="Plan The Milling" leftIcon={<ContentCopy />} value={"millingplan"}
                    onTouchTap={()=>{this._handleChange('millingplan')}}/>
                  <MenuItem primaryText="Milling Job" leftIcon={<ContentCopy />} value={"millingjob"}
                    onTouchTap={()=>{this._handleChange('millingjob')}}/>
            </Menu>
        </LeftNav>
      </div>
    );
  }
}
