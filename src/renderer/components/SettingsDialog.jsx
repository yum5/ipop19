import React, { Component } from 'react';
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

const styles = {
};

class SettingsDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      snmpHosts: props.snmpHosts
    }
  }

  handleClose() {
    this.props.onClose();
  };

  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value,
      });
    }
  };

  render() {
    const { classes, items, open } = this.props;

    return (
      <Dialog onClose={this.handleClose} open={open}>
        <DialogTitle id="new-graph-dialog-title">SettingsDialog</DialogTitle>
        <div>
          <TextField
            id="snmp-hosts"
            label="snmp-hosts"
            value={this.state.snmpHosts}
            onChange={this.handleChange('snmpHosts')}
            margin="normal"
          />
        </div>
      </Dialog>
    );
  }
}

SettingsDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
};

export default withStyles(styles)(SettingsDialog);
