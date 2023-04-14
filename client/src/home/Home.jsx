// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Grid, Typography, Stack } from '@mui/material';
import ToolCard from './ToolCard';

const TOOLCARDS = [
  {
    to: '/convert2pdf',
    component: (
      <>
        <Typography gutterBottom variant="h5" component="div">
          Convert images to PDF
        </Typography>
        <Typography gutterBottom component="div">
          (only PNG and JPEG formats are supported)
        </Typography>
      </>
    ),
  },
  {
    to: '/mergepdf',
    component: (
      <Typography gutterBottom variant="h5" component="div">
        Merge PDF files
      </Typography>
    ),
  },
];

const Home = () => (
  <Stack spacing={2}>
    <Typography gutterBottom variant="h4">
      What do you want to do ?
    </Typography>
    <Grid container spacing={2} alignItems="stretch">
      {TOOLCARDS.map((c) => (
        <ToolCard key={c.to} card={c} />
      ))}
    </Grid>
  </Stack>
);

export default Home;
