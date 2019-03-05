import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';

export const mainListItems = (
  <div>
    <Link component={RouterLink} to="/" primary="Overview">
      <ListItem button>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>

        <ListItemText primary="Overview" />
      </ListItem>
    </Link>
    <ListItem button>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Reports" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Integrations" />
    </ListItem>
  </div>
);

export const secondaryListItems = rows => {
  const subset = rows ? rows.slice(0, 4) : null;
  console.log('subset', subset);

  return (
    <div>
      <ListSubheader inset>Recent dictionaries</ListSubheader>
      {subset &&
        subset.map(row => (
          <Link
            component={RouterLink}
            to={{ pathname: `/dictionary/${row._id}` }}
            primary="Overview"
            key={row._id}
          >
            <ListItem button>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary={row.name} />
            </ListItem>
          </Link>
        ))}
    </div>
  );
};
