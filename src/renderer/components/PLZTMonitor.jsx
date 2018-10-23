import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    display: 'flex',
    boxSizing: 'border-box',
  },
  slotA: {
    background: 'skyblue',
    boxSizing: 'border-box',
    padding: theme.spacing.unit
  },
  slotB: {
    background: 'lime',
    boxSizing: 'border-box',
    padding: theme.spacing.unit
  },
  slotC: {
    background: 'pink',
    boxSizing: 'border-box',
    padding: theme.spacing.unit
  },
});

class PLZTMonitor extends Component {
  render() {
    const { classes, slot } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.slotA} style={{flex: slot.slotA}}>
          <div>Slot A</div>
          <div>{slot.slotA}ms</div>
        </div>
        <div className={classes.slotB} style={{flex: slot.slotB}}>
          <div>Slot B</div>
          <div>{slot.slotB}ms</div>
        </div>
        <div className={classes.slotC} style={{flex: slot.slotC}}>
          <div>Slot C</div>
          <div>{slot.slotC}ms</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  slot: state.slot
})

export default connect(mapStateToProps)(withStyles(styles)(PLZTMonitor))
