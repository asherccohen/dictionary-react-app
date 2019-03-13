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
import {
  validateDictionary,
  concatTrimmed,
  properCase,
  checkValidation,
} from '../helpers/validationHelper';

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
const dictionaries = require('../assets/data/dictionaries.json');

class Dictionary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dictionaries,
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
      validated: null,
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
        rows = await JSON.parse(localStorage.getItem('dictionaries'));
        // console.log('Found localstorage!', rows);
      } catch (e) {
        // if error empty localStorage we refresh page which collect data from localStorage again

        localStorage.removeItem('dictionaries');
        window.location.reload();
      }
    } else {
      // console.log('No data in localStorage');
      rows = this.state.dictionaries;
      localStorage.setItem('dictionaries', JSON.stringify(rows));
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

    // add event listener to save state to localStorage
    // when user leaves/refreshes the page
    window.addEventListener(
      'beforeunload',
      this.constructor.saveStateToLocalStorage()
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      'beforeunload',
      this.constructor.saveStateToLocalStorage()
    );

    // saves if component has a chance to unmount
    this.constructor.saveStateToLocalStorage(this.state.rows);
  }

  static saveStateToLocalStorage(state) {
    // console.log('Saving...', state);
    localStorage.removeItem('dictionaries');
    localStorage.setItem('dictionaries', JSON.stringify(state));
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

  async addSynonim(validated) {
    const { synonims } = this.state;
    synonims.push(this.constructor.createData());
    await this.setState({ synonims, validated });
  }

  async handleSave() {
    const { rows, _id, synonims, validated } = this.state;

    const noEmpty = synonims.filter(el => el.domain !== '' || el.range !== '');
    const noSpaces = noEmpty.map(el => ({
      ...el,
      domain: concatTrimmed(el.domain),
      range: concatTrimmed(el.range),
    }));

    const updated = rows.map(dictionary => {
      if (dictionary._id === _id)
        return {
          ...dictionary,
          synonims: [...noSpaces],
          validation: validated,
        };
      return dictionary;
    });

    await this.setState({ rows: updated, synonims: [...noSpaces] });

    await this.constructor.saveStateToLocalStorage(this.state.rows);
    this.handleSaveDialog();
  }

  async handleValidate() {
    const { synonims } = this.state;
    const validatedDictionary = validateDictionary(synonims);
    // setState is async so we need to wait until the values are populated
    await this.setState({ synonims: validatedDictionary });

    await checkValidation(
      this.state.synonims,
      this.addSynonim,
      this.handleValidatedDialog
    );
  }

  async handleDelete() {
    const { synonims, isEditingItem } = this.state;
    const rowsWithoutSelected = synonims.filter(
      synonim => synonim._id !== isEditingItem._id
    );
    await this.setState({
      synonims: [...rowsWithoutSelected],
      isEditingIndex: null,
    });
    this.handleDeleteDialog(null);
    await this.handleSave();
    await this.constructor.saveStateToLocalStorage(this.state.rows);
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
          handleClose={() => this.handleDeleteDialog(null)}
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
