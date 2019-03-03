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

function NewDictionaryForm(props) {
  const { classes, handleChange } = props;
  return (
    <div className={classes.container}>
      <Input
        placeholder="Type a name.."
        className={classes.input}
        inputProps={{
          'aria-label': 'Description',
        }}
        onChange={handleChange}
      />
    </div>
  );
}

NewDictionaryForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(NewDictionaryForm);
