import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import TextField from 'material-ui/lib/text-field';
import {Panel} from 'react-bootstrap';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
const styles = {
    fontSize: '0.9em',
    lineHeight: '1.5em'
}
export default class MillingFilesData extends Component {
  propTypes: {
    rowsMax: React.PropTypes.number.isRequired,
    rows: React.PropTypes.number.isRequired,
    home: React.PropTypes.object
  }
  constructor(props) {
      super(props);
  }
  _handleTabChange = (value) => {
    this.props.home.setState({millingfilesdata: Object.assign({}, this.props.home.state.millingfilesdata, {
      tab:value
    })});
  }
  render() {
    if (["millingfiles"].indexOf(this.props.home.state.menu.page)<0) return (null);
    return (
        <Panel header="Milling File Content">
          <Tabs onChange={this._handleTabChange.bind(this)} value={this.props.home.state.millingfilesdata.tab}>
            <Tab value={"bef"} label="Bottom Etch File">
              <TextField
                value={this.props.home.state.millingfiles.bottomEFile.join("\n")}
                multiLine={true}
                rows={this.props.rows}
                rowsMax={this.props.rowsMax}
                fullWidth={true}
                underlineShow={false}
                style={styles}
                name="bottomEFile"
                ref="bottomEFile"
              />
            </Tab>
            <Tab value={"tef"} label="Top Etch File">
              <TextField
                value={this.props.home.state.millingfiles.topEFile.join("\n")}
                multiLine={true}
                rows={this.props.rows}
                rowsMax={this.props.rowsMax}
                fullWidth={true}
                underlineShow={false}
                style={styles}
                name="topEFile"
                ref="topEFile"
              />
            </Tab>
            <Tab value={"thf"} label="Top Holes File">
              <TextField
                value={this.props.home.state.millingfiles.topHFile.join("\n")}
                multiLine={true}
                rows={this.props.rows}
                rowsMax={this.props.rowsMax}
                fullWidth={true}
                underlineShow={false}
                style={styles}
                name="topHFile"
                ref="topHFile"
              />
            </Tab>
            <Tab value={"tmf"} label="Top Milling File">
              <TextField
                value={this.props.home.state.millingfiles.topMFile.join("\n")}
                multiLine={true}
                rows={this.props.rows}
                rowsMax={this.props.rowsMax}
                fullWidth={true}
                underlineShow={false}
                style={styles}
                name="topMFile"
                ref="topMFile"
              />
            </Tab>
        </Tabs>
        </Panel>
    );
  }
}
