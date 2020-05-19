import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function DeleteTableReservationDialog(props) {
  const { onRequestClose, handleOk, open, tableNumber, ...other } = props;

  return (
    <Dialog
      open={open}
      aria-labelledby="reservation-table-cancel-dialog-title"
      aria-describedby="reservation-table-cancel-dialog-description"
      onClose={onRequestClose}
      {...other}
    >
      <DialogTitle id="reservation-table-cancel-dialog-title">
        ลบโต๊ะ
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="reservation-table-cancel-dialog-description">
          คุณต้องการลบโต๊ะที่ {tableNumber} หรือไม่
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onRequestClose} color="primary">
          ยกเลิก
        </Button>
        <Button onClick={handleOk} color="primary" autoFocus>
          ตกลง
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DeleteTableReservationDialog.propTypes = {
  onRequestClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleOk: PropTypes.func.isRequired,
  tableNumber: PropTypes.string.isRequired
};

export default DeleteTableReservationDialog