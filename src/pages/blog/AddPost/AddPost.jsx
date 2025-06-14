import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { logger } from '@/utils/logger';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { selectIsAuth } from '@/redux/slices/auth';
import { useSelector } from 'react-redux';
import { Container, CircularProgress, Alert, Snackbar } from '@mui/material';
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
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({
    title: false,
    text: false,
    image: false,
  });
  const inputFileRef = useRef(null);

  const isEditing = Boolean(id);

  // Form validation
  const errors = {
    title: !title.trim() ? 'Title is required' : '',
    text: !text.trim() ? 'Content is required' : '',
    image: !image && 'Image is required',
  };

  const isFormValid = Object.values(errors).every(x => !x);

  const handleBlur = useCallback(field => {
    setTouched(prev => ({
      ...prev,
      [field]: true,
    }));
  }, []);

  const showError = field => touched[field] && errors[field];

  const handleImage = event => {
    const file = event.target.files[0];
    if (!file) return;

    // Basic image validation
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setUploading(true);
    setError('');
    setFileToBase64(file);
  };

  const setFileToBase64 = file => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
      setTouched(prev => ({ ...prev, image: true }));
      setUploading(false);
    };
    reader.onerror = () => {
      setError('Failed to process image');
      setUploading(false);
    };
  };

  const removeImage = () => {
    setImage('');
  };

  const addText = useCallback(value => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    if (!isFormValid) {
      // Mark all fields as touched to show errors
      setTouched({
        title: true,
        text: true,
        image: true,
      });
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Upload image first if it's a new image (not a URL from edit)
      let imageUrl = image;
      if (image && !image.startsWith('http')) {
        const { data } = await axios.post('/upload', { image });
        imageUrl = data.url;
      }

      const values = {
        title: title.trim(),
        text: text.trim(),
        imageUrl,
      };

      if (isEditing) {
        await axios.patch(`/posts/${id}`, values);
      } else {
        await axios.post('/posts', values);
      }

      navigate(`/blog`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      logger.error('Post submission failed:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setText(data.text);
          setImage(data.imageUrl);
          setError('');
        })
        .catch(err => {
          const errorMessage = err.response?.data?.message || err.message || 'Failed to load post';
          setError(errorMessage);
          logger.warn('Failed to load post:', errorMessage);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '40vh',
      autofocus: true,
      placeholder: 'Content of Your Post',
      status: false,
      autosave: {
        enabled: false,
        uniqueId: 'postContent',
        delay: 1000,
      },
      toolbar: loading
        ? false
        : [
            'bold',
            'italic',
            'heading',
            '|',
            'quote',
            'unordered-list',
            'ordered-list',
            '|',
            'link',
            'image',
            '|',
            'preview',
            'side-by-side',
            'fullscreen',
            '|',
            'guide',
          ],
    }),
    [loading]
  );

  // Memoize the editor value to prevent unnecessary re-renders
  const editorValue = useMemo(() => text, [text]);

  const handleCloseSnackbar = () => {
    setError('');
  };

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Container maxWidth="lg" style={{ padding: '2rem 0' }}>
      <Paper style={{ padding: 30, position: 'relative' }}>
        {/* {(loading || uploading) && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80vw',
              backgroundColor: 'background.paper',
              boxShadow: 24,
              p: 4,
              outline: 'none',
              alignItems: 'center',
              zIndex: 10,
            }}
          >
            <CircularProgress />
          </div>
        )} */}

        <Button
          onClick={() => inputFileRef.current.click()}
          size="large"
          className={styles.download}
          style={{ marginBottom: '0.5rem' }}
          disabled={loading || uploading}
        >
          {uploading ? 'Uploading...' : 'Download Picture'}
        </Button>
        <input
          ref={inputFileRef}
          type="file"
          onChange={handleImage}
          accept="image/*"
          hidden
          disabled={loading || uploading}
        />
        {image && (
          <>
            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={removeImage}
              style={{ marginLeft: '0.5rem', marginBottom: '0.5rem' }}
              disabled={loading || uploading}
            >
              Delete
            </Button>
            <img className={styles.image} src={image} alt="Uploaded Image" />
          </>
        )}
        {showError('image') && (
          <div style={{ color: 'red', fontSize: '0.75rem', marginTop: '0.5rem' }}>
            {errors.image}
          </div>
        )}
        <br />
        <br />
        <TextField
          className={styles.title}
          variant="standard"
          placeholder="Post title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={() => handleBlur('title')}
          error={showError('title')}
          helperText={showError('title') ? errors.title : ' '}
          fullWidth
        />
        <div style={{ marginTop: '1rem' }}>
          <SimpleMDE
            key={isEditing ? 'edit' : 'create'} // Force re-render when switching modes
            className={styles.editor}
            value={editorValue}
            onChange={addText}
            onBlur={() => handleBlur('text')}
            options={options}
          />
          {showError('text') && (
            <div
              style={{
                color: 'red',
                fontSize: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              {errors.text}
            </div>
          )}
        </div>
        <div className={styles.buttons}>
          <Button
            onClick={onSubmit}
            size="large"
            className={styles.submit}
            disabled={loading || uploading || !isFormValid}
          >
            {loading ? 'Processing...' : isEditing ? 'Save' : 'Publish'}
          </Button>
          <Button
            onClick={() => navigate(-1)}
            size="large"
            className={styles.cancel}
            disabled={loading || uploading}
          >
            Cancel
          </Button>
        </div>
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};
