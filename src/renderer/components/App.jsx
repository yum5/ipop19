import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Divider from '@material-ui/core/Divider';

import ErrorListDrawer from './ErrorListDrawer';
import ErrorListNavigation from './ErrorListNavigation';
import Graph from './Graph';
import Graph2 from './Graph2';
import Graph3 from './Graph3';
import Graph4 from './Graph4';
import Graph5 from './Graph5';
import Graph6 from './Graph6';
import PowerGraph from './PowerGraph';
import NetworkFigure from './NetworkFigure';
import NewGraphDialog from './NewGraphDialog';
import SettingsDialog from './SettingsDialog';
import PLZTMonitor from './PLZTMonitor';
import { addGraphEntry } from '../../shared/actions/settings';
import { getDevices } from '../../shared/actions/devices';

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
  graphArea: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  graphContainer: {
    paddingTop: 16,
    paddingBottom: 16,
    width: '33%'
  }
})

export class App extends Component {
  constructor(props) {
    super(props);

    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleItemClick = this.handleItemClick.bind(this)
    this.handleLoadDevicesClick = this.handleLoadDevicesClick.bind(this)
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
      // vlanId: 11,
      // viaSW: SW.SPINE
    };

    // setInterval(() => {
    //   this.setState({
    //     vlanId: Math.floor(Math.random() * 6) + 11,
    //     viaSW: _.sample([SW.SPINE, SW.MEMS, SW.PLZT])
    //   })
    // }, 1000)
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
  }

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
  }

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
  }

  handleLoadDevicesClick() {
    const { dispatch, snmpHosts, isDebugMode } = this.props;
    dispatch(getDevices(snmpHosts, isDebugMode));
  }

  render() {
    const { classes, interfaces, graphEntries, isLoading } = this.props;
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="title" color="inherit" className={classes.flex}>
              IPOP2019 Demo
            </Typography>
            <Button
              color="inherit"
              onClick={this.handleClickOpen('settings')}
            >Settings</Button>
          </Toolbar>
        </AppBar>
        <div className={classes.appContent}>
          {/* <Paper className={classes.paper} elevation={1}>
            <Typography variant="headline" component="h1">
              VLAN Config
            </Typography>
            <NetworkFigure />
          </Paper> */}

          <Paper className={classes.paper} elevation={1}>
            {/* <Typography variant="headline" component="h1">
              PLZT Optical Slot Size
            </Typography> */}
            <PLZTMonitor />
            <div className={classes.graphArea}>
              {/* {graphEntries.map(entry =>
                <div key={entry.id} className={classes.graphContainer}>
                  <Typography
                    variant="subheading"
                    color="inherit"
                    component="h1"
                  >
                    Device: {entry.id}
                  </Typography>
                  <Graph device={entry.id}/>
                </div>)} */}
              {/*.reduce((accum, elem) => accum === null ? [elem] : [...accum, <Divider/>, elem], null)*/}
              {/* <Typography
                    variant="subheading"
                    color="inherit"
                    component="h1"
                  >
                  Device: {["電気L2スイッチ"]}
                  </Typography> */}
             {/* <Graph device={["slotA"]}/> */}

             {/* <Typography
                    variant="subheading"
                    color="inherit"
                    component="h1"
                  >
                  Device: {["光L1スイッチ"]}
                  </Typography> */}
             {/* <Graph device={["slotB"]}/> */}

              {/* <Typography
                    variant="subheading"
                    color="inherit"
                    component="h1"
                  >
                  Device: {["電気L1スイッチ"]}
               </Typography> */}
             <Graph5 device={["slotA0","slotA1","slotA2"]}/>
             <Graph4 device={["slotB0","slotB1","slotB2","slotB3"]}/>
             <Graph3 device={["slotC0","slotC1","slotC2","slotC3","slotC4","slotC5"]}/>
             <Graph device={["slotD0"]}/>
             {/* <Graph6 device={["slotD1"]}/>
             <Graph device={["slotC5"]}/>
             <Graph6 device={["slotD2"]}/> */}
             {/* <Graph2 device={["slotD0"]}/>
             <Graph6 device={["slotD0"]}/> */}
             {/* <Graph2 device={["slotD1"]}/>
             <Graph2 device={["slotD2"]}/> */}
              {/* <Typography
                    variant="subheading"
                    color="inherit"
                    component="h1"
                  >
                  Device: {["slotD"]}
                  </Typography> */}
             {/* <Graph device={["slotD0"]}/> */}

              {/* <Typography
                    variant="subheading"
                    color="inherit"
                    component="h1"
                  >
                  Device: {["slotE"]}
                  </Typography> */}
             {/* <Graph device={["slotE"]}/> */}

             {/* <Graph2 device={["slotD"]}/> */}
             {/* <Typography
                    variant="subheading"
                    color="inherit"
                    component="h1"
                  >
                  Device: {["ADVマイグレーション"]}
                  </Typography> */}
             {/* <Graph2 device={["slotD","slotE"]}/> */}
            </div>
          </Paper>

          {/* <Paper className={classes.paper} elevation={1}>
            <Typography variant="headline" component="h1">
              Power Consumption Comparison
            </Typography>

            <PowerGraph />
          </Paper>
          <Button
            variant="fab"
            color="primary"
            aria-label="Add"
            onClick={this.handleClickOpen('newGraph')}
            className={classes.fab}
          >
            <AddIcon />
          </Button> */}
        </div>
        <ErrorListNavigation
          onClick={this.handleClickOpen('errors')} />
        <NewGraphDialog
          open={this.state.dialog.newGraph.open}
          onClose={this.handleClose('newGraph')}
          onItemClick={this.handleItemClick}
          onLoadDevicesClick={this.handleLoadDevicesClick}
          isLoading={isLoading}
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

const mapStateToProps = state => ({
  // nic: state.devices.nic,
  interfaces: state.devices.interfaces,
  isLoading: state.devices.isLoading,
  graphData: state.packets.graphData,
  graphEntries: state.settings.graphEntries,
  snmpHosts: state.settings.snmpHosts,
  isDebugMode: state.settings.isDebugMode,
})

export default connect(mapStateToProps)(withStyles(styles)(App))
