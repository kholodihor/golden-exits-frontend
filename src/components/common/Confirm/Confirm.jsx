import {
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  Button,
} from '@mui/material';
import styles from './Confirm.module.scss';

const Confirm = ({ isOpen = false, title = '', subtitle = '', onConfirm, onClose }) => {
  return (
    <Dialog
      open={isOpen}
      className={styles.Dialog}
      onClose={onClose}
    >
      <DialogContent className={styles.content}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="subtitle2">{subtitle}</Typography>
      </DialogContent>
      <DialogActions className={styles.actions}>
        <Button
          variant="contained"
          color="primary"
          className={styles.yes}
          onClick={onConfirm}
        >
          Yes
        </Button>
        <Button
          variant="outlined"
          color="error"
          className={styles.no}
          onClick={onClose}
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Confirm;
