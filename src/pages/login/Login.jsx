import * as yup from 'yup';
import { useIsAuth } from '@/hooks/useIsAuth';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { Navigate, useNavigate } from 'react-router-dom';
import { loginUser } from '@/redux/slices/auth';
import { useForm } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import styles from './Login.module.scss';

export const Login = () => {
  const isAuth = useIsAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(5, 'Password must be at least 5 characters'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async values => {
    let payload;
    try {
      payload = await dispatch(loginUser(values)).unwrap();
    } catch {
      return alert('Authorization Failed');
    }

    if (payload && 'token' in payload) {
      window.localStorage.setItem('token', payload.token);
    }
    navigate('/');
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Container classes={{ root: styles.wrapper }}>
      <Paper classes={{ root: styles.form }}>
        <Typography classes={{ root: styles.title }} variant="h5">
          Enter to Account
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            className={styles.field}
            label="E-Mail"
            error={Boolean(errors.email?.message)}
            helperText={errors.email?.message}
            type="email"
            autoComplete="email"
            {...register('email', { required: 'Enter Email' })}
            fullWidth
          />
          <TextField
            className={styles.field}
            label="Password"
            type="password"
            autoComplete="current-password"
            error={Boolean(errors.password?.message)}
            helperText={errors.password?.message}
            {...register('password', { required: 'Enter Password' })}
            fullWidth
          />
          <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
            LogIn
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
