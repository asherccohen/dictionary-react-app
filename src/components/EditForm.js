import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  input: {
    margin: theme.spacing.unit,
  },
});

function EditForm(props) {
  const { classes, item, handleChange } = props;
  return (
    <div className={classes.container}>
      {item ? (
        <Input
          defaultValue={item.name || ''}
          className={classes.input}
          inputProps={{
            'aria-label': 'Description',
          }}
          onChange={handleChange}
        />
      ) : null}
    </div>
  );
}

EditForm.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(EditForm);
