import React from 'react';
import { Box } from '@mui/material';
import { FilmReelIcon } from '@phosphor-icons/react';

const POSTER_WIDTH = 60;
const POSTER_HEIGHT = 90; // TMDB posters are 2:3

export const MoviePoster = ({ src, title }) => {
  const [hasError, setHasError] = React.useState(false);
  const showImage = src && !hasError;

  return (
    <Box
      sx={{
        width: POSTER_WIDTH,
        height: POSTER_HEIGHT,
        flexShrink: 0,
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: 'action.hover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.disabled',
      }}
    >
      {showImage ? (
        <Box
          component="img"
          src={src}
          alt={`${title} poster`}
          loading="lazy"
          onError={() => setHasError(true)}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <FilmReelIcon size={24} />
      )}
    </Box>
  );
};
