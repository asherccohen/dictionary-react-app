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
import { mainListItems, secondaryListItems } from '../components/listItems';
import DictionariesOverview from '../components/DictionariesOverview';
import DeleteDialog from '../components/DeleteDialog';
import EditDialog from '../components/EditDialog';
import NewDictionaryDialog from '../components/NewDictionaryDialog';

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
    // display: 'flex',
    // alignItems: 'flex-end',
    // justifyItems: 'flex-end',
    // justifyContent: 'flex-end',
    // marginBottom: theme.spacing.unit * 2,
    position: 'absolute',
    // marginBottom: 50,
    // marginRight: 50,
    right: 50,
    bottom: 50,
  },
  fab: {
    margin: theme.spacing.unit,
  },
});
const dictionaries = require('../assets/data/dictionaries.json');

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      open: true,
      openDeleteDialog: false,
      openEditDialog: false,
      openAddDialog: false,
      isEditingItem: null,
      dictionaryName: '',
    };
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.addDictionary = this.addDictionary.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddDialog = this.handleAddDialog.bind(this);
    this.handleDeleteDialog = this.handleDeleteDialog.bind(this);
    this.handleEditDialog = this.handleEditDialog.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
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
      // console.log('No data in localStorage');
      // console.log('dictionaries', dictionaries);
      rows = dictionaries;
      localStorage.setItem('dictionaries', JSON.stringify(rows));
    }
    this.setState({ rows });
  }

  static createData(name) {
    const createData = () => ({
      _id: uuid.v4(),
      name,
      validation: null,
      synonims: [],
    });
    return createData();
  }

  handleDrawerOpen() {
    this.setState({ open: true });
  }

  handleDrawerClose() {
    this.setState({ open: false });
  }

  handleAddDialog() {
    this.setState({
      openAddDialog: !this.state.openAddDialog,
      dictionaryName: '',
    });
  }

  handleDeleteDialog(item) {
    this.setState({
      openDeleteDialog: !this.state.openDeleteDialog,
      isEditingItem: item,
    });
  }

  handleEditDialog() {
    this.setState({
      openEditDialog: !this.state.openEditDialog,
      isEditingItem: null,
      dictionaryName: '',
    });
  }

  handleChange(e) {
    this.setState({ dictionaryName: e.target.value });
  }

  /*   handleClose(){
    this.setState({ open: false });
  }; */

  async addDictionary() {
    const { rows, dictionaryName } = this.state;
    rows.push(this.constructor.createData(dictionaryName, null));
    await this.setState({ ...rows });
    await localStorage.removeItem('dictionaries');
    await localStorage.setItem('dictionaries', JSON.stringify(this.state.rows));
    this.handleAddDialog();
  }

  async handleSave() {
    const { rows, isEditingItem, dictionaryName } = this.state;
    const updated = rows.map(el => {
      if (el.id === isEditingItem.id)
        return {
          ...el,
          name: dictionaryName,
        };
      return el;
    });

    await this.setState({ rows: updated });
    await localStorage.removeItem('dictionaries');
    await localStorage.setItem('dictionaries', JSON.stringify(this.state.rows));
    this.handleEditDialog();
  }

  handleEdit(id) {
    const { rows } = this.state;

    const found = rows.find(row => row._id === id);
    this.handleEditDialog();
    this.setState({ isEditingItem: found });
  }

  async handleDelete() {
    const { rows, isEditingItem } = this.state;

    const found = rows.find(row => row._id === isEditingItem._id);

    const filtered = rows.filter(el => el._id !== found._id);
    this.handleDeleteDialog();
    await this.setState({ rows: filtered, isEditingItem: null });
    await localStorage.removeItem('dictionaries');
    await localStorage.setItem('dictionaries', JSON.stringify(this.state.rows));
  }

  render() {
    const { classes } = this.props;
    const {
      rows,
      openDeleteDialog,
      openEditDialog,
      openAddDialog,
      isEditingItem,
    } = this.state;

    return (
      <div className={classes.root}>
        <DeleteDialog
          open={openDeleteDialog}
          handleClose={this.handleDeleteDialog}
          handleDelete={this.handleDelete}
        />
        <EditDialog
          open={openEditDialog}
          item={isEditingItem}
          handleClose={this.handleEditDialog}
          handleSave={this.handleSave}
          handleChange={this.handleChange}
        />
        <NewDictionaryDialog
          open={openAddDialog}
          handleClose={this.handleAddDialog}
          handleSave={this.addDictionary}
          handleChange={this.handleChange}
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
          <List>{secondaryListItems}</List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          {/*           <Typography variant="h4" gutterBottom component="h2">
            Orders
          </Typography>
          <Typography component="div" className={classes.chartContainer}>
            <SimpleLineChart />
          </Typography> */}
          <Typography variant="h4" gutterBottom component="h2">
            Dictionaries
          </Typography>
          <div className={classes.tableContainer}>
            <DictionariesOverview
              rows={rows}
              deleteDictionary={this.handleDeleteDialog}
              editDictionary={this.handleEdit}
            />
          </div>
          <div className={classes.add}>
            <Fab
              color="primary"
              aria-label="Add"
              className={classes.fab}
              onClick={this.handleAddDialog}
            >
              <AddIcon />
            </Fab>
          </div>
        </main>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
