import React from 'react';
import {
  Button,
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
  } = props;
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [title, setTitle] = React.useState('');
  const [creator, setCreator] = React.useState('');

  React.useEffect(() => {
    if (!open) {
      return;
    }

    setSelectedDate(toDateValue(initialDate));
    setTitle(initialTitle);
    setCreator(initialCreator);
  }, [initialCreator, initialDate, initialTitle, open]);

  const handleSave = () => {
    if (!selectedDate || !title.trim() || !creator.trim()) {
      return;
    }

    onSave({
      dateConsumed: new Date(selectedDate).toISOString(),
      title: title.trim(),
      creator: creator.trim(),
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit media</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} marginTop={1}>
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
            !selectedDate || !title.trim() || !creator.trim() || isSaving
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
