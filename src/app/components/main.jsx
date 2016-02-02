/** In this file, we create a React component which incorporates components provided by material-ui */

import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';
import Dialog from 'material-ui/lib/dialog';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import LightRawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme';
import Colors from 'material-ui/lib/styles/colors';
import FlatButton from 'material-ui/lib/flat-button';
import queryString from 'query-string';

const containerStyle = {
  textAlign: 'center',
  paddingTop: 200,
};

const Main = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getInitialState() {
    return {
      muiTheme: ThemeManager.getMuiTheme(LightRawTheme),
      open: false,
    };
  },

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  },

  componentWillMount() {
    let newMuiTheme = ThemeManager.modifyRawThemePalette(this.state.muiTheme, {
      accent1Color: Colors.deepOrange500,
    });

    this.setState({muiTheme: newMuiTheme});
  },

  _handleRequestClose() {
    this.setState({
      open: false,
    });
  },

  _handleTouchTap() {
    this.setState({
      open: true,
    });
  },

  _handleSendRequestTouchTap(func) {
    this.sendRequest(func);
  },

  sendRequest(remoteFunction) {
    window.fetch(
      'https://api.particle.io/v1/devices/' + this.props.config.device_id + '/' + remoteFunction,
      {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: queryString.stringify({
          access_token: this.props.config.access_token,
          args: '1'
        })
      }
    ).then(function(res) {
      return res.text();
    }.bind(this)).then(function(text) {
      this.setState({ data: text });
    }.bind(this));
  },


  render() {
    const standardActions = (
      <FlatButton
        label="Okey"
        secondary={true}
        onTouchTap={this._handleRequestClose}
      />
    );

    return (
      <div style={containerStyle}>
        <Dialog
          open={this.state.open}
          title="Super Secret Password"
          actions={standardActions}
          onRequestClose={this._handleRequestClose}
        >
          1-2-3-4-5
        </Dialog>

        <h1>material-ui</h1>
        <h2>example project</h2>

        <div>{this.state.data}</div>

        <RaisedButton label="Super Secret Password" primary={true} onTouchTap={this._handleTouchTap} />

        <RaisedButton label="setTimer" primary={false} onTouchTap={this._handleSendRequestTouchTap.bind(this, "setTimer")} />
        <RaisedButton label="reset" primary={false} onTouchTap={this._handleSendRequestTouchTap.bind(this, "reset")} />
      </div>
    );
  },
});

export default Main;
