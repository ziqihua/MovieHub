import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, CircularProgress, TextField, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

function StreamingGuide() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [minimumScore, setMinimumScore] = useState(0);
    const [genre, setGenre] = useState('Documentary');
    const [pageSize, setPageSize] = useState(5); 

    useEffect(() => {
        fetchGuideData();
    }, [minimumScore, genre]);

    const fetchGuideData = () => {
        const url = `http://${config.server_host}:${config.server_port}/streaming_guide?minimum_score=${minimumScore}&genre=${encodeURIComponent(genre)}`;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok, status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    const handleScoreChange = (event) => {
        const value = parseFloat(event.target.value) || 0;
        setMinimumScore(value);
    };

    const columns = [
        { field: 'platform', headerName: 'Platform', width: 300 },
        { field: 'movie_count_above_min_score', headerName: 'Movies Count (Min Score)', width: 350 },
        { field: 'total_votes', headerName: 'Total Votes', width: 300 },
    ];

    return (
      <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
              Streaming Guide Statistics
          </Typography>
          <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined" margin="dense">
                      <TextField
                          label="Minimum Score"
                          type="number"
                          value={minimumScore}
                          onChange={handleScoreChange}
                          InputProps={{ step: 0.5 }}
                          margin="none"
                      />
                  </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined" margin="dense">
                      <InputLabel id="genre-label">Genre</InputLabel>
                      <Select
                          labelId="genre-label"
                          value={genre}
                          label="Genre"
                          onChange={e => setGenre(e.target.value)}
                          margin="none"
                      >
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
          </Grid>
          <Box height={30} />
          {loading ? (
              <CircularProgress />
          ) : error ? (
              <Typography color="error">{error}</Typography>
          ) : (
              <DataGrid
                  rows={data}
                  columns={columns}
                  pageSize={pageSize}
                  rowsPerPageOptions={[5, 10, 25]}
                  autoHeight
                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                  getRowId={(row) => row.platform}
              />
          )}
      </Container>
  );
}

export default StreamingGuide;
