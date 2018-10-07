import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';

const styles = theme => ({
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

class NewGraphDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleLoadDevicesClick = this.handleLoadDevicesClick.bind(this);
  }

  handleClose() {
    this.props.onClose();
  };

  handleItemClick(value) {
    this.props.onItemClick(value);
  };

  handleLoadDevicesClick() {
    this.props.onLoadDevicesClick();
  };

  render() {
    const { classes, items, open, isLoading } = this.props;

    return (
      <Dialog
        onClose={this.handleClose}
        open={open}
        scroll="paper"
      >
        <DialogTitle id="new-graph-dialog-title">Create New Graph</DialogTitle>
        <DialogContent>
          <List>
            {items.map(item => (
              <ListItem button onClick={() => this.handleItemClick(item)} key={item.id}>
                {`${item.id}[${item.status}]: ${item.desc}`}
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <div className={classes.wrapper}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={isLoading}
              onClick={this.handleLoadDevicesClick}
            >
              Load Devices
            </Button>
            {isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
        </DialogActions>
      </Dialog>
    );
  }
}

NewGraphDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  onItemClick: PropTypes.func,
  handleLoadDevicesClick: PropTypes.func,
  // items: PropTypes.arrayOf(PropTypes.string),
};

export default withStyles(styles)(NewGraphDialog);
