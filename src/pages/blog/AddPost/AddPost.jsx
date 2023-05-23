import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { selectIsAuth } from '@/redux/slices/auth';
import { useSelector } from 'react-redux';
import { Container } from '@mui/material';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import axios from '@/utils/axios';
import styles from './AddPost.module.scss';
import 'easymde/dist/easymde.min.css';

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const inputFileRef = useRef(null);

  const isEditing = Boolean(id);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setImageUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert(err.message);
    }
  };

  const removeImage = () => {
    setImageUrl('');
  };

  const addText = useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      const values = {
        title,
        imageUrl,
        text,
      };
      isEditing
        ? await axios.patch(`/posts/${id}`, values)
        : await axios.post('/posts', values);
      navigate(`/blog`);
    } catch (err) {
      console.warn(err);
      alert(err.message);
    }
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setText(data.text);
          setImageUrl(data.imageUrl);
        })
        .catch((err) => {
          console.warn(err);
          alert(err.message);
        });
    }
  }, [id]);

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Enter text...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Container maxWidth="lg" style={{ padding: '2rem 0' }}>
      <Paper style={{ padding: 30 }}>
        <Button
          onClick={() => inputFileRef.current.click()}
          variant="outlined"
          size="large"
          style={{ marginBottom: '0.5rem' }}
        >
          Download Picture
        </Button>
        <input
          ref={inputFileRef}
          type="file"
          onChange={handleChangeFile}
          hidden
        />
        {imageUrl && (
          <>
            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={removeImage}
              style={{ marginLeft: '0.5rem', marginBottom: '0.5rem' }}
            >
              Delete
            </Button>
            <img
              className={styles.image}
              src={`${import.meta.env.VITE_APP_API_URL}${imageUrl}`}
              alt="Uploaded"
            />
          </>
        )}
        <br />
        <br />
        <TextField
          classes={{ root: styles.title }}
          variant="standard"
          placeholder="Post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
        <SimpleMDE
          className={styles.editor}
          value={text}
          onChange={addText}
          options={options}
        />
        <div className={styles.buttons}>
          <Button onClick={onSubmit} size="large" variant="contained">
            {isEditing ? 'Save' : 'Publish'}
          </Button>
          <a href="/">
            <Button size="large">Cancel</Button>
          </a>
        </div>
      </Paper>
    </Container>
  );
};
