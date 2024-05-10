import { useEffect, useState } from 'react';
import { Container, Divider, Link, MenuItem, FormControl, Select, InputLabel, Grid, Box, Button, TextField, Typography} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

export default function HomePage() {
  const [genre, setGenre] = useState('Action');
  const [movies, setMovies] = useState([]);
  const [runtimeLimit, setRuntimeLimit] = useState(0);
  const [randomMovie, setRandomMovie] = useState(null);

  useEffect(() => {
    fetchMovies(); // Initial fetch based on default genre
  }, [genre]); // Fetch movies whenever genre changes

  const fetchMovies = () => {
    fetch(`http://${config.server_host}:${config.server_port}/top_by_genre?genre=${genre}`)
      .then(res => res.json())
      .then(data => {
        setMovies(data.map(movie => ({ ...movie, id: movie.title + movie.release_year }))); 
      });
  };



  // const fetchRandomMovie = () => {
  //   fetch(`http://${config.server_host}:${config.server_port}/random_by_runtime?runtime_limit=${runtimeLimit}`)
  //     .then(response => response.json())
  //     .then(movie => setRandomMovie(movie));
  // };

  const fetchRandomMovie = () => {
    fetch(`http://${config.server_host}:${config.server_port}/random_by_runtime?runtime_limit=${runtimeLimit}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch random movie');
            }
            return response.json();
        })
        .then(movie => {
            if (!movie) {
                throw new Error('No movie returned');
            }
            setRandomMovie(movie);
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert(error.message);  // or set this error to state and display in UI
        });
  };

 
  const movieColumns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    // { field: 'genre', headerName: 'Genre', flex: 1 },
    // { field: 'release_year', headerName: 'Release Year', flex: 1 },
    { field: 'score', headerName: 'Score', flex: 1 },
    { field: 'country', headerName: 'Country', flex: 1 },
    // { field: 'age_certifications', headerName: 'Age Restriction', flex: 1 },
    // { field: 'available_on', headerName: 'Platform', flex: 1 },
    // { field: 'description', headerName: 'Description', flex: 2 }
  ];



  return (
    <Container>
      <Box sx={{ my: 2 }}>
        <TextField
          label="Runtime Limit (in minutes)"
          type="number"
          value={runtimeLimit}
          onChange={e => setRuntimeLimit(Number(e.target.value))}
          helperText="Enter maximum runtime in minutes"
        />
        <Button onClick={fetchRandomMovie} variant="outlined" sx={{ mx: 1 }}>
          Get Random Movie
        </Button>
        {randomMovie && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Title: {randomMovie.title} </Typography>
            <Typography>Genre: {randomMovie.genre}</Typography>
            <Typography>Runtime: {randomMovie.runtime} minutes</Typography>
            <Typography>Country: {randomMovie.country}</Typography>
          </Box>
        )}
      </Box>

    

      <h2>Top Movies by Genre</h2>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl style={{ width: '25%' }}>
            <InputLabel id="genre-label">Genre</InputLabel>
            <Select
              labelId="genre-label"
              id="genre-select"
              value={genre}
              label="Genre"
              onChange={(e) => setGenre(e.target.value)}
            >
              <MenuItem value="Action">Action</MenuItem>
              <MenuItem value="Comedy">Comedy</MenuItem>
              <MenuItem value="Drama">Drama</MenuItem>
              <MenuItem value="Horror">Horror</MenuItem>
              <MenuItem value="Sci-Fi">Sci-Fi</MenuItem>
              <MenuItem value="Romance">Romance</MenuItem>
              <MenuItem value="Documentary">Documentary</MenuItem>
              <MenuItem value="Animation">Animation</MenuItem>
              <MenuItem value="Comedy">Comedy</MenuItem>
              <MenuItem value="Short">Short</MenuItem>
              <MenuItem value="Romance">Romance</MenuItem>
              <MenuItem value="News">News</MenuItem>
              <MenuItem value="Drama">Drama</MenuItem>
              <MenuItem value="Fantasy">Fantasy</MenuItem>
              <MenuItem value="Horror">Horror</MenuItem>
              <MenuItem value="Biography">Biography</MenuItem>
              <MenuItem value="Music">Music</MenuItem>
              <MenuItem value="Crime">Crime</MenuItem>
              <MenuItem value="Family">Family</MenuItem>
              <MenuItem value="Adventure">Adventure</MenuItem>
              <MenuItem value="Action">Action</MenuItem>
              <MenuItem value="History">History</MenuItem>
              <MenuItem value="Mystery">Mystery</MenuItem>
              <MenuItem value="Musical">Musical</MenuItem>
              <MenuItem value="War">War</MenuItem>
              <MenuItem value="Sci-Fi">Sci-Fi</MenuItem>
              <MenuItem value="Western">Western</MenuItem>
              <MenuItem value="Thriller">Thriller</MenuItem>
              <MenuItem value="Sport">Sport</MenuItem>
              <MenuItem value="Film-Noir">Film-Noir</MenuItem>
              <MenuItem value="Talk-Show">Talk-Show</MenuItem>
              <MenuItem value="Game-Show">Game-Show</MenuItem>
              <MenuItem value="Adult">Adult</MenuItem>
              <MenuItem value="Reality-TV">Reality-TV</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* <Grid item xs={6}>
          <Button variant="contained" color="primary" onClick={fetchMovies}>
            Search
          </Button>
        </Grid> */}
      </Grid>

      <Box sx={{ height: 400, marginTop: 3 }}>
        {movies.length > 0 && (
          <DataGrid
            rows={movies}
            columns={movieColumns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 25]}
            autoHeight
          />
        )}
      </Box>
    </Container> 
  );
};



