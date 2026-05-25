import React from 'react';
import { Box } from '@mui/material';
import { FilterBar } from './FilterBar';
import { MediaTable } from './MediaTable';

export const MediaDiary = () => {
  return (
    <Box>
      <FilterBar />
      <MediaTable />
    </Box>
  );
};
