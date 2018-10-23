import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import {
  updateSnmpHost,
  updateRyuHost,
  saveSettings
} from '../../shared/actions/settings';

const styles = {
  settingsItemContainer: {
    display: 'flex',
    paddingTop: 8,
    paddingBottom: 8
  },
  settingsItemDescription: {
    width: 150,
    paddingRight: 24
  },
  settingsItemBody: {
    flex: 1
  },
};

const REGEX_IP_V4 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const HELPER_TEXT_SNMP_HOSTS = 'Invalid IP address format!';
const HELPER_TEXT_RYU_HOST = 'Invalid IP address format!';
class SettingsDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.initState = this.initState.bind(this);
    this.commitChanges = this.commitChanges.bind(this);

    // this.state = {
    //   snmpHosts: props.snmpHosts
    // }
    this.state = {
      snmpHosts: {
        value: '',  // stringified array of ip address separated by '\n'
        error: false,
        helperText: HELPER_TEXT_SNMP_HOSTS
      },
      ryuHost: {
        value: '', // stringified ip address
        error: false,
        helperText: HELPER_TEXT_RYU_HOST
      }
    }
  }

  handleClose() {
    this.props.onClose();
  }

  handleChange(name) {
    return event => {

      if (name === 'snmpHosts') {
        const value = event.target.value;
        const error = !value.split('\n').every(ip => REGEX_IP_V4.test(ip));

        this.setState({
          snmpHosts: {
            ...this.state.snmpHosts,
            error,
            value,
            helperText: error ? HELPER_TEXT_SNMP_HOSTS: ''
          }
        });
      } else if (name === 'ryuHost') {
        const value = event.target.value;
        const error = !REGEX_IP_V4.test(value);

        this.setState({
          ryuHost: {
            ...this.state.ryuHost,
            error,
            value,
            helperText: error ? HELPER_TEXT_RYU_HOST: ''
          }
        });
      } else {
        this.setState({
          [name]: {
            ...this.state[name],
            value: event.target.value
          }
        });
      }
    }
  }

  handleSaveClick() {
    this.commitChanges();
    this.handleClose();
  }

  initState() {
    const snmpHosts = this.props.snmpHosts.join('\n');
    const ryuHost = this.props.ryuHost;
    this.setState({
      snmpHosts: {
        value: snmpHosts,
        error: false,
        helperText: ''
      },
      ryuHost: {
        value: ryuHost,
        error: false,
        helperText: ''
      }
    });
  }

  commitChanges() {
    const { dispatch } = this.props;
    const snmpHosts = this.state.snmpHosts.value.split('\n');
    const ryuHost = this.state.ryuHost.value;
    dispatch(updateSnmpHost(snmpHosts));
    dispatch(updateRyuHost(ryuHost));
    dispatch(saveSettings({
      snmpHosts,
      ryuHost
    }));
  }

  render() {
    const { classes, open } = this.props;
    const { snmpHosts, ryuHost } = this.state;

    return (
      <Dialog
        onClose={this.handleClose}
        onEnter={this.initState}
        open={open}
      >
        <DialogTitle id="new-graph-dialog-title">Settings</DialogTitle>
        <DialogContent>
          <div className={classes.settingsItemContainer}>
            <div className={classes.settingsItemDescription}>
              <Typography variant="subheading">
                Switch hosts
              </Typography>
              <Typography variant="caption">
                Type Switch IPv4 Address which you want to count packet via SNMP protocol. <br/>
                Insert <code>LF(\n)</code> between each entry and input multiple IP Addresses.
              </Typography>
            </div>
            <div className={classes.settingsItemBody}>
              <TextField
                id="snmp-hosts"
                label="List of IPv4 Address"
                multiline
                rowsMax="4"
                value={snmpHosts.value}
                error={snmpHosts.error}
                helperText={snmpHosts.helperText}
                onChange={this.handleChange('snmpHosts')}
                margin="normal"
              />
            </div>
          </div>
          <Divider />
          <div className={classes.settingsItemContainer}>
            <div className={classes.settingsItemDescription}>
              <Typography variant="subheading">
                Ryu SDN Controller
              </Typography>
              <Typography variant="caption">
                Type Ryu SDN Controller IPv4 Address which expose network configuration information.
              </Typography>
            </div>
            <div className={classes.settingsItemBody}>
              <TextField
                id="ryu"
                label="IPv4 Address"
                value={ryuHost.value}
                error={ryuHost.error}
                helperText={ryuHost.helperText}
                onChange={this.handleChange('ryuHost')}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleSaveClick}
            disabled={snmpHosts.error || ryuHost.error}
          >Save</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

SettingsDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
};

const mapStateToProps = state => ({
  snmpHosts: state.settings.snmpHosts,
  ryuHost: state.settings.ryuHost
})

export default connect(mapStateToProps)(withStyles(styles)(SettingsDialog));
