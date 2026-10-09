import * as yup from 'yup';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { registerUser, selectIsAuth } from '@/redux/slices/auth';
import { convertToBase64 } from '@/utils/base64';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { AuthCard } from '@/components/common/AuthCard/AuthCard';
import styles from './Register.module.scss';

const schema = yup.object().shape({
  username: yup.string().min(2).required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(5, 'Password must be at least 5 characters')
    .required('Password is required'),
});

export const Register = () => {
  const [avatarPreview, setAvatarPreview] = useState('');
  const [submitError, setSubmitError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleFileUpload = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setSubmitError('Avatar must be 2 MB or smaller');
      return;
    }
    try {
      const avatarToBase64 = await convertToBase64(file);
      setAvatarPreview(avatarToBase64);
    } catch {
      alert('Failed to read the selected image');
    }
  };

  const onSubmit = async values => {
    setSubmitError('');
    try {
      await dispatch(
        registerUser({
          username: values.username,
          email: values.email,
          password: values.password,
          avatarUrl: avatarPreview,
        })
      ).unwrap();
    } catch (error) {
      setSubmitError(error?.message || 'Registration failed');
      return;
    }
    navigate('/');
  };

  const isAuth = useSelector(selectIsAuth);

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <AuthCard
      className={styles.form}
      titleClassName={styles.title}
      title="Create Your Account"
      error={submitError}
    >
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
          {...register('avatar', { onChange: e => handleFileUpload(e) })}
        />
        <TextField
          error={Boolean(errors.username?.message)}
          helperText={errors.username?.message}
          {...register('username')}
          className={styles.field}
          label="Username"
          fullWidth
        />
        <TextField
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          autoComplete="email"
          {...register('email')}
          className={styles.field}
          label="E-Mail"
          fullWidth
        />
        <TextField
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          type="password"
          autoComplete="new-password"
          {...register('password')}
          className={styles.field}
          label="Password"
          fullWidth
        />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Register
        </Button>
      </form>
    </AuthCard>
  );
};
