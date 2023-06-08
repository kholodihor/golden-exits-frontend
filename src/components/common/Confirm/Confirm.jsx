import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@mui/material';
import styles from './Confirm.module.scss';

const Confirm = ({ confirmDialog, setConfirmDialog }) => {
  return (
    <Dialog open={confirmDialog.isOpen} className={styles.Dialog}>
      <DialogContent className={styles.content}>
        <Typography variant="h6">{confirmDialog.title}</Typography>
        <Typography variant="subtitle2">{confirmDialog.subtitle}</Typography>
      </DialogContent>
      <DialogActions className={styles.actions}>
        <button className={styles.yes} onClick={confirmDialog.onConfirm}>
          Yes
        </button>
        <button
          className={styles.no}
          onClick={() => setConfirmDialog({ isOpen: false })}
        >
          No
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default Confirm;
