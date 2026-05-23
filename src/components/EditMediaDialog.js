import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  const { open, onClose, onSave, isSaving = false, initialDate } = props;
  const [selectedDate, setSelectedDate] = React.useState(null);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    setSelectedDate(toDateValue(initialDate));
  }, [initialDate, open]);

  const handleSave = () => {
    if (!selectedDate) {
      return;
    }

    onSave(new Date(selectedDate).toISOString());
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit consumed date</DialogTitle>
      <DialogContent dividers>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Date consumed"
            value={selectedDate}
            onChange={setSelectedDate}
          />
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="default">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!selectedDate || isSaving}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
