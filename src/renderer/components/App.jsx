import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Divider from '@material-ui/core/Divider';

import Snap from 'snapsvg-cjs';
import _ from 'lodash';

import ErrorListDrawer from './ErrorListDrawer';
import ErrorListNavigation from './ErrorListNavigation';
import Graph from './Graph';
import NetworkFigure, { SW, getLinkColor } from './NetworkFigure';
import NewGraphDialog from './NewGraphDialog';
import SettingsDialog from './SettingsDialog';
import { addGraphEntry } from '../../shared/actions/settings';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  appContent: {
    padding: theme.spacing.unit * 2
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    zIndex: 10,
  },
  graphContainer: {
    paddingTop: 16,
    paddingBottom: 16
  }
})

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
        },
        errors: {
          open: false
        }
      },
      vlanId: 11,
      viaSW: SW.SPINE
    };

    setInterval(() => {
      this.setState({
        vlanId: Math.floor(Math.random() * 6) + 11,
        viaSW: _.sample([SW.SPINE, SW.MEMS, SW.PLZT])
      })
    }, 1000)
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
            <Typography variant="title" color="inherit" className={classes.flex}>
              HOLST Demo
            </Typography>
            <Button
              color="inherit"
              onClick={this.handleClickOpen('settings')}
            >Settings</Button>
          </Toolbar>
        </AppBar>
        <div className={classes.appContent}>
          <Paper className={classes.paper} elevation={1}>
            <Typography variant="headline" component="h1">
              Network Status
            </Typography>
            <NetworkFigure
              vlanId={this.state.vlanId}
              viaSW={this.state.viaSW}
            />
            <div>
              VLAN Tag: {this.state.vlanId}

              {/*<ul>
                {[11, 12, 13, 14, 15, 16].map(vlanId =>
                  <li key={vlanId}>
                    VLAN Tag {vlanId}: <span style={{background: getLinkColor(vlanId)}}>{getLinkColor(vlanId)}</span>
                  </li>
                )}
              </ul>*/}
            </div>
          </Paper>

          <Paper className={classes.paper} elevation={1}>
            <Typography variant="headline" component="h1">
              Graph
            </Typography>
            {graphEntries.map(entry =>
              <div key={entry.id} className={classes.graphContainer}>
                <Typography
                  variant="subheading"
                  color="inherit"
                  component="h1"
                >
                  Device: {entry.id}
                </Typography>
                <Graph device={entry.id}/>
              </div>).reduce((accum, elem) => {
                return accum === null ? [elem] : [...accum, <Divider/>, elem]
              }, null)}
          </Paper>
          <Button
            variant="fab"
            color="primary"
            aria-label="Add"
            onClick={this.handleClickOpen('newGraph')}
            className={classes.fab}
          >
            <AddIcon />
          </Button>
        </div>
        <ErrorListNavigation
          onClick={this.handleClickOpen('errors')} />
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
        <ErrorListDrawer
          open={this.state.dialog.errors.open}
          onClose={this.handleClose('errors')}
        />
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
