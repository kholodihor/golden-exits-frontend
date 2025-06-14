import * as yup from 'yup';
import React, { useState } from 'react';
import axios from '@/utils/axios';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dropzone from 'react-dropzone';
import styles from './UploadVideo.module.scss';

export const UploadVideo = () => {
  const navigate = useNavigate();
  const userData = useSelector(state => state.auth.data);
  const [video, setVideo] = useState('');
  const [videoName, setVideoName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const schema = yup.object().shape({
    title: yup.string().required('Title is required'),
    genre: yup.string().required('Genre is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      genre: '',
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const setFileToBase64 = file => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setVideo(reader.result);
    };
  };

  const onDrop = async files => {
    const file = files[0];
    setVideoName(file.name);
    setFileToBase64(file);
  };

  const onSubmit = async values => {
    if (submitting || !video) return;

    setSubmitting(true);
    setUploading(true);

    try {
      const { data } = await axios.post('/uploadvideo', { video });
      const fields = {
        user: userData._id,
        title: values.title,
        genre: values.genre,
        url: data.url,
        likes: {},
        views: 0,
      };

      await axios.post('/videos', fields);
      alert(`Video '${fields.title}' Uploaded Successfully`);
      navigate('/video');
    } catch (error) {
      console.error('Error uploading video:', error);
      alert(error.response?.data?.message || 'Failed to upload video. Please try again.');
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className={styles.UploadVideo}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.left}>
          <h1>Upload your Video</h1>
          <Dropzone onDrop={onDrop} multiple={false} maxSize={8000000000}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div className={styles.dropzone} {...getRootProps()}>
                  <input {...getInputProps()} />
                  {uploading && <p>Wait a little while we are uploading your video...</p>}
                  {!videoName && !uploading && (
                    <AiOutlinePlus style={{ fontSize: '2rem', cursor: 'pointer' }} />
                  )}
                  {videoName && !uploading && <p>{videoName}</p>}
                </div>
              </section>
            )}
          </Dropzone>
        </div>

        <div className={styles.right}>
          <TextField
            error={Boolean(errors.title?.message)}
            helperText={errors.title?.message}
            type="title"
            {...register('title', { required: 'Name Your Video' })}
            label="Title"
            fullWidth
          />
          <TextField
            error={Boolean(errors.genre?.message)}
            helperText={errors.genre?.message}
            type="genre"
            {...register('genre', {
              required: 'What is the genre of your Video',
            })}
            label="Genre"
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!video || submitting}
            sx={{
              mt: 2,
              minWidth: 120,
              '&.Mui-disabled': {
                backgroundColor: 'rgba(0, 0, 0, 0.12)',
                color: 'rgba(0, 0, 0, 0.26)',
              },
            }}
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  );
};
