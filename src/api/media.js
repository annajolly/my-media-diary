import {
  addMovieToUser,
  addBookToUser,
  deleteUserBook,
  deleteUserMovie,
  getUserBooks,
  getUserMovies,
  updateUserBook,
  updateUserMovie,
} from './firebase';

export const mediaEntriesQueryKey = ['mediaEntries'];

export const getMediaEntries = async () => {
  const [books, movies] = await Promise.all([getUserBooks(), getUserMovies()]);

  const normalizedBooks = books.map((book) => ({
    ...book,
    creator: book.creator ?? '',
    releaseDate: book.releaseDate ?? '',
    mediaType: 'book',
  }));

  const normalizedMovies = movies.map((movie) => ({
    ...movie,
    creator: movie.creator ?? '',
    releaseDate: movie.releaseDate ?? '',
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

export const addMovieEntry = async (movieData) => {
  await addMovieToUser(movieData);
};

export const updateMediaEntry = async ({ id, mediaType, data }) => {
  if (mediaType === 'movie') {
    await updateUserMovie(id, data);
    return;
  }

  await updateUserBook(id, data);
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

const getTmdbApiKey = () => {
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;
  if (!apiKey) {
    throw new Error('TMDB API key is missing');
  }

  return apiKey;
};

export const searchMoviesByTitle = async (title) => {
  const query = title?.trim();
  if (!query) {
    return [];
  }

  const apiKey = getTmdbApiKey();
  const tmdbUrl = new URL('https://api.themoviedb.org/3/search/movie');
  tmdbUrl.searchParams.set('query', query);
  tmdbUrl.searchParams.set('include_adult', 'false');
  tmdbUrl.searchParams.set('language', 'en-US');
  tmdbUrl.searchParams.set('page', '1');
  tmdbUrl.searchParams.set('api_key', apiKey);

  const response = await fetch(tmdbUrl.toString());
  if (!response.ok) {
    throw new Error(`TMDB search failed with status ${response.status}`);
  }

  const data = await response.json();
  const results = data.results ?? [];

  return results.map((movie) => ({
    id: movie.id,
    title: movie.title,
    releaseDate: movie.release_date ?? '',
  }));
};

export const getMovieDetails = async (movieId) => {
  const apiKey = getTmdbApiKey();
  const tmdbUrl = new URL(`https://api.themoviedb.org/3/movie/${movieId}`);
  tmdbUrl.searchParams.set('language', 'en-US');
  tmdbUrl.searchParams.set('append_to_response', 'credits');
  tmdbUrl.searchParams.set('api_key', apiKey);

  const response = await fetch(tmdbUrl.toString());
  if (!response.ok) {
    throw new Error(`TMDB details failed with status ${response.status}`);
  }

  const details = await response.json();
  const producer = details.credits?.crew?.find(
    (crewMember) => crewMember.job === 'Producer',
  );

  return {
    title: details.title ?? '',
    creator:
      producer?.name ?? details.production_companies?.[0]?.name ?? 'Unknown',
    releaseDate: details.release_date ?? '',
  };
};
