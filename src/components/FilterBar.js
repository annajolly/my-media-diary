import React from 'react';
import { Alert, Button, Snackbar, Stack } from '@mui/material';
import { DownloadSimpleIcon, PlusIcon } from '@phosphor-icons/react';
import { useOpenable } from '../hooks/use-openable';
import {
  useAddBookMutation,
  useAddMovieMutation,
} from '../queries/mediaQueries';
import { AddMediaDialog } from './AddMediaDialog';
import { ImportMediaDialog } from './ImportMediaDialog';

export const FilterBar = () => {
  const addMediaDialog = useOpenable();
  const importMediaDialog = useOpenable();
  const [snackbarState, setSnackbarState] = React.useState({
    open: false,
    severity: 'success',
    message: '',
  });
  const addBookMutation = useAddBookMutation();
  const addMovieMutation = useAddMovieMutation();

  const isImporting = addBookMutation.isPending || addMovieMutation.isPending;

  const showSnackbar = (severity, message) => {
    setSnackbarState({
      open: true,
      severity,
      message,
    });
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarState((previousState) => ({
      ...previousState,
      open: false,
    }));
  };

  const handleImportMedia = async (entries) => {
    try {
      for (const entry of entries) {
        if (entry.mediaType === 'movie') {
          await addMovieMutation.mutateAsync({
            title: entry.title,
            creator: entry.creator,
            dateConsumed: entry.dateConsumed,
            releaseDate: entry.releaseDate || '',
          });
          continue;
        }

        await addBookMutation.mutateAsync({
          title: entry.title,
          creator: entry.creator,
          dateConsumed: entry.dateConsumed,
        });
      }

      const entryLabel = entries.length === 1 ? 'entry' : 'entries';
      showSnackbar(
        'success',
        `Imported ${entries.length} ${entryLabel} successfully.`,
      );
    } catch (err) {
      showSnackbar('error', 'Could not import media. Please try again.');
      throw err;
    }
  };

  return (
    <>
      <Stack direction="row" sx={{ justifyContent: 'flex-end', m: 2, gap: 2 }}>
        <Button
          startIcon={<PlusIcon />}
          variant="contained"
          onClick={addMediaDialog.open}
        >
          Add media
        </Button>
        <Button
          startIcon={<DownloadSimpleIcon />}
          variant="contained"
          onClick={importMediaDialog.open}
        >
          Import media
        </Button>
      </Stack>
      <AddMediaDialog
        open={addMediaDialog.isOpen}
        onClose={addMediaDialog.close}
      />
      <ImportMediaDialog
        open={importMediaDialog.isOpen}
        onClose={importMediaDialog.close}
        onImport={handleImportMedia}
        isImporting={isImporting}
      />
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarState.severity}
          sx={{ width: '100%' }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </>
  );
};
