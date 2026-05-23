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
import { searchBooksByTitle } from '../api/media';
import { CustomRadio } from './CustomRadio';
import { useAddBookMutation } from '../queries/mediaQueries';

export const AddMediaDialog = (props) => {
  const { open, onClose } = props;
  const [selectedMediaType, setSelectedMediaType] = React.useState('book');
  const [searchResults, setSearchResults] = React.useState([]);
  const [selectedResultId, setSelectedResultId] = React.useState(null);
  const [error, setError] = React.useState('');
  const searchFormRef = React.useRef(null);
  const manualFormRef = React.useRef(null);

  const addBookMutation = useAddBookMutation({
    onSuccess: async () => {
      onClose();
    },
    onError: () => {
      setError('Problem adding book');
    },
  });

  const handleChange = async (_, newType) => {
    setSelectedMediaType(newType);
  };

  const handleSelectedResultChange = (e, result) => {
    console.log(result, e.target.value);
    setSelectedResultId(result);
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    if (selectedMediaType !== 'book') {
      return;
    }

    const formData = new FormData(searchFormRef.current);
    const title = formData.get('add-book-search-title')?.toString().trim();

    if (!title) {
      setError('Enter a title to search for a book');
      return;
    }

    setError('');

    console.log(title);

    try {
      const books = await searchBooksByTitle(title);
      setSearchResults(books);
      setSelectedResultId(null);
    } catch (err) {
      setError('Problem loading media');
    }
  };

  const handleAddBookFromSearch = async () => {
    const selectedBook = searchResults.find(
      (result) => result.id === selectedResultId,
    );
    const formData = new FormData(searchFormRef.current);

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
        <FormControl sx={{ width: '100%', marginY: 4, height: '100px' }}>
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
              marginX={3}
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
            <Box component="form" ref={searchFormRef} onSubmit={handleSearch}>
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
                value={selectedResultId ?? ''}
                onChange={handleSelectedResultChange}
                sx={{ marginTop: 2 }}
              >
                {searchResults.map(({ id, volumeInfo }) => {
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
          <Typography color="text.secondary">
            Movie adding is coming soon.
          </Typography>
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
