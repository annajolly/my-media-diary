import { Button, Stack } from '@mui/material';
import { useOpenable } from '../hooks/use-openable';
import { MediaTable } from './MediaTable';
import { AddMediaDialog } from './AddMediaDialog';

export const MediaDiary = () => {
  const addMediaDialog = useOpenable();

  return (
    <Stack m={4} gap={2}>
      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" onClick={addMediaDialog.open}>
          Add media
        </Button>
      </Stack>
      <MediaTable />
      <AddMediaDialog
        open={addMediaDialog.isOpen}
        onClose={addMediaDialog.close}
      />
    </Stack>
  );
};
