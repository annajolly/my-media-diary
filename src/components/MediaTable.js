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
} from '@mui/material';
import { format } from 'date-fns';
import { getUserBooks, deleteUserBook } from '../api/firebase';
import { useOpenable } from '../hooks/use-openable';

export const MediaTable = () => {
  const [books, setBooks] = React.useState();
  const [selectedMediaId, setSelectedMediaId] = React.useState();
  const deleteConfirmModal = useOpenable();
  console.log(books);

  React.useEffect(() => {
    async function fetchData() {
      const books = await getUserBooks();
      setBooks(books);
    }
    fetchData();
  }, []);

  const handleDeleteClicked = (id) => () => {
    setSelectedMediaId(id);
    deleteConfirmModal.open();
  };

  const handleDeletion = async () => {
    await deleteUserBook(selectedMediaId);
    setBooks(undefined);
    deleteConfirmModal.close();
    const books = await getUserBooks();
    setBooks(books);
  };

  const isLoading = typeof books === 'undefined';

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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="media table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Published</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {books?.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  {format(new Date(row.dateConsumed), 'MMM d, yyyy')}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                <TableCell>{row.author}</TableCell>
                <TableCell>
                  {format(new Date(row.datePublished), 'MMM d, yyyy')}
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1}>
                    <IconButton>
                      <PencilSimpleIcon size={20} />
                    </IconButton>
                    <IconButton onClick={handleDeleteClicked(row.id)}>
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
