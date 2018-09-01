import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Graph from './Graph';
import NewGraphDialog from './NewGraphDialog';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

export class App extends Component {
  constructor(props) {
    super(props);

    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleItemClick = this.handleItemClick.bind(this)
    this.state = {
      open: false,
    };
  }

  handleClickOpen() {
    this.setState({
      open: true,
    });
  };

  handleClose() {
    this.setState({ open: false });
  };

  handleItemClick(value) {
    console.log(value);
    this.setState({ open: false });
  };

  render() {
    const list = this.props.nic.map(ifs =>
      <li key={ifs}>{ifs}</li>
    )
    const { classes, nic } = this.props;
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              News
            </Typography>
            <Button color="inherit">Settings</Button>
          </Toolbar>
        </AppBar>
        <Button onClick={this.handleClickOpen}>Open simple dialog</Button>
        <NewGraphDialog
          open={this.state.open}
          onClose={this.handleClose}
          onItemClick={this.handleItemClick}
          items={nic}
        />
        <p>Hello</p>
          <ul>
            {list}
          </ul>
        <Graph />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    nic: state.devices.nic,
    graphData: state.packets.graphData
  };
}

export default connect(mapStateToProps)(withStyles(styles)(App))
