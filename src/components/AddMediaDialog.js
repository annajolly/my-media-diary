import React from 'react';
import {
  Alert,
  Box,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { BookIcon, FilmReelIcon } from '@phosphor-icons/react';
import {
  getMovieDetails,
  searchBooksByTitle,
  searchMoviesByTitle,
} from '../api/media';
import { CustomRadio } from './CustomRadio';
import {
  useAddBookMutation,
  useAddMovieMutation,
} from '../queries/mediaQueries';

export const AddMediaDialog = (props) => {
  const { open, onClose } = props;
  const [selectedMediaType, setSelectedMediaType] = React.useState('book');
  const [bookSearchResults, setBookSearchResults] = React.useState([]);
  const [selectedBookResultId, setSelectedBookResultId] = React.useState(null);
  const [movieSearchResults, setMovieSearchResults] = React.useState([]);
  const [selectedMovieResultId, setSelectedMovieResultId] =
    React.useState(null);
  const [error, setError] = React.useState('');
  const bookSearchFormRef = React.useRef(null);
  const movieSearchFormRef = React.useRef(null);
  const manualFormRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    setSelectedMediaType('book');
    setBookSearchResults([]);
    setSelectedBookResultId(null);
    setMovieSearchResults([]);
    setSelectedMovieResultId(null);
    setError('');

    bookSearchFormRef.current?.reset();
    movieSearchFormRef.current?.reset();
    manualFormRef.current?.reset();
  }, [open]);

  const addBookMutation = useAddBookMutation({
    onSuccess: async () => {
      onClose();
    },
    onError: () => {
      setError('Problem adding book');
    },
  });

  const addMovieMutation = useAddMovieMutation({
    onSuccess: async () => {
      onClose();
    },
    onError: () => {
      setError('Problem adding movie');
    },
  });

  const handleChange = async (_, newType) => {
    setSelectedMediaType(newType);
    setError('');
  };

  const handleSelectedResultChange = (e, result) => {
    console.log(result, e.target.value);
    setSelectedBookResultId(result);
  };

  const handleSelectedMovieResultChange = (e, result) => {
    console.log(result, e.target.value);
    setSelectedMovieResultId(result);
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    if (selectedMediaType !== 'book') {
      return;
    }

    const formData = new FormData(bookSearchFormRef.current);
    const title = formData.get('add-book-search-title')?.toString().trim();

    if (!title) {
      setError('Enter a title to search for a book');
      return;
    }

    setError('');

    console.log(title);

    try {
      const books = await searchBooksByTitle(title);
      setBookSearchResults(books);
      setSelectedBookResultId(null);
    } catch (err) {
      setError('Problem loading media');
    }
  };

  const handleMovieSearch = async (event) => {
    event.preventDefault();

    if (selectedMediaType !== 'movie') {
      return;
    }

    const formData = new FormData(movieSearchFormRef.current);
    const title = formData.get('add-movie-search-title')?.toString().trim();

    if (!title) {
      setError('Enter a title to search for a movie');
      return;
    }

    setError('');

    try {
      const movies = await searchMoviesByTitle(title);
      setMovieSearchResults(movies);
      setSelectedMovieResultId(null);
    } catch (err) {
      setError('Problem loading media');
    }
  };

  const handleAddBookFromSearch = async () => {
    const selectedBook = bookSearchResults.find(
      (result) => String(result.id) === String(selectedBookResultId),
    );
    const formData = new FormData(bookSearchFormRef.current);

    const dateConsumed = formData
      .get('add-book-search-date-consumed')
      ?.toString();

    const title = selectedBook?.volumeInfo?.title;
    const creator = selectedBook?.volumeInfo?.authors?.join(', ');

    if (!dateConsumed) {
      setError('No date selected');
      return;
    }

    if (!selectedBook || !title) {
      setError('Select a search result to add');
      return;
    }

    setError('');

    await addBookMutation.mutateAsync({
      title,
      creator,
      dateConsumed,
    });
  };

  const handleAddMovieFromSearch = async () => {
    const selectedMovie = movieSearchResults.find(
      (result) => String(result.id) === String(selectedMovieResultId),
    );
    const formData = new FormData(movieSearchFormRef.current);

    const dateConsumed = formData
      .get('add-movie-search-date-consumed')
      ?.toString();

    if (!dateConsumed) {
      setError('No date selected');
      return;
    }

    if (!selectedMovie) {
      setError('Select a search result to add');
      return;
    }

    setError('');

    const details = await getMovieDetails(selectedMovie.id);

    await addMovieMutation.mutateAsync({
      title: details.title || selectedMovie.title,
      creator: details.creator,
      releaseDate: details.releaseDate || selectedMovie.releaseDate || '',
      dateConsumed,
    });
  };

  const handleAddBookManual = async (event) => {
    event.preventDefault();

    const formData = new FormData(manualFormRef.current);
    const title = formData.get('add-book-manual-title')?.toString().trim();
    const creator = formData.get('add-book-manual-creator')?.toString().trim();
    const dateConsumed = formData
      .get('add-book-manual-date-consumed')
      ?.toString();

    if (!dateConsumed) {
      setError('No date selected');
      return;
    }

    if (!title) {
      setError('Enter a title for manual entry');
      return;
    }

    if (!creator) {
      setError('Enter a creator for manual entry');
      return;
    }

    setError('');

    await addBookMutation.mutateAsync({
      title,
      creator,
      dateConsumed,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add media</DialogTitle>
      {error && <Alert severity="error">{error}</Alert>}
      <DialogContent dividers>
        <FormControl sx={{ width: '100%', marginY: 1, height: '100px' }}>
          <RadioGroup
            row
            aria-label="media type"
            name="selected-state"
            value={selectedMediaType}
            onChange={handleChange}
          >
            <Grid
              container
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              width="100%"
            >
              <Grid size={6}>
                <CustomRadio
                  value="book"
                  label={
                    <Stack gap={2} direction="row" alignItems="center">
                      <BookIcon size={32} weight="fill" />
                      <Typography variant="h6">Book</Typography>
                    </Stack>
                  }
                />
              </Grid>
              <Grid size={6}>
                <CustomRadio
                  value="movie"
                  label={
                    <Stack gap={2} direction="row" alignItems="center">
                      <FilmReelIcon size={32} weight="fill" />
                      <Typography variant="h6">Movie</Typography>
                    </Stack>
                  }
                />
              </Grid>
            </Grid>
          </RadioGroup>
        </FormControl>
        {selectedMediaType === 'book' ? (
          <Stack spacing={3}>
            <Box
              component="form"
              ref={bookSearchFormRef}
              onSubmit={handleSearch}
            >
              <Typography variant="subtitle1" marginBottom={2}>
                Search for a book
              </Typography>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                display="flex"
                alignItems={{ xs: 'stretch', md: 'center' }}
                spacing={2}
              >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date consumed"
                    id="add-book-search-date-consumed"
                    name="add-book-search-date-consumed"
                  />
                </LocalizationProvider>
                <TextField
                  id="add-book-search-title"
                  name="add-book-search-title"
                  label="Title"
                  variant="outlined"
                  sx={{ flexGrow: 1 }}
                />
                <Button variant="contained" type="submit">
                  Search
                </Button>
              </Stack>
              <RadioGroup
                aria-label="search results"
                name="search-results"
                value={selectedBookResultId ?? ''}
                onChange={handleSelectedResultChange}
                sx={{ marginTop: 2 }}
              >
                {bookSearchResults.map(({ id, volumeInfo }) => {
                  return (
                    <FormControlLabel
                      key={id}
                      value={id}
                      control={<Radio />}
                      label={
                        <Typography>
                          {volumeInfo.title} - {volumeInfo.authors?.join(', ')}
                        </Typography>
                      }
                    />
                  );
                })}
              </RadioGroup>
              <Stack direction="row" justifyContent="flex-end" marginTop={2}>
                <Button
                  variant="contained"
                  onClick={handleAddBookFromSearch}
                  disabled={addBookMutation.isPending}
                >
                  Add selected book
                </Button>
              </Stack>
            </Box>

            <Divider>OR</Divider>

            <Box
              component="form"
              ref={manualFormRef}
              onSubmit={handleAddBookManual}
            >
              <Typography variant="subtitle1" marginBottom={2}>
                Enter a book manually
              </Typography>
              <Stack spacing={2}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  alignItems={{ xs: 'stretch', md: 'center' }}
                  spacing={2}
                >
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date consumed"
                      id="add-book-manual-date-consumed"
                      name="add-book-manual-date-consumed"
                    />
                  </LocalizationProvider>
                  <TextField
                    id="add-book-manual-title"
                    name="add-book-manual-title"
                    label="Title"
                    variant="outlined"
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField
                    id="add-book-manual-creator"
                    name="add-book-manual-creator"
                    label="Creator"
                    variant="outlined"
                    sx={{ flexGrow: 1 }}
                  />
                </Stack>
                <Stack direction="row" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={addBookMutation.isPending}
                  >
                    Add manual book
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        ) : (
          <Stack spacing={3}>
            <Box
              component="form"
              ref={movieSearchFormRef}
              onSubmit={handleMovieSearch}
            >
              <Typography variant="subtitle1" marginBottom={2}>
                Search for a movie
              </Typography>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                display="flex"
                alignItems={{ xs: 'stretch', md: 'center' }}
                spacing={2}
              >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date consumed"
                    id="add-movie-search-date-consumed"
                    name="add-movie-search-date-consumed"
                  />
                </LocalizationProvider>
                <TextField
                  id="add-movie-search-title"
                  name="add-movie-search-title"
                  label="Movie title"
                  variant="outlined"
                  sx={{ flexGrow: 1 }}
                />
                <Button variant="contained" type="submit">
                  Search
                </Button>
              </Stack>
              <RadioGroup
                aria-label="movie search results"
                name="movie-search-results"
                value={selectedMovieResultId ?? ''}
                onChange={handleSelectedMovieResultChange}
                sx={{ marginTop: 2 }}
              >
                {movieSearchResults.map((movie) => {
                  return (
                    <FormControlLabel
                      key={movie.id}
                      value={movie.id}
                      control={<Radio />}
                      label={
                        <Typography>
                          {movie.title} -{' '}
                          {movie.releaseDate || 'Unknown release date'}
                        </Typography>
                      }
                    />
                  );
                })}
              </RadioGroup>
              <Stack direction="row" justifyContent="flex-end" marginTop={2}>
                <Button
                  variant="contained"
                  onClick={handleAddMovieFromSearch}
                  disabled={addMovieMutation.isPending}
                >
                  Add selected movie
                </Button>
              </Stack>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="default" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
