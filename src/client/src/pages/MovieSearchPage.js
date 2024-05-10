import React, { useState } from 'react';
import { Container, Select, Typography, Grid, CircularProgress, FormControl, InputLabel, TextField, Box, Button, Slider, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';

const config = require('../config.json');

function MovieSearch() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [releaseYear, setReleaseYear] = useState(1870); // Default "All"
    const [imdbVotes, setImdbVotes] = useState('');
    const [score, setScore] = useState(0); // Default "All"
    const [ageCertifications, setAgeCertifications] = useState('');
    const [description, setDescription] = useState('');

    const fetchMovies = () => {
        setLoading(true);
        const queryParams = { title, genre, releaseYear, imdbVotes, score, ageCertifications, description };
        const queryString = Object.entries(queryParams)
            .filter(([key, value]) => {
                if ((key === 'releaseYear' && value === 1870) || (key === 'score' && value === 0)) {
                    return false; // Ignore "All" values
                }
                return value !== '' && value != null;
            })
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');

        fetch(`http://${config.server_host}:${config.server_port}/search_on_platform?${queryString}`)
            .then(response => response.json())
            // .then(data => {
            //     const validatedData = data.map((item, index) => ({
            //         ...item,
            //         id: item.id || `temp-id-${index}` 
            //     }));
            //     setData(validatedData);
            //     setLoading(false);
            // })
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                setError(`Failed to load data: ${err.message}`);
                setLoading(false);
            });
    };

    const valueLabelFormat = (value, index) => {
        switch (index) {
            case 0:
                return value === 1870 ? 'All' : value;
            case 1:
                return value === 0 ? 'All' : value.toFixed(1);
            default:
                return value;
        }
    }

    const columns = [
        { field: 'title', headerName: 'Title', width: 300, renderCell: (params) => (
            <Link to={`/movie/${params.row.id}`}>{params.value}</Link>
          )},
        { field: 'genre', headerName: 'Genres', width: 100 },
        { field: 'release_year', headerName: 'Release Year', width: 120 },
        { field: 'score', headerName: 'Score', width: 80 },
        { field: 'age_certifications', headerName: 'Age Certifications', width: 180 },
        { field: 'available_on', headerName: 'Available On', width: 600 },
        { field: 'description', headerName: 'Description', width: 400 }
        
    ];

    return (
    <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>Movie Search</Typography>
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                    <InputLabel id="genre-label">Genre</InputLabel>
                    <Select
                        labelId="genre-label"
                        value={genre}
                        label="Genre"
                        onChange={(e) => setGenre(e.target.value)}
                    >
                        <MenuItem value="">All Genres</MenuItem>
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
            <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                    <InputLabel id="age-certification-label">Age Certification</InputLabel>
                    <Select
                        labelId="age-certification-label"
                        value={ageCertifications}
                        label="Age Certification"
                        onChange={(e) => setAgeCertifications(e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="TV-Y7">TV-Y7</MenuItem>
                        <MenuItem value="TV-Y">TV-Y</MenuItem>
                        <MenuItem value="TV-PG">TV-PG</MenuItem>
                        <MenuItem value="TV-MA">TV-MA</MenuItem>
                        <MenuItem value="TV-G">TV-G</MenuItem>
                        <MenuItem value="TV-14">TV-14</MenuItem>
                        <MenuItem value="R">R</MenuItem> 
                        <MenuItem value="PG-13">PG-13</MenuItem>
                        <MenuItem value="PG">PG</MenuItem>
                        <MenuItem value="NC-17">NC-17</MenuItem>
                        <MenuItem value="G">G</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
                    <Typography gutterBottom>Release Year</Typography>
                    <Slider
                        value={releaseYear}
                        onChange={(e, newValue) => setReleaseYear(newValue)}
                        valueLabelDisplay="on"
                        getAriaValueText={(value) => `${value}`}
                        valueLabelFormat={() => valueLabelFormat(releaseYear, 0)}
                        min={1870}
                        max={2024}
                    />
                </Grid>
            <Grid item xs={12} md={6}>
                    <Typography gutterBottom>Score</Typography>
                    <Slider
                        value={score}
                        onChange={(e, newValue) => setScore(newValue)}
                        valueLabelDisplay="on"
                        getAriaValueText={(value) => `${value}`}
                        valueLabelFormat={() => valueLabelFormat(score, 1)}
                        min={0}
                        max={10.0}
                        step={0.1}
                    />
                </Grid>
        </Grid>
        <Box sx={{ marginY: 2 }}>
            <Button variant="contained" onClick={fetchMovies} fullWidth>
                Search
            </Button>
        </Box>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        <Typography variant="h5" gutterBottom>Results</Typography>
        <DataGrid
            rows={data}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 25]}
            autoHeight
            getRowId={(row) => row.id}
        />
    </Container>
    );
}

export default MovieSearch;
