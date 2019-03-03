import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  /*   root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  }, */
  pageContainerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    // backgroundSize: 'cover',
    // mixBlendMode: 'overlay',
  },
};
const broken = require('../assets/images/404.jpg');

function NoMatchPage(props) {
  const { classes } = props;

  return (
    <div
      className={classes.pageContainerBg}
      style={{ backgroundImage: `url(${broken})` }}
    />
  );
}

NoMatchPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NoMatchPage);
