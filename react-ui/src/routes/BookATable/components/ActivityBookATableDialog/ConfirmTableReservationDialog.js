import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function ConfirmTableReservationDialog(props) {
  const { onRequestClose, handleOk, open, tableNumber, ...other } = props;

  return (
      <Dialog
        open={open}
        aria-labelledby="reservation-table-confirm-dialog-title"
        aria-describedby="reservation-table-confirm-dialog-description"
        onClose={onRequestClose}
        {...other}
      >
        <DialogTitle id="reservation-table-confirm-dialog-title">ยืนยันการจองโต๊ะ</DialogTitle>
        <DialogContent>
          <DialogContentText id="reservation-table-confirm-dialog-description">
            คุณต้องการจองโต๊ะที่ {tableNumber} หรือไม่
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

ConfirmTableReservationDialog.propTypes = {
  onRequestClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleOk: PropTypes.func.isRequired,
  tableNumber: PropTypes.string.isRequired,
};

export default ConfirmTableReservationDialog