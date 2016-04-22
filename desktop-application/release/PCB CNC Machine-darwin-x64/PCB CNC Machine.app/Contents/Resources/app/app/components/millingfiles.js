import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import {Panel, ListGroup, ListGroupItem} from 'react-bootstrap';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';

import MillingFilesData from '../components/millingfilesdata';

export default class MillingFiles extends Component {
  propTypes: {
    home: React.PropTypes.object
  }
  constructor(props) {
    super(props);
  }
  _handleChange = (file, e) =>{
    var filename = e.target.value;
    if (file == "bef"){
      var reader = new FileReader();
      reader.onload = function(){
        var text = reader.result;
        this.props.home.setState(Object.assign({}, this.props.home.state, {
          millingplan: Object.assign({}, this.props.home.state.millingplan,
            {reProcessBEFile: true}),
          millingfiles: Object.assign({}, this.props.home.state.millingfiles, {
            bottomEFileText:filename,
            bottomEFile:text.split("\n")
          })
        }));
      }.bind(this);
      reader.readAsText(e.target.files[0]);
    }else if (file == 'tef'){
      var reader = new FileReader();
      reader.onload = function(){
        var text = reader.result;
        this.props.home.setState(Object.assign({}, this.props.home.state, {
          millingplan: Object.assign({}, this.props.home.state.millingplan,
            {reProcessTEFile: true}),
          millingfiles: Object.assign({}, this.props.home.state.millingfiles, {
            topEFileText:filename,
            topEFile:text.split("\n")
          })
        }));
      }.bind(this);
      reader.readAsText(e.target.files[0]);
    }else if (file == 'thf'){
      var reader = new FileReader();
      reader.onload = function(){
        var text = reader.result;
        this.props.home.setState(Object.assign({}, this.props.home.state, {
          millingplan: Object.assign({}, this.props.home.state.millingplan,
            {reProcessTHFile: true}),
          millingfiles: Object.assign({}, this.props.home.state.millingfiles, {
            topHFileText:filename,
            topHFile:text.split("\n")
          })
        }));
      }.bind(this);
      reader.readAsText(e.target.files[0]);
    }else if (file == 'tmf'){
      var reader = new FileReader();
      reader.onload = function(){
        var text = reader.result;
        this.props.home.setState(Object.assign({}, this.props.home.state, {
          millingplan: Object.assign({}, this.props.home.state.millingplan,
            {reProcessTMFile: true}),
          millingfiles: Object.assign({}, this.props.home.state.millingfiles, {
            topMFileText:filename,
            topMFile:text.split("\n")
          })
        }));
      }.bind(this);
      reader.readAsText(e.target.files[0]);
    }
  }
  _openFileDialog = (file) => {
    if (file == "bef"){
      var fileUploadDom = ReactDom.findDOMNode(this.refs.bottomEFile);
      fileUploadDom.click();
    }else if (file == 'tef'){
      var fileUploadDom = ReactDom.findDOMNode(this.refs.topEFile);
      fileUploadDom.click();
    }else if (file == 'thf'){
      var fileUploadDom = ReactDom.findDOMNode(this.refs.topHFile);
      fileUploadDom.click();
    }else if (file == 'tmf'){
      var fileUploadDom = ReactDom.findDOMNode(this.refs.topMFile);
      fileUploadDom.click();
    }
  }
  _clearFile = (file) =>{
    var store = this.context.store;
    if (file == "bef"){
      var fileUploadDom = ReactDom.findDOMNode(this.refs.bottomEFile);
      fileUploadDom.value = '';
      this.props.home.setState({
        millingfiles: Object.assign({}, this.props.home.state.millingfiles, {
          bottomEFileText:'',
          bottomEFile:[]
        }),
        millingplan: Object.assign({}, this.props.home.state.millingplan, {
          reProcessBEFile: true
        })
      });
    }else if (file == 'tef'){
      var fileUploadDom = ReactDom.findDOMNode(this.refs.topEFile);
      fileUploadDom.value = '';
      this.props.home.setState({
        millingfiles: Object.assign({}, this.props.home.state.millingfiles, {
          topEFileText:'',
          topEFile:[]
        }),
        millingplan: Object.assign({}, this.props.home.state.millingplan, {
          reProcessTEFile: true
        })
      });
    }else if (file == 'thf'){
      var fileUploadDom = ReactDom.findDOMNode(this.refs.topHFile);
      fileUploadDom.value = '';
      this.props.home.setState({
        millingfiles: Object.assign({}, this.props.home.state.millingfiles, {
          topHFileText:'',
          topHFile:[]
        }),
        millingplan: Object.assign({}, this.props.home.state.millingplan, {
          reProcessTHFile: true
        })
      });
    }else if (file == 'tmf'){
      var fileUploadDom = ReactDom.findDOMNode(this.refs.topMFile);
      fileUploadDom.value = '';
      this.props.home.setState({
        millingfiles: Object.assign({}, this.props.home.state.millingfiles, {
          topMFileText:'',
          topMFile:[]
        }),
        millingplan: Object.assign({}, this.props.home.state.millingplan, {
          reProcessTMFile: true
        })
      });
    }
  }
  _openFileDialog = (file) => {
    if (file == "bef"){
      var fileUploadDom = ReactDom.findDOMNode(this.refs.bottomEFile);
      fileUploadDom.click();
    }else if (file == 'tef'){
      var fileUploadDom = ReactDom.findDOMNode(this.refs.topEFile);
      fileUploadDom.click();
    }else if (file == 'thf'){
      var fileUploadDom = ReactDom.findDOMNode(this.refs.topHFile);
      fileUploadDom.click();
    }else if (file == 'tmf'){
      var fileUploadDom = ReactDom.findDOMNode(this.refs.topMFile);
      fileUploadDom.click();
    }
  }
  render() {
    if (["millingfiles"].indexOf(this.props.home.state.menu.page)<0) return (null);
    return (
      <div>
      <GridList key={1} cellHeight={800} cols={5} padding={10} style={{margin: 0}}>
        <GridTile key={1} cols={2} rows={1} style={{}}>
          <Panel header="Select Files">
            <ListGroup>
              <ListGroupItem header="Bottom Etch File"/>
              <ListGroupItem>
                <TextField hintText="Select File" ref="bottomEFileText" value={this.props.home.state.millingfiles.bottomEFileText}/>
                <RaisedButton style={{marginLeft: 10}}
                  label="Open File" primary={true}
                  onClick={this._openFileDialog.bind(this, 'bef')}/>
                <RaisedButton style={{marginLeft: 10}}
                  label="Clear" secondary={true}
                  onClick={this._clearFile.bind(this, 'bef')}/>
                <input
                  ref="bottomEFile"
                  type="file"
                  style={{"display" : "none"}}
                  onChange={this._handleChange.bind(this, 'bef')}/>
              </ListGroupItem>
            </ListGroup>
            <ListGroup>
              <ListGroupItem header="Top Etch File"/>
              <ListGroupItem>
                <TextField name="topEFileText" hintText="Select File" ref="topEFileText" value={this.props.home.state.millingfiles.topEFileText}/>
                <RaisedButton style={{marginLeft: 10}}
                  label="Open File" primary={true}
                  onClick={this._openFileDialog.bind(this, 'tef')}/>
                <RaisedButton style={{marginLeft: 10}}
                  label="Clear" secondary={true}
                  onClick={this._clearFile.bind(this, 'tef')}/>
                <input
                  ref="topEFile"
                  type="file"
                  style={{"display" : "none"}}
                  onChange={this._handleChange.bind(this, 'tef')}/>
              </ListGroupItem>
            </ListGroup>
            <ListGroup>
              <ListGroupItem header="Top Holes File"/>
              <ListGroupItem>
                <TextField name="topHFileText" hintText="Select File" ref="topHFileText" value={this.props.home.state.millingfiles.topHFileText}/>
                <RaisedButton style={{marginLeft: 10}}
                  label="Open File" primary={true}
                  onClick={this._openFileDialog.bind(this, 'thf')}/>
                <RaisedButton style={{marginLeft: 10}}
                  label="Clear" secondary={true}
                  onClick={this._clearFile.bind(this, 'thf')}/>
                <input
                  ref="topHFile"
                  type="file"
                  style={{"display" : "none"}}
                  onChange={this._handleChange.bind(this, 'thf')}/>
              </ListGroupItem>
            </ListGroup>
            <ListGroup>
              <ListGroupItem header="Top Milling File"/>
              <ListGroupItem>
                <TextField name="topMFileText" hintText="Select File" ref="topMFileText" value={this.props.home.state.millingfiles.topMFileText}/>
                <RaisedButton style={{marginLeft: 10}}
                  label="Open File" primary={true}
                  onClick={this._openFileDialog.bind(this, 'tmf')}/>
                <RaisedButton style={{marginLeft: 10}}
                  label="Clear" secondary={true}
                  onClick={this._clearFile.bind(this, 'tmf')}/>
                <input
                  ref="topMFile"
                  type="file"
                  style={{"display" : "none"}}
                  onChange={this._handleChange.bind(this, 'tmf')}/>
              </ListGroupItem>
            </ListGroup>
          </Panel>
        </GridTile>
        <GridTile key={2} cols={3} rows={1} style={{}}>
          <MillingFilesData rows={20} rowsMax={20} home={this.props.home}/>
        </GridTile>
      </GridList>
      </div>
    );
  }
}
