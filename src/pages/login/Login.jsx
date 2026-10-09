import * as yup from 'yup';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { Navigate, useNavigate } from 'react-router-dom';
import { loginUser, selectIsAuth } from '@/redux/slices/auth';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { AuthCard } from '@/components/common/AuthCard/AuthCard';
import styles from './Login.module.scss';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const Login = () => {
  const [submitError, setSubmitError] = useState('');
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    setSubmitError('');
    try {
      await dispatch(loginUser(values)).unwrap();
    } catch (error) {
      setSubmitError(error?.message || 'Authorization failed');
      return;
    }
    navigate('/');
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Container classes={{ root: styles.wrapper }}>
      <AuthCard
        className={styles.form}
        titleClassName={styles.title}
        title="Enter to Account"
        error={submitError}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            className={styles.field}
            label="E-Mail"
            error={Boolean(errors.email?.message)}
            helperText={errors.email?.message}
            type="email"
            autoComplete="email"
            {...register('email')}
            fullWidth
          />
          <TextField
            className={styles.field}
            label="Password"
            type="password"
            autoComplete="current-password"
            error={Boolean(errors.password?.message)}
            helperText={errors.password?.message}
            {...register('password')}
            fullWidth
          />
          <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
            LogIn
          </Button>
        </form>
      </AuthCard>
    </Container>
  );
};
