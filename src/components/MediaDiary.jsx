import React from 'react';
import { Box } from '@mui/material';
import { PageHeader } from './PageHeader';
import { MediaTable } from './MediaTable';

export const MediaDiary = () => {
  return (
    <Box sx={{ px: { xs: 0, md: 4 } }}>
      <PageHeader />
      <MediaTable />
    </Box>
  );
};
