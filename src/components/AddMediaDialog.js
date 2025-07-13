import React from 'react';
import {
  Alert,
  Box,
  Button,
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
import { addBookToUser, addMovieToUser } from '../api/firebase';
import { CustomRadio } from './CustomRadio';

export const AddMediaDialog = (props) => {
  const { open, onClose } = props;
  const [selectedMediaType, setSelectedMediaType] = React.useState('book');
  const [searchResults, setSearchResults] = React.useState([]);
  const [selectedResultId, setSelectedResultId] = React.useState(null);
  const [error, setError] = React.useState('');
  const formRef = React.useRef(null);

  const handleChange = async (_, newType) => {
    setSelectedMediaType(newType);
  };

  const handleSelectedResultChange = (e, result) => {
    console.log(result, e.target.value);
    setSelectedResultId(result);
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    const formData = new FormData(formRef.current);
    const title = formData.get('add-book-form-title');

    console.log(title);

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          title
        )}`
      );
      const data = await response.json();
      console.log(data);

      setSearchResults(data.items);
    } catch (err) {
      setError('Problem loading media', err);
    }
  };

  const handleAddBook = () => {
    const selectedBook = searchResults.find(
      (result) => result.id === selectedResultId
    );
    const title = selectedBook?.volumeInfo?.title;
    const author = selectedBook?.volumeInfo?.authors?.join(', ');
    const datePublished = selectedBook?.volumeInfo?.publishedDate;

    const formData = new FormData(formRef.current);
    const dateConsumed = formData
      .get('add-book-form-date-consumed')
      ?.toString();

    if (title && dateConsumed) {
      try {
        addBookToUser({ title, author, dateConsumed, datePublished });
      } catch (err) {
        setError('Problem adding book:', err);
      }
      onClose();
    } else if (!dateConsumed) {
      setError('No date selected');
    } else {
      setError('No title selected');
    }
  };

  const handleAddMovie = () => {
    // TODO: addMovieToUser
  };

  const handleAddClicked =
    selectedMediaType === 'book' ? handleAddBook : handleAddMovie;

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
        <Box component="form" ref={formRef} onSubmit={handleSearch}>
          <Stack direction="row" display="flex" alignItems="center" spacing={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date consumed"
                id="add-book-form-date-consumed"
                name="add-book-form-date-consumed"
              />
            </LocalizationProvider>
            <TextField
              id="add-book-form-title"
              name="add-book-form-title"
              label="Title"
              variant="outlined"
              sx={{ flexGrow: 1 }}
            />
            <Button variant="contained" type="submit">
              Search
            </Button>
          </Stack>
        </Box>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          value={selectedResultId ?? ''}
          onChange={handleSelectedResultChange}
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
      </DialogContent>
      <DialogActions>
        <Button color="default" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleAddClicked}
          disabled={!selectedResultId}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
