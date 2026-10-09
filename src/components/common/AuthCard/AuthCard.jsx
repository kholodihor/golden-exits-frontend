import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';

export const AuthCard = ({ title, titleClassName, error, children, className }) => (
  <Paper classes={{ root: className }}>
    <Typography classes={{ root: titleClassName }} variant="h5">
      {title}
    </Typography>
    {error && (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )}
    {children}
  </Paper>
);
