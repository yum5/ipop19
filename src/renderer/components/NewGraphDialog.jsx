import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
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

class NewGraphDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleClose() {
    this.props.onClose();
  };

  handleItemClick(value) {
    this.props.onItemClick(value);
  };

  render() {
    const { classes, items, open } = this.props;

    return (
      <Dialog onClose={this.handleClose} open={open}>
        <DialogTitle id="new-graph-dialog-title">Create New Graph</DialogTitle>
        <div>
          <List>
            {items.map(item => (
              <ListItem button onClick={() => this.handleItemClick(item)} key={item.id}>
                {`${item.id}[${item.status}]: ${item.desc}`}
              </ListItem>
            ))}
          </List>
        </div>
      </Dialog>
    );
  }
}

NewGraphDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  onItemClick: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.string),
};

export default withStyles(styles)(NewGraphDialog);
