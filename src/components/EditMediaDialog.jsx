import React from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getReleaseYear } from '../utils/release-year';

const MAX_RELEASE_YEAR = new Date().getFullYear() + 10;

const getReleaseYearError = (releaseYear) => {
  if (!releaseYear) {
    return '';
  }

  const year = Number(releaseYear);
  if (releaseYear.length !== 4 || year < 1000 || year > MAX_RELEASE_YEAR) {
    return `Enter a 4-digit year up to ${MAX_RELEASE_YEAR}`;
  }

  return '';
};

const toDateValue = (dateValue) => {
  if (!dateValue) {
    return null;
  }

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
};

export const EditMediaDialog = (props) => {
  const {
    open,
    onClose,
    onSave,
    isSaving = false,
    initialDate,
    initialTitle = '',
    initialCreator = '',
    initialReleaseDate = '',
  } = props;
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [title, setTitle] = React.useState('');
  const [creator, setCreator] = React.useState('');
  const [releaseYear, setReleaseYear] = React.useState('');

  const initialReleaseYear =
    getReleaseYear(initialReleaseDate)?.toString() ?? '';
  const releaseYearError = getReleaseYearError(releaseYear);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    setSelectedDate(toDateValue(initialDate));
    setTitle(initialTitle);
    setCreator(initialCreator);
    setReleaseYear(initialReleaseYear);
  }, [initialCreator, initialDate, initialReleaseYear, initialTitle, open]);

  const handleSave = () => {
    if (!selectedDate || !title.trim() || !creator.trim() || releaseYearError) {
      return;
    }

    onSave({
      dateConsumed: new Date(selectedDate).toISOString(),
      title: title.trim(),
      creator: creator.trim(),
      releaseDate: releaseYear,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          minWidth: 'min(350px, calc(100% - 48px))',
        },
      }}
    >
      <DialogTitle>Edit media</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ marginTop: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date consumed"
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </LocalizationProvider>
          <TextField
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <TextField
            label="Creator"
            value={creator}
            onChange={(event) => setCreator(event.target.value)}
          />
          <TextField
            label="Release year"
            value={releaseYear}
            onChange={(event) =>
              setReleaseYear(event.target.value.replace(/\D/g, '').slice(0, 4))
            }
            error={Boolean(releaseYearError)}
            helperText={releaseYearError || 'Optional'}
            slotProps={{ htmlInput: { inputMode: 'numeric' } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="default">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={
            !selectedDate ||
            !title.trim() ||
            !creator.trim() ||
            Boolean(releaseYearError) ||
            isSaving
          }
          startIcon={
            isSaving ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
