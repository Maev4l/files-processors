import { useState } from 'react';
import { Grid, Typography } from '@mui/material';

import Dropzone from './Dropzone';
import ActionButton from './ActionButton';

const ToolPage = ({ actionButtonLabel, headerText, acceptedFiles, onAction }) => {
  const [files, setFiles] = useState([]);

  const onDropAreaChange = (loadedFiles) => {
    setFiles(loadedFiles);
  };

  return (
    <Grid container justifyContent="center">
      {headerText && (
        <Typography variant="h4" sx={{ m: '0.25rem' }}>
          {headerText}
        </Typography>
      )}
      <Dropzone onChange={onDropAreaChange} acceptedFiles={acceptedFiles} />

      <ActionButton
        label={actionButtonLabel}
        disabled={!(files.length > 0)}
        onClick={() => {
          onAction(files);
        }}
      />
    </Grid>
  );
};

export default ToolPage;
