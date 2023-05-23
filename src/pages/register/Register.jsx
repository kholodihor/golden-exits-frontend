import * as yup from 'yup';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { registerUser, selectIsAuth } from '@/redux/slices/auth';
import { convertToBase64 } from '@/utils/base64';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import styles from './Register.module.scss';

export const Register = () => {
  const [avatarPreview, setAvatarPreview] = useState('');
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    username: yup.string().min(2).required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
      .string()
      .min(5, 'Password must be at least 5 characters')
      .required('Password is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const avatarToBase64 = await convertToBase64(file);
    setAvatarPreview(avatarToBase64);
  };

  const onSubmit = async (values) => {
    const file = values.avatar[0];
    const avatarToBase64 = await convertToBase64(file);
    const data = await dispatch(registerUser({
      username: values.username,
      email: values.email,
      password: values.password,
      avatarUrl: avatarToBase64,
    }));

    if (!data.payload) {
      return alert('Registration Failed');
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.form }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Create Your Account
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="fileUpload">
          <div className={styles.avatar}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="" className={styles.avatarImg} />
            ) : (
              <Avatar sx={{ width: 100, height: 100 }} />
            )}
          </div>
        </label>
        <input
          hidden
          type="file"
          name="avatar"
          id="fileUpload"
          label="Avatar"
          accept=".jpeg, .jpg, .png, .webp"
          {...register('avatar', { onChange: (e) => handleFileUpload(e) })}
        />
        <TextField
          error={Boolean(errors.username?.message)}
          helperText={errors.username?.message}
          {...register('username', { required: 'Enter Your Username' })}
          className={styles.field}
          label="Username"
          fullWidth
        />
        <TextField
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          {...register('email', { required: 'Enter Your Email' })}
          className={styles.field}
          label="E-Mail"
          fullWidth
        />
        <TextField
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          type="password"
          {...register('password', { required: 'Enter your Password' })}
          className={styles.field}
          label="Password"
          fullWidth
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Register
        </Button>
      </form>
    </Paper>
  );
};
