import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';

import { updateSnmpHost } from '../../shared/actions/settings';

const styles = {
};

const REGEX_IP_V4 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const HELPER_TEXT_SNMP_HOSTS = 'Invalid IP address format!';
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
        value: '',
        error: false,
        helperText: HELPER_TEXT_SNMP_HOSTS
      }
    }
  }

  handleClose() {
    this.props.onClose();
  };

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
      } else {
        this.setState({
          [name]: {
            ...this.state[name],
            value: event.target.value
          }
        });
      }
    }
  };

  handleSaveClick() {
    this.commitChanges();
    this.handleClose();
  }

  initState() {
    const snmpHosts = this.props.snmpHosts.join('\n');
    this.setState({
      snmpHosts: {
        value: snmpHosts,
        error: false,
        helperText: ''
      }
    });
  }

  commitChanges() {
    const snmpHosts = this.state.snmpHosts.value.split('\n');
    this.props.dispatch(updateSnmpHost(snmpHosts));
  }

  render() {
    const { classes, items, open } = this.props;
    const { snmpHosts } = this.state;

    return (
      <Dialog
        onClose={this.handleClose}
        onEnter={this.initState}
        open={open}
      >
        <DialogTitle id="new-graph-dialog-title">SettingsDialog</DialogTitle>
        <div>
          <TextField
            id="snmp-hosts"
            label="snmp-hosts"
            multiline
            rowsMax="4"
            value={snmpHosts.value}
            error={snmpHosts.error}
            helperText={snmpHosts.helperText}
            onChange={this.handleChange('snmpHosts')}
            margin="normal"
          />
        </div>
        <Button
          onClick={this.handleSaveClick}
          disabled={snmpHosts.error}
        >Save</Button>
      </Dialog>
    );
  }
}

SettingsDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    snmpHosts: state.settings.snmpHosts
  };
}

export default connect(mapStateToProps)(withStyles(styles)(SettingsDialog));
