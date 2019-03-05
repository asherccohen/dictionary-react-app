import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import TablePagination from '@material-ui/core/TablePagination';

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

function DictionaryTable(props) {
  const {
    classes,
    rows,
    deleteRow,
    onChange,
    keyPress,
    handleChangePage,
    handleChangeRowsPerPage,
    page,
    rowsPerPage,
  } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <CustomTableCell>Domain</CustomTableCell>
            <CustomTableCell align="center">Range</CustomTableCell>
            <CustomTableCell align="center">Duplicates</CustomTableCell>
            <CustomTableCell align="center">Forks</CustomTableCell>
            <CustomTableCell align="center">Cycles</CustomTableCell>
            <CustomTableCell align="center">Chains</CustomTableCell>
            <CustomTableCell align="center">Delete</CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows &&
            rows.map((row, index) => (
              <TableRow className={classes.row} key={index}>
                <CustomTableCell component="th" scope="row">
                  <Input
                    id="domain"
                    placeholder="Type a domain.."
                    className={classes.input}
                    inputProps={{
                      'aria-label':
                        'The Domain of a dictionary represents the original value to transform.',
                    }}
                    value={row.domain}
                    onChange={e => onChange(e, row._id)}
                    required
                    type="text"
                    multiline={false}
                    onKeyDown={keyPress}
                    autoFocus
                  />
                </CustomTableCell>
                <CustomTableCell align="center">
                  <Input
                    id="range"
                    placeholder="Type a range..."
                    className={classes.input}
                    inputProps={{
                      'aria-label':
                        'The Range of a dictionary represents the desired value.',
                    }}
                    value={row.range}
                    onChange={e => onChange(e, row._id)}
                    required
                    type="text"
                    multiline={false}
                    onKeyDown={keyPress}
                  />
                </CustomTableCell>
                <CustomTableCell align="center">
                  {!row.isDuplicate ? (
                    <Icon className={classes.rightIcon}>check</Icon>
                  ) : (
                    <Icon className={classes.rightIcon}>close</Icon>
                  )}
                </CustomTableCell>
                <CustomTableCell align="center">
                  {!row.isFork ? (
                    <Icon className={classes.rightIcon}>check</Icon>
                  ) : (
                    <Icon className={classes.rightIcon}>close</Icon>
                  )}
                </CustomTableCell>
                <CustomTableCell align="center">
                  {!row.isCycle ? (
                    <Icon className={classes.rightIcon}>check</Icon>
                  ) : (
                    <Icon className={classes.rightIcon}>close</Icon>
                  )}
                </CustomTableCell>
                <CustomTableCell align="center">
                  {!row.isChain ? (
                    <Icon className={classes.rightIcon}>check</Icon>
                  ) : (
                    <Icon className={classes.rightIcon}>close</Icon>
                  )}
                </CustomTableCell>
                <CustomTableCell align="center">
                  <IconButton
                    className={classes.button}
                    aria-label="Delete"
                    onClick={() => deleteRow(row, index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CustomTableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={() => handleChangePage()}
          onChangeRowsPerPage={() => handleChangeRowsPerPage()}
        />
      }
    </Paper>
  );
}

DictionaryTable.propTypes = {
  classes: PropTypes.object.isRequired,
  rows: PropTypes.array,
  deleteRow: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  keyPress: PropTypes.func.isRequired,
  handleChangePage: PropTypes.func,
  handleChangeRowsPerPage: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default withStyles(styles)(DictionaryTable);
