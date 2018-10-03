import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ReportIcon from '@material-ui/icons/Report';

const styles = theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 56,
    width: '100%',
    backgroundColor: '#fff',
    paddingLeft: 24,
    paddingRight: 24,
    boxSizing: 'border-box',
  },
  icon: {
    margin: theme.spacing.unit,
    fontSize: 32,
  }
});

class ErrorListNavigation extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { errors, onClick, classes } = this.props;
    return (
      <Paper
        square
        component="footer"
        elevation={8}
        onClick={onClick}
        className={classes.root}
      >
        <ReportIcon className={classes.icon} />
        <Typography variant="button" color="inherit">
          Show Errors
        </Typography>
      </Paper>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    errors: state.errors
  };
}

export default connect(mapStateToProps)(withStyles(styles)(ErrorListNavigation))
