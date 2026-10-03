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
import { getReleaseYear } from '../utils/release-year';

export const mediaEntriesQueryKey = ['mediaEntries'];

// Only the release year is stored, e.g. "2005", whatever format the source
// (TMDB, Google Books, user input) provides.
const withReleaseYearOnly = (data) => {
  if (!data || !('releaseDate' in data)) {
    return data;
  }

  return {
    ...data,
    releaseDate: getReleaseYear(data.releaseDate)?.toString() ?? '',
  };
};

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
  await addBookToUser(withReleaseYearOnly(bookData));
};

export const addMovieEntry = async (movieData) => {
  await addMovieToUser(withReleaseYearOnly(movieData));
};

export const updateMediaEntry = async ({ id, mediaType, data }) => {
  const normalizedData = withReleaseYearOnly(data);

  if (mediaType === 'movie') {
    await updateUserMovie(id, normalizedData);
    return;
  }

  await updateUserBook(id, normalizedData);
};

export const searchBooksByTerm = async (term) => {
  const query = term?.trim();
  if (!query) {
    return [];
  }

  const booksApiUrl = new URL('https://www.googleapis.com/books/v1/volumes');
  booksApiUrl.searchParams.set('q', query);

  if (import.meta.env.VITE_GOOGLE_BOOKS_API_KEY) {
    booksApiUrl.searchParams.set(
      'key',
      import.meta.env.VITE_GOOGLE_BOOKS_API_KEY,
    );
  }

  const response = await fetch(booksApiUrl.toString());
  if (!response.ok) {
    throw new Error(`Books API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.items ?? [];
};

// w154 is TMDB's smallest poster size that stays sharp on retina screens
// at the ~60px width used in search results.
const TMDB_POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w154';

const getTmdbApiKey = () => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
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
    overview: movie.overview ?? '',
    releaseDate: movie.release_date ?? '',
    posterUrl: movie.poster_path
      ? `${TMDB_POSTER_BASE_URL}${movie.poster_path}`
      : '',
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
