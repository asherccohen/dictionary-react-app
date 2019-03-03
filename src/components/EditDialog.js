import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import EditForm from './EditForm';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

function EditDialog(props) {
  const { open, handleClose, handleSave, item, handleChange } = props;

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {'Edit the name for your dictionary:'}
        </DialogTitle>
        <DialogContent>
          {/* <DialogContentText id="alert-dialog-slide-description"> */}
          <EditForm item={item} handleChange={handleChange} />
          {/* The process cannot be reverted so choose carefully. */}
          {/*       </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
EditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  item: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
};

export default EditDialog;
