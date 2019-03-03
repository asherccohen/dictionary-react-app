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
/* import { mainListItems, secondaryListItems } from '../components/listItems'; */
// import SimpleLineChart from '../components/SimpleLineChart';
/* import SimpleTable from '../components/Table'; */
import DictionaryTable from '../components/DictionaryTable';
import DeleteDialog from '../components/DeleteDialog';
// import EditDialog from '../components/EditDialog';
// import NewDomainDialog from '../components/NewDomainDialog';

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

class Dictionary extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      open: true,
      openDeleteDialog: false,
      // openEditDialog: false,
      // openAddDialog: false,
      isEditingItem: null,
      isEditingSynonim: null,
      dictionaryName: '',
      _id: null,
    };
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.addSynonim = this.addSynonim.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleValidate = this.handleValidate.bind(this);
    this.handleDeleteDialog = this.handleDeleteDialog.bind(this);
    this.keyPress = this.keyPress.bind(this);
    // this.handleEditDialog = this.handleEditDialog.bind(this);
    this.handleSave = this.handleSave.bind(this);
    // this.handleEdit = this.handleEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
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
      // console.log('No data in localStorage');
    }

    const dictionary = rows.find(row => row._id === id);
    const { synonims } = dictionary;
    // console.log('Found dictionary!', dictionary);
    this.setState({ rows, synonims, _id: id, dictionaryName: dictionary.name });
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

  /*   handleAddDialog() {
    this.setState({
      openAddDialog: !this.state.openAddDialog,
      // dictionaryName: '',
    });
  } */

  handleDeleteDialog(item) {
    this.setState({
      openDeleteDialog: !this.state.openDeleteDialog,
      isEditingItem: item,
    });
  }

  /*   handleEditDialog() {
    this.setState({
      openEditDialog: !this.state.openEditDialog,
      isEditingItem: null,
      // dictionaryName: '',
    });
  } */

  handleChange(e, id) {
    const { synonims } = this.state;

    const found = synonims.find(synonim => synonim._id === id);
    if (e.target.id === 'domain') found.domain = e.target.value;
    if (e.target.id === 'range') found.range = e.target.value;
  }

  keyPress(e) {
    if (e.keyCode === 13 && e.target.value) {
      // console.log('value', e.target.value);
      this.addSynonim();
    } else if (e.keyCode === 9) {
      // console.log('value', e.target.value);
    }
  }

  async addSynonim() {
    const { synonims } = this.state;
    synonims.push(this.constructor.createData());
    await this.setState({ synonims });
    /*     await localStorage.removeItem('dictionaries');
    await localStorage.setItem('dictionaries', JSON.stringify(this.state.rows)); */
    // this.handleAddDialog();
  }

  async handleSave() {
    const { rows, id, synonims } = this.state;
    const updated = rows.map(dictionary => {
      if (dictionary._id === id)
        return {
          ...dictionary,
          dictionary: synonims,
        };
      return dictionary;
    });
    // console.log('updated', updated);

    await this.setState({ rows: updated });
    // console.log('Saving!', this.state);
    await localStorage.removeItem('dictionaries');
    await localStorage.setItem('dictionaries', JSON.stringify(this.state.rows));
  }

  /*   handleEdit(id) {
    const { rows } = this.state;

    const found = rows.find(row => row.id === id);
    this.handleEditDialog();
    this.setState({ isEditingItem: found });
  } */
  handleValidate() {
    // console.log('Validating..', this.state.synonims);
    // Duplicate Domains / Ranges: Two rows in the dictionary map to the same value, simply resulting in duplicate content.
    // Forks or Duplicate Domains with different Ranges: Two rows in the dictionary map to different values, resulting in an ambiguous transformation.
    // Cycles: Two or more rows in a dictionary result in cycles, resulting in a never - ending transformation.
    // Chains: A chain structure in the dictionary (a value in Range column also appears in Domain column of another entry), resulting in inconsistent transformation.
    const { synonims } = this.state;

    const checkDuplicate = (array, property, string) => {
      // const arrayOfProperties = array.map(el => el[property]);
      // console.log('arrayOfProperties', arrayOfProperties);
      const isDuplicate = array.some(arrVal => string === arrVal[property]);
      /*       const isDuplicate = arrayOfProperties.some(
        (item, idx) => arrayOfProperties.indexOf(item) !== idx
      ); */
      // console.log('isDuplicate', isDuplicate);
      return isDuplicate;
    };
    const checkCycle = (array, property, domain) => {
      // const arrayOfProperties = array.map(el => el[property]);
      // console.log('arrayOfProperties', arrayOfProperties);
      const isDuplicate = array.some(arrVal => domain === arrVal[property]);
      return isDuplicate;
    };
    const noDuplicate = synonims.map(synonim => {
      const { domain } = synonim;
      const { range } = synonim;
      const newArr = synonims.filter(el => el !== synonim);

      const isDuplicateDomain = checkDuplicate(newArr, 'domain', domain);
      if (isDuplicateDomain) return { ...synonim, isDuplicateDomain: true };
      const isDuplicateRange = checkDuplicate(newArr, 'range', range);
      if (isDuplicateRange) return { ...synonim, isDuplicateRange: true };
      return { ...synonim, isDuplicateDomain: false, isDuplicateRange: false };
    });

    /*     const noDuplicateRanges = noDuplicateDomains.map(synonim => {
      const { range } = synonim;
      const newArr = noDuplicateDomains.filter(el => el !== synonim);

      const isDuplicate = checkDuplicate(newArr, 'range', range);
      if (isDuplicate) return { ...synonim, isDuplicateRange: true };
      return { ...synonim, isDuplicateRange: false };
    }); */

    const noCycle = noDuplicate.map(synonim => {
      const { domain } = synonim;
      const { range } = synonim;
      const newArr = noDuplicate.filter(el => el !== synonim);

      const isCycleDomain = checkCycle(newArr, 'range', domain);
      const isCycleRange = checkCycle(newArr, 'domain', range);
      if (isCycleDomain) return { ...synonim, isCycle: true };
      if (isCycleRange) return { ...synonim, isCycle: true };
      return { ...synonim, isCycle: false };
    });
    console.log('noCycle', noCycle);

    this.setState({ synonims: noCycle });
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

    /* await localStorage.removeItem('dictionaries');
    await localStorage.setItem('dictionaries', JSON.stringify(this.state.rows)); */
  }

  render() {
    const { classes } = this.props;
    const {
      synonims,
      openDeleteDialog,
      dictionaryName,
      // openEditDialog,
      // openAddDialog,
      // isEditingItem,
    } = this.state;

    return (
      <div className={classes.root}>
        <DeleteDialog
          open={openDeleteDialog}
          handleClose={this.handleDeleteDialog}
          handleDelete={this.handleDelete}
        />
        {/*         <EditDialog
          open={openEditDialog}
          item={isEditingItem}
          handleClose={this.handleEditDialog}
          handleSave={this.handleSave}
          handleChange={this.handleChange}
        /> */}
        {/*         <NewDomainDialog
          open={openAddDialog}
          handleClose={this.handleAddDialog}
          handleSave={this.addDictionary}
          handleChange={this.handleChange}
        /> */}
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
              />
            ) : null}
          </div>
          <div className={classes.add}>
            <Fab
              color="primary"
              aria-label="Add"
              className={classes.fab}
              onClick={this.addSynonim}
            >
              <AddIcon />
            </Fab>
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
