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
      {/* 
      <Input
        placeholder="Placeholder"
        className={classes.input}
        inputProps={{
          'aria-label': 'Description',
        }}
      />

      <Input
        value="Disabled"
        className={classes.input}
        disabled
        inputProps={{
          'aria-label': 'Description',
        }}
      />

      <Input
        defaultValue="Error"
        className={classes.input}
        error
        inputProps={{
          'aria-label': 'Description',
        }}
      /> */}
    </div>
  );
}

EditForm.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(EditForm);
