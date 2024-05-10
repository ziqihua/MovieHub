import { useEffect, useState } from 'react';
import { Box, Button, Modal, CircularProgress, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const config = require('../config.json');

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: '#ff5252',
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
    fontFamily: 'Arial',
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    body1: {
      fontSize: '1.1rem',
    },
  },
});

export default function MovieCard() {
  const { movie_id } = useParams();
  const [movieData, setMovieData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (movie_id) {
      setLoading(true);
      fetch(`http://${config.server_host}:${config.server_port}/movie/${movie_id}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then(resJson => {
          setMovieData(resJson);
          setLoading(false);
        })
        .catch(err => {
          setError(`Failed to load movie data: ${err.message}`);
          setLoading(false);
        });
    }
  }, [movie_id]);

  const handleClose = () => {
    navigate(-1);  // Navigate back
  };

  return (
    <ThemeProvider theme={theme}>
      <Modal
        open={true}
        onClose={handleClose}
        aria-labelledby="movie-details-modal"
        aria-describedby="modal-modal-description"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box
          p={4}
          style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #ccc',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            width: 400,
            maxWidth: '90vw',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : movieData ? (
            <>
              <Typography variant="h4">{movieData.primaryTitle || 'Unknown Title'}</Typography>
              <Typography variant="body1">Adult: {movieData.isAdult || 'N/A'}</Typography>
              <Typography variant="body1">Year: {movieData.startYear || 'N/A'}</Typography>
              <Typography variant="body1">Runtime: {movieData.runtimeMinutes || 'N/A'} minutes</Typography>
              <Typography variant="body1">Genres: {movieData.genres || 'N/A'}</Typography>
            </>
          ) : (
            <Typography>No data available for this movie.</Typography>
          )}
          <Button variant="contained" color="primary" onClick={handleClose} style={{ marginTop: 20 }}>
            Return
          </Button>
        </Box>
      </Modal>
    </ThemeProvider>
  );
}
