import React from 'react';
import {
  Alert,
  Button,
  CircularProgress,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

export const ImportMediaDialog = (props) => {
  const { open, onClose, onImport, isImporting = false } = props;
  const [mediaType, setMediaType] = React.useState('book');
  const [rawInput, setRawInput] = React.useState('');
  const [error, setError] = React.useState('');
  const yearPattern = /\b\d{4}\b/;

  const isBookImport = mediaType === 'book';
  const formatExample = isBookImport
    ? 'e.g. End of Watch - Stephen King - May 7 2026'
    : 'e.g. Ready or Not 2 - Apr 5 2026';

  const parseImportLines = () => {
    const lines = rawInput
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      throw new Error('Paste at least one media entry to import.');
    }

    return lines.map((line, index) => {
      const parts = line.split(' - ').map((part) => part.trim());

      if (mediaType === 'book') {
        if (parts.length !== 3) {
          throw new Error(
            `Line ${index + 1} is invalid for books. Use: Title - Creator - Date consumed`,
          );
        }

        const [title, creator, dateConsumed] = parts;
        if (!title || !creator || !dateConsumed) {
          throw new Error(`Line ${index + 1} has empty values.`);
        }
        if (!yearPattern.test(dateConsumed)) {
          throw new Error(
            `Line ${index + 1} is invalid. Date consumed must include a 4-digit year.`,
          );
        }

        return {
          mediaType: 'book',
          title,
          creator,
          dateConsumed,
        };
      }

      if (parts.length !== 2) {
        throw new Error(
          `Line ${index + 1} is invalid for movies. Use: Title - Date consumed`,
        );
      }

      const [title, dateConsumed] = parts;
      if (!title || !dateConsumed) {
        throw new Error(`Line ${index + 1} has empty values.`);
      }
      if (!yearPattern.test(dateConsumed)) {
        throw new Error(
          `Line ${index + 1} is invalid. Date consumed must include a 4-digit year.`,
        );
      }

      return {
        mediaType: 'movie',
        title,
        creator: 'Unknown',
        dateConsumed,
      };
    });
  };

  const handleImport = async () => {
    let parsedEntries;

    try {
      parsedEntries = parseImportLines();
    } catch (err) {
      setError(err.message || 'Could not parse imported media.');
      return;
    }

    setError('');

    try {
      await onImport?.(parsedEntries);
      setRawInput('');
      onClose();
    } catch (err) {
      // Parent handles import errors via snackbar; keep dialog open for retry.
    }
  };

  const handleDialogClose = (_, reason) => {
    if (
      isImporting &&
      (reason === 'backdropClick' || reason === 'escapeKeyDown')
    ) {
      return;
    }

    if (isImporting) {
      return;
    }

    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="md">
      <DialogTitle>Import media</DialogTitle>
      <Divider />
      {error && (
        <Alert severity="error" sx={{ width: '100%', borderRadius: 0 }}>
          {error}
        </Alert>
      )}
      <Divider />
      <DialogContent>
        <Stack spacing={2}>
          <FormControl>
            <RadioGroup
              row
              aria-label="media type"
              name="import-media-type"
              value={mediaType}
              onChange={(event) => setMediaType(event.target.value)}
            >
              <FormControlLabel value="book" control={<Radio />} label="Book" />
              <FormControlLabel
                value="movie"
                control={<Radio />}
                label="Movie"
              />
            </RadioGroup>
          </FormControl>
          <Typography variant="body2" color="text.secondary">
            {isBookImport
              ? 'Book format: Title - Creator - Date consumed'
              : 'Movie format: Title - Date consumed'}
          </Typography>
          <TextField
            label={
              isBookImport
                ? 'Paste book import lines'
                : 'Paste movie import lines'
            }
            InputLabelProps={{ shrink: true }}
            multiline
            minRows={8}
            value={rawInput}
            onChange={(event) => setRawInput(event.target.value)}
            placeholder={formatExample}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          color="default"
          onClick={handleDialogClose}
          disabled={isImporting}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleImport}
          disabled={isImporting}
          startIcon={
            isImporting ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {isImporting ? 'Importing...' : 'Import'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
