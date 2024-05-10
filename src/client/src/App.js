import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider, Box } from '@mui/material'
import { indigo, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import MovieSearchPage from './pages/MovieSearchPage';
import StreamingGuide from './pages/StreamingGuide';
import FinancialPage from './pages/FinancialPage';
import MovieCard from './components/MovieCard';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Link } from "react-router-dom";

// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: amber,
    secondary: indigo,
  },
});

function Sidebar() {
  return (
    <div style={{ width: '250px', height: '100vh', backgroundColor: theme.palette.primary.main }}>
      <List>
        {['Home', 'Search Movies', 'Streaming Guide', 'Financials'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton component={Link} to={index === 0 ? "/" : `/${text.toLowerCase().replace(/ /g, '_')}`}>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ display: 'flex' }}>
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search_movies" element={<MovieSearchPage />} />
              <Route path="/streaming_guide" element={<StreamingGuide />} />
              <Route path="/financials" element={<FinancialPage />} />
              <Route path="/movie/:movie_id" element={<MovieCard />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}
