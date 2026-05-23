import {
  addBookToUser,
  deleteUserBook,
  deleteUserMovie,
  getUserBooks,
  getUserMovies,
} from './firebase';

export const mediaEntriesQueryKey = ['mediaEntries'];

export const getMediaEntries = async () => {
  const [books, movies] = await Promise.all([getUserBooks(), getUserMovies()]);

  const normalizedBooks = books.map((book) => ({
    ...book,
    mediaType: 'book',
  }));

  const normalizedMovies = movies.map((movie) => ({
    ...movie,
    mediaType: 'movie',
  }));

  return [...normalizedBooks, ...normalizedMovies];
};

export const deleteMediaEntry = async ({ id, mediaType }) => {
  if (mediaType === 'movie') {
    await deleteUserMovie(id);
    return;
  }

  await deleteUserBook(id);
};

export const addBookEntry = async (bookData) => {
  await addBookToUser(bookData);
};

export const searchBooksByTitle = async (title) => {
  const query = title?.trim();
  if (!query) {
    return [];
  }

  const booksApiUrl = new URL('https://www.googleapis.com/books/v1/volumes');
  booksApiUrl.searchParams.set('q', query);

  if (process.env.REACT_APP_GOOGLE_BOOKS_API_KEY) {
    booksApiUrl.searchParams.set(
      'key',
      process.env.REACT_APP_GOOGLE_BOOKS_API_KEY,
    );
  }

  const response = await fetch(booksApiUrl.toString());
  if (!response.ok) {
    throw new Error(`Books API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.items ?? [];
};
