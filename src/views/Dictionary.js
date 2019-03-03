import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import { mainListItems, secondaryListItems } from '../components/listItems';
import DictionaryTable from '../components/DictionaryTable';
import DeleteDialog from '../components/DeleteDialog';
import ValidatedDialog from '../components/ValidatedDialog';
import SaveDialog from '../components/SaveDialog';
import { validateDictionary, properCase } from '../helpers/validationHelper';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
  h5: {
    marginBottom: theme.spacing.unit * 2,
  },
  add: {
    position: 'absolute',
    right: 50,
    bottom: 50,
  },
  fab: {
    margin: theme.spacing.unit,
  },
});

class Dictionary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
      openDeleteDialog: false,
      openValidatedDialog: false,
      openSaveDialog: false,
      isEditingItem: null,
      isEditingSynonim: null,
      dictionaryName: '',
      _id: null,
      page: 0,
      rowsPerPage: 5,
    };
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.addSynonim = this.addSynonim.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleValidate = this.handleValidate.bind(this);
    this.handleDeleteDialog = this.handleDeleteDialog.bind(this);
    this.keyPress = this.keyPress.bind(this);
    this.handleValidatedDialog = this.handleValidatedDialog.bind(this);
    this.handleSaveDialog = this.handleSaveDialog.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.checkValidation = this.checkValidation.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
  }

  async componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    let rows = [];
    if (localStorage.getItem('dictionaries')) {
      try {
        rows = JSON.parse(localStorage.getItem('dictionaries'));
        // console.log('Found localstorage!', rows);
      } catch (e) {
        // if error empty localStorage
        localStorage.removeItem('dictionaries');
      }
    } else {
      console.log('No data in localStorage');
    }

    const dictionary = rows.find(row => row._id === id);
    const { synonims } = dictionary;

    await this.setState({
      rows,
      synonims,
      _id: id,
      dictionaryName: dictionary.name,
    });
    await this.handleValidate();
  }

  static createData() {
    const createData = () => ({
      _id: uuid.v4(),
      domain: '',
      range: '',
    });
    return createData();
  }

  handleDrawerOpen() {
    this.setState({ open: true });
  }

  handleDrawerClose() {
    this.setState({ open: false });
  }

  handleSaveDialog() {
    this.setState({
      openSaveDialog: !this.state.openSaveDialog,
    });
  }

  handleDeleteDialog(item) {
    this.setState({
      openDeleteDialog: !this.state.openDeleteDialog,
      isEditingItem: item,
    });
  }

  handleValidatedDialog() {
    this.setState({
      openValidatedDialog: !this.state.openValidatedDialog,
    });
  }

  handleChange(e, id) {
    const { synonims } = this.state;

    const found = synonims.find(synonim => synonim._id === id);
    if (e.target.id === 'domain') found.domain = properCase(e.target.value);
    if (e.target.id === 'range') found.range = properCase(e.target.value);
    this.setState({ synonims: [...synonims] });
  }

  keyPress(e) {
    if (e.keyCode === 13 && e.target.value) {
      this.handleValidate();
    }
  }

  async addSynonim() {
    const { synonims } = this.state;
    synonims.push(this.constructor.createData());
    await this.setState({ synonims });
  }

  async handleSave() {
    const { rows, _id, synonims } = this.state;
    this.handleValidate();
    const updated = rows.map(dictionary => {
      if (dictionary._id === _id)
        return {
          ...dictionary,
          synonims: [...synonims],
          validation: true,
        };
      return dictionary;
    });

    await this.setState({ rows: updated });

    await localStorage.removeItem('dictionaries');
    await localStorage.setItem('dictionaries', JSON.stringify(this.state.rows));
  }

  checkValidation(dictionary) {
    const validate = dictionary.filter(el => {
      const { isDuplicate, isFork, isCycle, isChain, domain, range } = el;
      if (isDuplicate || isFork || isCycle || isChain || !domain || !range)
        return true;
      return false;
    });
    if (validate.length === 0) {
      this.addSynonim();
    } else {
      this.handleValidatedDialog();
    }
  }

  async handleValidate() {
    const { synonims } = this.state;
    const validatedDictionary = validateDictionary(synonims);
    // setState is async so we need to wait until the values are populated
    await this.setState({ synonims: validatedDictionary });

    await this.checkValidation(this.state.synonims);
  }

  async handleDelete() {
    const { rows, isEditingItem, _id } = this.state;

    const dictionary = rows.find(row => row._id === _id);

    const rowsWithoutSelected = dictionary.synonims.filter(
      synonim => synonim !== isEditingItem
    );
    const dictionaryWithoutSelected = {
      ...dictionary,
      synonims: [...rowsWithoutSelected],
    };
    const rowsWithoutSelectedDictionary = rows.filter(row => row._id !== _id);

    const newRows = [
      ...rowsWithoutSelectedDictionary,
      dictionaryWithoutSelected,
    ];

    await this.setState({
      rows: newRows,
      synonims: [...rowsWithoutSelected],
      isEditingItem: null,
      isEditingIndex: null,
    });
    this.handleDeleteDialog(null);

    await localStorage.removeItem('dictionaries');
    await localStorage.setItem('dictionaries', JSON.stringify(this.state.rows));
  }

  handleChangePage(event, page) {
    this.setState({ page });
  }

  handleChangeRowsPerPage(event) {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  }

  render() {
    const { classes } = this.props;
    const {
      rows,
      synonims,
      openDeleteDialog,
      openValidatedDialog,
      openSaveDialog,
      dictionaryName,
      page,
      rowsPerPage,
    } = this.state;

    return (
      <div className={classes.root}>
        <DeleteDialog
          open={openDeleteDialog}
          handleClose={this.handleDeleteDialog}
          handleDelete={this.handleDelete}
        />
        <ValidatedDialog
          open={openValidatedDialog}
          handleClose={this.handleValidatedDialog}
        />
        <SaveDialog
          open={openSaveDialog}
          handleClose={this.handleSaveDialog}
          handleSave={this.handleSave}
        />
        <CssBaseline />
        <AppBar
          position="absolute"
          className={classNames(
            classes.appBar,
            this.state.open && classes.appBarShift
          )}
        >
          <Toolbar
            disableGutters={!this.state.open}
            className={classes.toolbar}
          >
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(
                classes.menuButton,
                this.state.open && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Dashboard
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(
              classes.drawerPaper,
              !this.state.open && classes.drawerPaperClose
            ),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>{mainListItems}</List>
          <Divider />
          <List>{secondaryListItems(rows)}</List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Typography variant="h4" gutterBottom component="h2">
            {dictionaryName}
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="h2">
            {
              'The Domain of a dictionary represents the original value to transform, the Range of a dictionary represents the desired value.'
            }
          </Typography>
          <div className={classes.tableContainer}>
            {synonims ? (
              <DictionaryTable
                rows={synonims}
                deleteRow={this.handleDeleteDialog}
                saveChanges={this.handleSave}
                validate={this.handleValidate}
                editRow={this.handleEdit}
                onChange={this.handleChange}
                keyPress={this.keyPress}
                page={page}
                rowsPerPage={rowsPerPage}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            ) : null}
          </div>
          <div className={classes.add}>
            <Tooltip title="Save" aria-label="Save">
              <Fab
                color="secondary"
                aria-label="Add"
                className={classes.fab}
                onClick={() => this.handleSave()}
              >
                <Icon className={classes.rightIcon}>save_icon</Icon>
              </Fab>
            </Tooltip>

            <Tooltip title="Add domain/range" aria-label="Add domain/range">
              <Fab
                color="primary"
                aria-label="Add"
                className={classes.fab}
                onClick={() => this.handleValidate()}
              >
                <AddIcon />
              </Fab>
            </Tooltip>
          </div>
        </main>
      </div>
    );
  }
}

Dictionary.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dictionary);
