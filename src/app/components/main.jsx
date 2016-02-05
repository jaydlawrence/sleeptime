/** In this file, we create a React component which incorporates components provided by material-ui */

import React from 'react';
import RadioButton from 'material-ui/lib/radio-button';
import RadioButtonGroup from 'material-ui/lib/radio-button-group';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import Dialog from 'material-ui/lib/dialog';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import LightRawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme';
import Colors from 'material-ui/lib/styles/colors';
import FlatButton from 'material-ui/lib/flat-button';
import queryString from 'query-string';

const styles = {
  block: {
    maxWidth: 250

  },
  blockOuter: {
      display: "inline-block"
  },
  radioButton: {
    marginBottom: 16,
    fontSize: "large"
  },
};

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
      functionType: "setPeriod",

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

  _handleSendRequestTouchTap(func) {

    this.sendRequest(func, this.refs.timeInput.getValue());
  },

  _functonSelectorChange(e) {
      this.setState({functionType: e.target.value});
  },

  sendRequest(remoteFunction, value) {
    remoteFunction = remoteFunction || this.state.functionType;
    window.fetch(
      'https://api.particle.io/v1/devices/' + this.props.config.device_id + '/' + remoteFunction,
      {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: queryString.stringify({
          access_token: this.props.config.access_token,
          args: value
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
    let timeValueTextBox = null;
    switch (this.state.functionType) {
        case "setEnd":
            timeValueTextBox = (<div style={styles.block}>
                <TextField
                  hintText="End Time"
                  ref="timeInput"
                />
                <br/>
            </div>);
            break;
        case "setPeriod":
            timeValueTextBox = (<div style={styles.block}>
                <TextField
                  hintText="Time"
                  ref="timeInput"
                />
                <br/>
            </div>);
            break;
    }

    return (
      <div style={containerStyle}>
        <h1>Sleeptime</h1>
        <h2>IoT Grow Clock</h2>

        <div>{this.state.data}</div>
        <div style={styles.blockOuter}>
            <div style={styles.block}>
                <RadioButtonGroup
                    name="func"
                    defaultSelected="setPeriod"
                    labelPosition="left"
                    ref="functionSelector"
                    onChange={this._functonSelectorChange}
                >
                  <RadioButton
                    value="setPeriod"
                    label="Period"
                    style={styles.radioButton}
                  />
                  <RadioButton
                    value="setEnd"
                    label="End Time"
                    style={styles.radioButton}
                  />
                </RadioButtonGroup>
            </div>
            {timeValueTextBox}
            <div>
                <RaisedButton label="Set Timer For 1 Minute" primary={true} onTouchTap={this._handleSendRequestTouchTap.bind(this, null)} />
                <RaisedButton label="reset" primary={false} onTouchTap={this._handleSendRequestTouchTap.bind(this, "reset")} />
            </div>
        </div>
      </div>
    );
  },
});

export default Main;
