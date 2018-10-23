import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    display: 'flex',
    boxSizing: 'border-box',
  },
  slotA: {
    background: 'skyblue'
  },
  slotB: {
    background: 'lime'
  },
  slotC: {
    background: 'pink'
  },
};

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
