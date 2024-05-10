import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, CircularProgress, TextField, Box, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';

const config = require('../config.json');

function FinancialDetails() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [pageSize, setPageSize] = useState(5);

    useEffect(() => {
        fetchFinancialDetails();
    }, []);

    const fetchFinancialDetails = () => {
        setLoading(true);
        const queryParams = new URLSearchParams({
            ...(title && { title }),
            ...(genre && { genre }),
            ...(name && { name }),
            ...(country && { country })
        }).toString();
        const url = `http://${config.server_host}:${config.server_port}/financial_details?${queryParams}`;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok, status: ${response.status}`);
                }
                return response.json();
            })
            //   .then(data => {
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

    const columns = [
      // { field: 'id', headerName: 'ID', width: 100 },
      { field: 'title', headerName: 'Title', width: 300, renderCell: (params) => (
        <Link to={`/movie/${params.row.id}`}>{params.value}</Link>
      )},
      { field: 'genre', headerName: 'Genre', width: 200 },
      { field: 'release_year', headerName: 'Release Year', width: 120 },
      { field: 'score', headerName: 'Score', width: 100 },
      { field: 'budget_x', headerName: 'Budget', width: 130 },
      { field: 'revenue', headerName: 'Revenue', width: 130 },
      { field: 'profit', headerName: 'Profit', width: 130 }
  ];

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>Financial Search</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
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
                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Cast Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                        <InputLabel id="country-label">Country or Area</InputLabel>
                        <Select
                            labelId="country-label"
                            value={country}
                            label="Country or Area"
                            onChange={(e) => setCountry(e.target.value)}
                        >
                            <MenuItem value="">All Countries</MenuItem>
                            <MenuItem value="MX">Mexico</MenuItem>
                            <MenuItem value="AU">Australia</MenuItem>
                            <MenuItem value="ES">Spain</MenuItem>
                            <MenuItem value="CA">Canada</MenuItem>
                            <MenuItem value="US">United States</MenuItem>
                            <MenuItem value="GB">United Kingdom</MenuItem>
                            <MenuItem value="AT">Austria</MenuItem>
                            <MenuItem value="FR">France</MenuItem>
                            <MenuItem value="IT">Italy</MenuItem>
                            <MenuItem value="BR">Brazil</MenuItem>
                            <MenuItem value="PH">Philippines</MenuItem>
                            <MenuItem value="TR">Turkey</MenuItem>
                            <MenuItem value="PL">Poland</MenuItem>
                            <MenuItem value="AR">Argentina</MenuItem>
                            <MenuItem value="IE">Ireland</MenuItem>
                            <MenuItem value="CN">China</MenuItem>
                            <MenuItem value="JP">Japan</MenuItem>
                            <MenuItem value="NL">Netherlands</MenuItem>
                            <MenuItem value="CZ">Czech Republic</MenuItem>
                            <MenuItem value="DE">Germany</MenuItem>
                            <MenuItem value="DK">Denmark</MenuItem>
                            <MenuItem value="IN">India</MenuItem>
                            <MenuItem value="SE">Sweden</MenuItem>
                            <MenuItem value="SG">Singapore</MenuItem>
                            <MenuItem value="NO">Norway</MenuItem>
                            <MenuItem value="CL">Chile</MenuItem>
                            <MenuItem value="MY">Malaysia</MenuItem>
                            <MenuItem value="ZA">South Africa</MenuItem>
                            <MenuItem value="CH">Switzerland</MenuItem>
                            <MenuItem value="PE">Peru</MenuItem>
                            <MenuItem value="DO">Dominican Republic</MenuItem>
                            <MenuItem value="ID">Indonesia</MenuItem>
                            <MenuItem value="CO">Colombia</MenuItem>
                            <MenuItem value="GT">Guatemala</MenuItem>
                            <MenuItem value="PR">Puerto Rico</MenuItem>
                            <MenuItem value="BE">Belgium</MenuItem>
                            <MenuItem value="MU">Mauritius</MenuItem>
                            <MenuItem value="RU">Russia</MenuItem>
                            <MenuItem value="HK">Hong Kong</MenuItem>
                            <MenuItem value="PY">Paraguay</MenuItem>
                            <MenuItem value="UA">Ukraine</MenuItem>
                            <MenuItem value="GR">Greece</MenuItem>
                            <MenuItem value="UY">Uruguay</MenuItem>
                            <MenuItem value="FI">Finland</MenuItem>
                            <MenuItem value="TW">Taiwan</MenuItem>
                            <MenuItem value="HU">Hungary</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Box sx={{ marginY: 2 }}>
                <Button variant="contained" onClick={fetchFinancialDetails} fullWidth>
                    Search
                </Button>
            </Box>
            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}
            <Typography variant="h5" gutterBottom>Results</Typography>
            <DataGrid
                rows={data}
                columns={columns}
                pageSize={pageSize}
                rowsPerPageOptions={[5, 10, 25]}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                autoHeight
                getRowId={(row) => row.id}
            />
        </Container>
    );
}

export default FinancialDetails;
