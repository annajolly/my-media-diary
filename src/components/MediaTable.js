import React from 'react';
import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { format } from 'date-fns';
import { useOpenable } from '../hooks/use-openable';
import { alpha } from '@mui/material/styles';
import {
  useDeleteMediaMutation,
  useMediaEntriesQuery,
  useUpdateMediaEntryMutation,
} from '../queries/mediaQueries';
import { EditMediaDialog } from './EditMediaDialog';

export const MediaTable = () => {
  const [selectedMedia, setSelectedMedia] = React.useState();
  const [selectedEditMedia, setSelectedEditMedia] = React.useState();
  const [mediaFilters, setMediaFilters] = React.useState(['book', 'movie']);
  const [sortBy, setSortBy] = React.useState('dateConsumed');
  const [sortDirection, setSortDirection] = React.useState('desc');
  const deleteConfirmModal = useOpenable();
  const editDateModal = useOpenable();

  const mediaQuery = useMediaEntriesQuery();

  const deleteMediaMutation = useDeleteMediaMutation({
    onSuccess: async () => {
      deleteConfirmModal.close();
      setSelectedMedia(undefined);
    },
  });

  const updateMediaEntryMutation = useUpdateMediaEntryMutation({
    onSuccess: async () => {
      editDateModal.close();
      setSelectedEditMedia(undefined);
    },
  });

  const handleEditClicked = (row) => () => {
    setSelectedEditMedia({
      id: row.id,
      mediaType: row.mediaType,
      dateConsumed: row.dateConsumed,
      title: row.title ?? '',
      creator: row.creator ?? '',
    });
    editDateModal.open();
  };

  const handleDeleteClicked = (id, mediaType) => () => {
    setSelectedMedia({ id, mediaType });
    deleteConfirmModal.open();
  };

  const handleDeletion = async () => {
    if (!selectedMedia) {
      return;
    }

    try {
      await deleteMediaMutation.mutateAsync({
        id: selectedMedia.id,
        mediaType: selectedMedia.mediaType,
      });
    } catch (err) {
      // TODO: show delete error state
    }
  };

  const handleMediaFilterChange = (_, nextFilters) => {
    setMediaFilters(nextFilters);
  };

  const handleSaveMedia = async ({ dateConsumed, title, creator }) => {
    if (!selectedEditMedia || !dateConsumed || !title || !creator) {
      return;
    }

    try {
      await updateMediaEntryMutation.mutateAsync({
        id: selectedEditMedia.id,
        mediaType: selectedEditMedia.mediaType,
        data: {
          dateConsumed,
          title,
          creator,
        },
      });
    } catch (err) {
      // TODO: show update error state
    }
  };

  const filteredMediaEntries = React.useMemo(() => {
    if (!mediaQuery.data) {
      return [];
    }

    return mediaQuery.data.filter((entry) =>
      mediaFilters.includes(entry.mediaType),
    );
  }, [mediaQuery.data, mediaFilters]);

  const sortedMediaEntries = React.useMemo(() => {
    const entries = [...filteredMediaEntries];

    const normalizeValue = (entry, key) => {
      if (key === 'dateConsumed' || key === 'releaseDate') {
        const timestamp = new Date(entry[key]).getTime();
        return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
      }

      return (entry[key] ?? '').toString().toLowerCase();
    };

    entries.sort((a, b) => {
      const left = normalizeValue(a, sortBy);
      const right = normalizeValue(b, sortBy);

      if (left < right) {
        return sortDirection === 'asc' ? -1 : 1;
      }

      if (left > right) {
        return sortDirection === 'asc' ? 1 : -1;
      }

      return 0;
    });

    return entries;
  }, [filteredMediaEntries, sortBy, sortDirection]);

  const handleSort = (column) => () => {
    if (sortBy === column) {
      setSortDirection((previousDirection) =>
        previousDirection === 'asc' ? 'desc' : 'asc',
      );
      return;
    }

    setSortBy(column);
    setSortDirection('asc');
  };

  const isLoading = mediaQuery.isPending;

  const formatDateCell = (dateValue) => {
    if (!dateValue) {
      return '-';
    }

    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) {
      return '-';
    }

    return format(parsedDate, 'MMM d, yyyy');
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        // width="calc(100vw - 64px)"
        height="calc(100vh - 200px)"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Stack
        direction="row"
        sx={{ justifyContent: 'flex-end', marginRight: 2, marginBottom: 2 }}
      >
        <ToggleButtonGroup
          value={mediaFilters}
          onChange={handleMediaFilterChange}
          aria-label="Filter media types"
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              textTransform: 'none',
            },
            '& .MuiToggleButton-root.Mui-selected': {
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.88),
              color: 'primary.contrastText',
            },
            '& .MuiToggleButton-root.Mui-selected:hover': {
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.95),
            },
          }}
        >
          <ToggleButton value="book" aria-label="Show books">
            Book
          </ToggleButton>
          <ToggleButton value="movie" aria-label="Show movies">
            Movie
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="media table">
          <TableHead>
            <TableRow>
              <TableCell
                sortDirection={sortBy === 'mediaType' ? sortDirection : false}
              >
                <TableSortLabel
                  active={sortBy === 'mediaType'}
                  direction={sortBy === 'mediaType' ? sortDirection : 'asc'}
                  onClick={handleSort('mediaType')}
                >
                  Type
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={
                  sortBy === 'dateConsumed' ? sortDirection : false
                }
              >
                <TableSortLabel
                  active={sortBy === 'dateConsumed'}
                  direction={sortBy === 'dateConsumed' ? sortDirection : 'asc'}
                  onClick={handleSort('dateConsumed')}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={sortBy === 'title' ? sortDirection : false}
              >
                <TableSortLabel
                  active={sortBy === 'title'}
                  direction={sortBy === 'title' ? sortDirection : 'asc'}
                  onClick={handleSort('title')}
                >
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={sortBy === 'creator' ? sortDirection : false}
              >
                <TableSortLabel
                  active={sortBy === 'creator'}
                  direction={sortBy === 'creator' ? sortDirection : 'asc'}
                  onClick={handleSort('creator')}
                >
                  Creator
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={sortBy === 'releaseDate' ? sortDirection : false}
              >
                <TableSortLabel
                  active={sortBy === 'releaseDate'}
                  direction={sortBy === 'releaseDate' ? sortDirection : 'asc'}
                  onClick={handleSort('releaseDate')}
                >
                  Release date
                </TableSortLabel>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedMediaEntries?.map((row) => (
              <TableRow
                key={`${row.mediaType}-${row.id}`}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell sx={{ textTransform: 'capitalize' }}>
                  {row.mediaType}
                </TableCell>
                <TableCell>{formatDateCell(row.dateConsumed)}</TableCell>
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                <TableCell>{row.creator ?? '-'}</TableCell>
                <TableCell>{formatDateCell(row.releaseDate)}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={handleEditClicked(row)}>
                      <PencilSimpleIcon size={20} />
                    </IconButton>
                    <IconButton
                      onClick={handleDeleteClicked(row.id, row.mediaType)}
                    >
                      <TrashIcon size={20} />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {sortedMediaEntries.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  No media entries match the selected filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={deleteConfirmModal.isOpen}>
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent dividers>
          Are you sure you'd like to delete this media entry?
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteConfirmModal.close} color="default">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDeletion}
            color="error"
            disabled={deleteMediaMutation.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <EditMediaDialog
        open={editDateModal.isOpen}
        onClose={editDateModal.close}
        onSave={handleSaveMedia}
        isSaving={updateMediaEntryMutation.isPending}
        initialDate={selectedEditMedia?.dateConsumed}
        initialTitle={selectedEditMedia?.title}
        initialCreator={selectedEditMedia?.creator}
      />
    </>
  );
};
