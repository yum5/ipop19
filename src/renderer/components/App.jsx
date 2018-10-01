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
import SettingsDialog from './SettingsDialog';
import { addGraphEntry } from '../../shared/actions/settings';

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
      dialog: {
        newGraph: {
          open: false,
        },
        settings: {
          open: false
        }
      }
    };
  }

  handleClickOpen(dialog) {
    return () => {
      this.setState({
        dialog: {
          ...this.state.dialog,
          [dialog]: {
            ...this.state.dialog[dialog],
            open: true,
          }
        }
      });
    }
  };

  handleClose(dialog) {
    return () => {
      this.setState({
        dialog: {
          ...this.state.dialog,
          [dialog]: {
            ...this.state.dialog[dialog],
            open: false,
          }
        }
      });
    }
  };

  handleItemClick(value) {
    this.props.dispatch(addGraphEntry(value));
    this.setState({
      dialog: {
        ...this.state.dialog,
        newGraph: {
          ...this.state.dialog.newGraph,
          open: false,
        }
      }
    });
  };

  render() {
    const { classes, interfaces, graphEntries } = this.props;
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              Packet Count
            </Typography>
            <Button
              color="inherit"
              onClick={this.handleClickOpen('settings')}
            >Settings</Button>
          </Toolbar>
        </AppBar>
        <Button onClick={this.handleClickOpen('newGraph')}>Open simple dialog</Button>
        <NewGraphDialog
          open={this.state.dialog.newGraph.open}
          onClose={this.handleClose('newGraph')}
          onItemClick={this.handleItemClick}
          items={interfaces}
        />
        <SettingsDialog
          open={this.state.dialog.settings.open}
          onClose={this.handleClose('settings')}
        />
        <h1>Graph</h1>
        {graphEntries.map(entry =>
          <div key={entry.id}>
            <h3>Device: {entry.id}</h3>
            <Graph device={entry.id}/>
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    nic: state.devices.nic,
    interfaces: state.devices.interfaces,
    graphData: state.packets.graphData,
    graphEntries: state.settings.graphEntries
  };
}

export default connect(mapStateToProps)(withStyles(styles)(App))
