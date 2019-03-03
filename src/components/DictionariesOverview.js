import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
});

function DictionariesOverview(props) {
  const { classes, rows, deleteDictionary } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <CustomTableCell>Dictionary (name)</CustomTableCell>
            <CustomTableCell align="center">Validated</CustomTableCell>
            <CustomTableCell align="center">Edit</CustomTableCell>
            <CustomTableCell align="center">Delete</CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows &&
            rows.map(row => (
              <TableRow className={classes.row} key={row._id}>
                <CustomTableCell component="th" scope="row">
                  {row.name}
                </CustomTableCell>
                <CustomTableCell align="center">
                  {row.validated ? (
                    <Icon className={classes.rightIcon}>check</Icon>
                  ) : (
                    <Icon className={classes.rightIcon}>close</Icon>
                  )}
                </CustomTableCell>
                <CustomTableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    component={Link}
                    to={{ pathname: `/dictionary/${row._id}` }}
                  >
                    Edit
                    <Icon className={classes.rightIcon}>edit_icon</Icon>
                  </Button>
                </CustomTableCell>
                <CustomTableCell align="center">
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={() => deleteDictionary(row)}
                  >
                    Delete
                    <DeleteIcon className={classes.rightIcon} />
                  </Button>
                </CustomTableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

DictionariesOverview.propTypes = {
  classes: PropTypes.object.isRequired,
  rows: PropTypes.array,
  deleteDictionary: PropTypes.func.isRequired,
};

export default withStyles(styles)(DictionariesOverview);
