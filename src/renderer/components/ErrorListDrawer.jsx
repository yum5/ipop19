import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = {
  // root: {
  //   display: 'flex',
  //   justifyContent: 'center',
  //   height: 56,
  //   background: 'pink',
  //   width: '100%',
  //   boxSizing: 'border-box',
  // }
};

class ErrorListDrawer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { errors, open, onClose } = this.props;
    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Error Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {errors.map(error => {
              return (
                <TableRow key={error.timestamp}>
                  <TableCell>{error.timestamp}</TableCell>
                  <TableCell>{error.message}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Drawer>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    errors: state.errors
  };
}

export default connect(mapStateToProps)(withStyles(styles)(ErrorListDrawer))
