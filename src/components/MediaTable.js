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
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { format } from 'date-fns';
import {
  getUserBooks,
  getUserMovies,
  deleteUserBook,
  deleteUserMovie,
} from '../api/firebase';
import { useOpenable } from '../hooks/use-openable';
import { alpha } from '@mui/material/styles';

export const MediaTable = () => {
  const [mediaEntries, setMediaEntries] = React.useState();
  const [selectedMedia, setSelectedMedia] = React.useState();
  const [mediaFilters, setMediaFilters] = React.useState(['book', 'movie']);
  const deleteConfirmModal = useOpenable();

  const fetchMediaEntries = React.useCallback(async () => {
    const [books, movies] = await Promise.all([
      getUserBooks(),
      getUserMovies(),
    ]);

    const normalizedBooks = books.map((book) => ({
      ...book,
      mediaType: 'book',
    }));

    const normalizedMovies = movies.map((movie) => ({
      ...movie,
      mediaType: 'movie',
    }));

    setMediaEntries([...normalizedBooks, ...normalizedMovies]);
  }, []);

  React.useEffect(() => {
    async function fetchData() {
      await fetchMediaEntries();
    }
    fetchData();
  }, [fetchMediaEntries]);

  const handleDeleteClicked = (id, mediaType) => () => {
    setSelectedMedia({ id, mediaType });
    deleteConfirmModal.open();
  };

  const handleDeletion = async () => {
    if (!selectedMedia) {
      return;
    }

    if (selectedMedia.mediaType === 'movie') {
      await deleteUserMovie(selectedMedia.id);
    } else {
      await deleteUserBook(selectedMedia.id);
    }

    setMediaEntries(undefined);
    deleteConfirmModal.close();
    setSelectedMedia(undefined);
    await fetchMediaEntries();
  };

  const handleMediaFilterChange = (_, nextFilters) => {
    setMediaFilters(nextFilters);
  };

  const filteredMediaEntries = React.useMemo(() => {
    if (!mediaEntries) {
      return [];
    }

    return mediaEntries.filter((entry) =>
      mediaFilters.includes(entry.mediaType),
    );
  }, [mediaEntries, mediaFilters]);

  const isLoading = typeof mediaEntries === 'undefined';

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
      <Stack direction="row" justifyContent="flex-end" marginBottom={2}>
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
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Published</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMediaEntries?.map((row) => (
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
                <TableCell>{row.author ?? '-'}</TableCell>
                <TableCell>{formatDateCell(row.datePublished)}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1}>
                    <IconButton>
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
          <Button variant="contained" onClick={handleDeletion} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
