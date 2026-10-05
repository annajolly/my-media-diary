import React from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  BookIcon,
  CheckCircleIcon,
  FilmReelIcon,
  XIcon,
} from '@phosphor-icons/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMovieDetails,
  searchBooksByTerm,
  searchMoviesByTitle,
} from '../api/media';
import { getReleaseYear } from '../utils/release-year';
import { useUpdateMediaEntryMutation } from '../queries/mediaQueries';
import { MoviePoster } from './MoviePoster';

const isBlank = (value) => {
  const text = (value ?? '').toString().trim();
  return !text || text.toLowerCase() === 'unknown';
};

export const getMissingMetadataFields = (entry) => {
  const missing = [];
  if (isBlank(entry.creator)) missing.push('creator');
  if (isBlank(entry.releaseDate)) missing.push('releaseDate');
  return missing;
};

export const hasMissingMetadata = (entry) =>
  getMissingMetadataFields(entry).length > 0;

// Normalize book and movie search results into one shape for display.
const toResultOptions = (mediaType, results) => {
  if (mediaType === 'book') {
    return results.map(({ id, volumeInfo = {} }) => ({
      id: String(id),
      title: volumeInfo.title ?? 'Untitled',
      creator: volumeInfo.authors?.join(', ') ?? '',
      releaseDate: volumeInfo.publishedDate ?? '',
    }));
  }

  return results.map((movie) => ({
    id: String(movie.id),
    title: movie.title ?? 'Untitled',
    creator: '',
    releaseDate: movie.releaseDate ?? '',
    overview: movie.overview ?? '',
    posterUrl: movie.posterUrl ?? '',
  }));
};

const searchByMediaType = async (mediaType, title) => {
  const results =
    mediaType === 'book'
      ? await searchBooksByTerm(title)
      : await searchMoviesByTitle(title);
  return toResultOptions(mediaType, results);
};

const movieDetailsQueryOptions = (movieId) => ({
  queryKey: ['movieDetails', String(movieId)],
  queryFn: () => getMovieDetails(movieId),
  staleTime: Infinity,
});

// Search results don't include a movie's creator, so each movie row fetches
// its details. Results are cached and reused when the user applies a match.
const ResultCreator = ({ result, mediaType }) => {
  const detailsQuery = useQuery({
    ...movieDetailsQueryOptions(result.id),
    enabled: mediaType === 'movie',
  });

  if (mediaType !== 'movie') {
    return result.creator || 'Unknown creator';
  }

  if (detailsQuery.isPending) {
    return (
      <Skeleton variant="text" width={90} sx={{ display: 'inline-block' }} />
    );
  }

  const creator = detailsQuery.data?.creator;
  return isBlank(creator) ? 'Unknown creator' : creator;
};

const SearchResultLabel = ({ result, mediaType }) => (
  <Stack direction="row" sx={{ gap: 2, alignItems: 'flex-start' }}>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography sx={{ fontWeight: 600 }}>{result.title}</Typography>
      <Typography variant="body2" color="text.secondary">
        <ResultCreator result={result} mediaType={mediaType} />
        {' · '}
        {getReleaseYear(result.releaseDate) ?? 'Unknown year'}
      </Typography>
      {result.overview && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {result.overview}
        </Typography>
      )}
    </Box>
    {mediaType === 'movie' && (
      <MoviePoster src={result.posterUrl} title={result.title} />
    )}
  </Stack>
);

const FIELD_LABELS = { creator: 'Creator', releaseDate: 'Release year' };

const AutoFillStep = ({
  entry,
  onApply,
  onSkip,
  onBack,
  canGoBack,
  isLast,
}) => {
  const missingFields = getMissingMetadataFields(entry);
  const initialSearch =
    entry.mediaType === 'movie'
      ? entry.title
      : `${entry.title} ${entry.creator}`;
  const [searchInput, setSearchInput] = React.useState(initialSearch ?? '');
  const [searchTerm, setSearchTerm] = React.useState(initialSearch ?? '');
  const [selectedId, setSelectedId] = React.useState('');
  const [isApplying, setIsApplying] = React.useState(false);
  const [error, setError] = React.useState('');
  const queryClient = useQueryClient();

  const searchQuery = useQuery({
    queryKey: ['metadataSearch', entry.mediaType, searchTerm],
    queryFn: () => searchByMediaType(entry.mediaType, searchTerm),
    enabled: Boolean(searchTerm.trim()),
    staleTime: 5 * 60 * 1000,
  });

  const results = searchQuery.data ?? [];
  const selectedResult = results.find((result) => result.id === selectedId);

  const handleSearch = (event) => {
    event.preventDefault();
    setSelectedId('');
    setSearchTerm(searchInput.trim());
  };

  const handleApply = async () => {
    if (!selectedResult) return;

    setIsApplying(true);
    setError('');

    try {
      let { creator, releaseDate } = selectedResult;

      // Movie search results don't include a creator; fetch full details.
      if (entry.mediaType === 'movie' && missingFields.includes('creator')) {
        const details = await queryClient.fetchQuery(
          movieDetailsQueryOptions(selectedResult.id),
        );
        creator = details.creator;
        releaseDate = releaseDate || details.releaseDate;
      }

      const found = { creator, releaseDate };
      const data = {};
      missingFields.forEach((field) => {
        if (!isBlank(found[field])) data[field] = found[field];
      });

      if (Object.keys(data).length === 0) {
        setError(
          'That result has no data for the missing fields. Pick another result or skip.',
        );
        return;
      }

      await onApply(data);
    } catch (err) {
      setError('Could not save the metadata. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  const MediaIcon = entry.mediaType === 'book' ? BookIcon : FilmReelIcon;

  return (
    <>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <MediaIcon size={28} weight="fill" color="#04b4a2" />
            <Box>
              <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                {entry.title}
              </Typography>
              {!missingFields.includes('creator') && (
                <Typography variant="body2" color="text.secondary">
                  {entry.creator}
                </Typography>
              )}
              <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                {missingFields.map((field) => (
                  <Chip
                    key={field}
                    size="small"
                    variant="outlined"
                    color="warning"
                    label={`Missing ${FIELD_LABELS[field].toLowerCase()}`}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>

          {error && <Alert severity="error">{error}</Alert>}

          <Stack
            component="form"
            direction="row"
            spacing={2}
            onSubmit={handleSearch}
            sx={{ alignItems: 'center' }}
          >
            <TextField
              label={
                entry.mediaType === 'book' ? 'Search books' : 'Search movies'
              }
              size="small"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              sx={{ flexGrow: 1 }}
            />
            <Button type="submit" variant="outlined">
              Search
            </Button>
          </Stack>

          <Box sx={{ minHeight: 200, maxHeight: 340, overflowY: 'auto' }}>
            {searchQuery.isFetching && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={28} />
              </Box>
            )}
            {searchQuery.isError && !searchQuery.isFetching && (
              <Alert severity="error">
                Search failed: {searchQuery.error.message}
              </Alert>
            )}
            {searchQuery.isSuccess &&
              !searchQuery.isFetching &&
              results.length === 0 && (
                <Typography color="text.secondary" sx={{ py: 2 }}>
                  No results. Try a different search, or skip this one.
                </Typography>
              )}
            {!searchQuery.isFetching && results.length > 0 && (
              <RadioGroup
                aria-label="metadata search results"
                value={selectedId}
                onChange={(event) => setSelectedId(event.target.value)}
              >
                {results.map((result) => (
                  <FormControlLabel
                    key={result.id}
                    value={result.id}
                    control={<Radio size="small" />}
                    label={
                      <SearchResultLabel
                        result={result}
                        mediaType={entry.mediaType}
                      />
                    }
                    sx={{
                      alignItems: 'flex-start',
                      py: 0.5,
                      mr: 0,
                      '& .MuiRadio-root': { pt: 0.5 },
                      '& .MuiFormControlLabel-label': { flex: 1, minWidth: 0 },
                    }}
                  />
                ))}
              </RadioGroup>
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button
          color="default"
          onClick={onBack}
          disabled={!canGoBack || isApplying}
        >
          Back
        </Button>
        <Stack direction="row" spacing={1}>
          <Button color="default" onClick={onSkip} disabled={isApplying}>
            Skip
          </Button>
          <Button
            variant="contained"
            onClick={handleApply}
            disabled={!selectedResult || isApplying}
            startIcon={
              isApplying ? <CircularProgress size={16} color="inherit" /> : null
            }
          >
            {isLast ? 'Apply & finish' : 'Apply & next'}
          </Button>
        </Stack>
      </DialogActions>
    </>
  );
};

export const AutoFillMetadataDialog = ({ open, onClose, entries }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  // Per-entry outcome: 'updated' | 'skipped'
  const [outcomes, setOutcomes] = React.useState({});
  const updateMutation = useUpdateMediaEntryMutation();

  const total = entries.length;
  const isComplete = activeStep >= total;
  const currentEntry = entries[activeStep];

  const goNext = () => setActiveStep((step) => step + 1);
  const goBack = () => setActiveStep((step) => Math.max(0, step - 1));

  const handleApply = async (data) => {
    await updateMutation.mutateAsync({
      id: currentEntry.id,
      mediaType: currentEntry.mediaType,
      data,
    });
    setOutcomes((prev) => ({ ...prev, [currentEntry.id]: 'updated' }));
    goNext();
  };

  const handleSkip = () => {
    setOutcomes((prev) => ({
      ...prev,
      [currentEntry.id]: prev[currentEntry.id] ?? 'skipped',
    }));
    goNext();
  };

  const updatedCount = Object.values(outcomes).filter(
    (outcome) => outcome === 'updated',
  ).length;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 7 }}>Auto-fill metadata</DialogTitle>
      <IconButton
        aria-label="Close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          color: 'text.secondary',
        }}
      >
        <XIcon size={20} />
      </IconButton>
      {total > 0 && (
        <Box sx={{ px: 3, pb: 1.5 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
            {isComplete ? 'All done' : `Item ${activeStep + 1} of ${total}`}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(Math.min(activeStep, total) / total) * 100}
          />
        </Box>
      )}

      {total === 0 && (
        <>
          <DialogContent dividers>
            <Typography>
              Every entry already has a creator and release year.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={onClose}>
              Close
            </Button>
          </DialogActions>
        </>
      )}

      {total > 0 && !isComplete && (
        <AutoFillStep
          key={currentEntry.id}
          entry={currentEntry}
          onApply={handleApply}
          onSkip={handleSkip}
          onBack={goBack}
          canGoBack={activeStep > 0}
          isLast={activeStep === total - 1}
        />
      )}

      {total > 0 && isComplete && (
        <>
          <DialogContent dividers>
            <Stack spacing={1.5} sx={{ alignItems: 'center', py: 3 }}>
              <CheckCircleIcon size={48} weight="fill" color="#04b4a2" />
              <Typography variant="h6">Metadata review complete</Typography>
              <Typography color="text.secondary">
                Updated {updatedCount} of {total}{' '}
                {total === 1 ? 'entry' : 'entries'}.
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button color="default" onClick={goBack}>
              Back
            </Button>
            <Button variant="contained" onClick={onClose}>
              Done
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};
